#!/usr/bin/env python3
"""Export verified nominal STEP solids from Workbench Project JSON.

Run with the Python interpreter supplied by an installed FreeCAD distribution.
The script uses pure Part shapes. It never creates a FreeCAD document, changes
an open document, imports FreeCADGui, or starts a GUI.

Example:
    freecad-python scripts/export-project-cad.py --input /tmp/projects.json \
        --output public/models

The JSON input is a Project array or an object with a ``projects`` array. Only
``id``, ``revision``, ``part``, and made fixtures with ``geometry`` are consumed.
Dimensions are nominal millimetres. Threads, tolerances, small chamfers and
physical drill-point forms are not inferred from text or added to geometry.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
from pathlib import Path
import re
import shutil
import sys
import tempfile
from datetime import datetime, timezone

# Installed FreeCAD builds may keep extension modules beside the Python prefix.
_prefix_lib = Path(sys.prefix) / "lib"
if (_prefix_lib / "FreeCAD.so").exists():
    sys.path.insert(0, str(_prefix_lib))
try:
    import FreeCAD as App
    import Part
except ImportError as exc:
    raise SystemExit(
        "FreeCAD Part is unavailable. Run this script with FreeCAD's Python "
        "environment; no new software is installed by this exporter."
    ) from exc

VERSION = "1.0.0"
EPSILON = 1e-5
SLUG = re.compile(r"^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$")
LIMITATIONS = {
    "uk": "Номінальна твердотільна BRep-модель у мм. Різьбу, допуски, малі фаски та форму вершини свердла не відтворено, якщо їх немає в числовій геометрії. Це не готова керуюча програма й не підтвердження фізичного виготовлення. Приймання — за таблицею вимог проєкту.",
    "en": "Nominal solid BRep model in millimetres. Threads, tolerances, small chamfers and drill-point forms are not represented unless present in numeric geometry. This is not a machine program or evidence of physical manufacture. The project requirements table controls acceptance.",
}


def positive(value, field):
    value = float(value)
    if not math.isfinite(value) or value <= 0:
        raise ValueError(f"{field} must be a positive finite number")
    return value


def nonnegative(value, field):
    value = float(value)
    if not math.isfinite(value) or value < 0:
        raise ValueError(f"{field} must be nonnegative and finite")
    return value


def fuse(shapes):
    if not shapes:
        raise ValueError("No material was generated")
    result = shapes[0]
    for shape in shapes[1:]:
        result = result.fuse(shape)
    return result.removeSplitter()


def rounded_rectangle(x, y, z, width, depth, height, radius=0):
    """An exact rounded rectangle extruded along Z; no polygon tessellation."""
    width = positive(width, "width")
    depth = positive(depth, "depth")
    height = positive(height, "extrusion height")
    radius = nonnegative(radius, "corner radius")
    if radius > min(width, depth) / 2 + EPSILON:
        raise ValueError("Corner radius exceeds half the smaller side")
    if radius <= EPSILON:
        return Part.makeBox(width, depth, height, App.Vector(x, y, z))
    shapes = []
    if width - 2 * radius > EPSILON:
        shapes.append(Part.makeBox(width - 2 * radius, depth, height,
                                   App.Vector(x + radius, y, z)))
    if depth - 2 * radius > EPSILON:
        shapes.append(Part.makeBox(width, depth - 2 * radius, height,
                                   App.Vector(x, y + radius, z)))
    centers = {(x + radius, y + radius), (x + width - radius, y + radius),
               (x + radius, y + depth - radius),
               (x + width - radius, y + depth - radius)}
    for cx, cy in centers:
        shapes.append(Part.makeCylinder(radius, height, App.Vector(cx, cy, z)))
    return fuse(shapes)


def cut_axial_hole(shape, x, y, diameter, depth, length, counterbore=None):
    """Turned face-hole x/y map to radial Y/Z; the longitudinal axis is X."""
    diameter = positive(diameter, "hole diameter")
    hole_depth = length if depth is None else positive(depth, "hole depth")
    if hole_depth > length + EPSILON:
        raise ValueError("Hole depth exceeds the part length")
    extra = EPSILON if depth is None else 0.0
    cutter = Part.makeCylinder(diameter / 2, hole_depth + EPSILON + extra,
                               App.Vector(-EPSILON, x, y), App.Vector(1, 0, 0))
    shape = shape.cut(cutter)
    if counterbore:
        cb_depth = positive(counterbore["depth"], "counterbore depth")
        cb_diameter = positive(counterbore["diameter"], "counterbore diameter")
        if cb_depth > hole_depth + EPSILON or cb_diameter < diameter:
            raise ValueError("Counterbore must be wider and no deeper than its hole")
        cutter = Part.makeCylinder(cb_diameter / 2, cb_depth + EPSILON,
                                   App.Vector(-EPSILON, x, y), App.Vector(1, 0, 0))
        shape = shape.cut(cutter)
    return shape


def turned(geometry):
    sections = geometry.get("sections", [])
    if not sections:
        raise ValueError("Turned geometry needs sections")
    cursor, solids, largest = 0.0, [], 0.0
    for section in sections:
        length = positive(section["length"], "section length")
        diameter = positive(section["diameter"], "section diameter")
        solids.append(Part.makeCylinder(diameter / 2, length,
                                       App.Vector(cursor, 0, 0), App.Vector(1, 0, 0)))
        cursor += length
        largest = max(largest, diameter)
    shape = fuse(solids)
    bore = geometry.get("bore")
    if bore:
        shape = cut_axial_hole(shape, 0, 0, bore["diameter"], bore.get("depth"),
                               cursor, bore.get("counterbore"))
    for hole in geometry.get("holes", []):
        shape = cut_axial_hole(shape, float(hole["x"]), float(hole["y"]),
                               hole["diameter"], hole.get("depth"), cursor,
                               hole.get("counterbore"))
    return shape.removeSplitter(), [cursor, largest, largest]


def block(geometry):
    width = positive(geometry["width"], "block width")
    depth = positive(geometry["depth"], "block depth")
    height = positive(geometry["height"], "block height")
    shape = rounded_rectangle(0, 0, 0, width, depth, height,
                               geometry.get("cornerRadius", 0))
    for hole in geometry.get("holes", []):
        diameter = positive(hole["diameter"], "hole diameter")
        hole_depth = height if hole.get("depth") is None else positive(hole["depth"], "hole depth")
        if hole_depth > height + EPSILON:
            raise ValueError("Hole depth exceeds block height")
        bottom = height - hole_depth
        extra = EPSILON if hole.get("depth") is None else 0.0
        cutter = Part.makeCylinder(diameter / 2, hole_depth + EPSILON + extra,
                                   App.Vector(float(hole["x"]), float(hole["y"]), bottom - extra))
        shape = shape.cut(cutter)
        counterbore = hole.get("counterbore")
        if counterbore:
            cb_depth = positive(counterbore["depth"], "counterbore depth")
            cb_diameter = positive(counterbore["diameter"], "counterbore diameter")
            if cb_depth > hole_depth + EPSILON or cb_diameter < diameter:
                raise ValueError("Counterbore must be wider and no deeper than its hole")
            cutter = Part.makeCylinder(cb_diameter / 2, cb_depth + EPSILON,
                                       App.Vector(float(hole["x"]), float(hole["y"]), height - cb_depth))
            shape = shape.cut(cutter)
    for pocket in geometry.get("pockets", []):
        cut_depth = positive(pocket["cutDepth"], "pocket depth")
        if cut_depth > height + EPSILON:
            raise ValueError("Pocket depth exceeds block height")
        bottom = height - cut_depth
        extra = EPSILON if abs(cut_depth - height) <= EPSILON else 0.0
        cutter = rounded_rectangle(float(pocket["x"]), float(pocket["y"]), bottom - extra,
                                    pocket["width"], pocket["depth"], cut_depth + EPSILON + extra,
                                    pocket.get("cornerRadius", 0))
        shape = shape.cut(cutter)
    for slot in geometry.get("slots", []):
        length = positive(slot["length"], "slot length")
        slot_width = positive(slot["width"], "slot width")
        cut_depth = positive(slot["cutDepth"], "slot depth")
        if length < slot_width or cut_depth > height + EPSILON:
            raise ValueError("Invalid slot length, width or depth")
        x_size, y_size = (length, slot_width) if slot["axis"] == "x" else (slot_width, length)
        bottom = height - cut_depth
        extra = EPSILON if abs(cut_depth - height) <= EPSILON else 0.0
        cutter = rounded_rectangle(float(slot["x"]) - x_size / 2,
                                    float(slot["y"]) - y_size / 2, bottom - extra,
                                    x_size, y_size, cut_depth + EPSILON + extra, slot_width / 2)
        shape = shape.cut(cutter)
    return shape.removeSplitter(), [width, depth, height]


def build_geometry(geometry):
    kind = geometry.get("kind")
    if kind == "turned":
        return turned(geometry)
    if kind == "block":
        return block(geometry)
    raise ValueError(f"Unknown part geometry kind: {kind!r}")


def shape_report(shape):
    bounds = shape.BoundBox
    report = {"valid": bool(shape.isValid()), "solidCount": len(shape.Solids),
              "volumeMM3": float(shape.Volume),
              "boundsMM": {"min": [bounds.XMin, bounds.YMin, bounds.ZMin],
                           "max": [bounds.XMax, bounds.YMax, bounds.ZMax],
                           "size": [bounds.XLength, bounds.YLength, bounds.ZLength]}}
    if not report["valid"] or report["solidCount"] != 1 or report["volumeMM3"] <= 0:
        raise ValueError(f"Shape is not one valid positive-volume solid: {report}")
    return report


def geometry_digest(geometry):
    text = json.dumps(geometry, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def safe_id(value):
    if not isinstance(value, str) or not SLUG.fullmatch(value):
        raise ValueError(f"Unsafe model identifier: {value!r}")
    return value


def export_one(record, output):
    shape, expected = build_geometry(record["geometry"])
    before = shape_report(shape)
    bbox_error = max(abs(actual - target)
                     for actual, target in zip(before["boundsMM"]["size"], expected))
    if bbox_error > 1e-5:
        raise ValueError(f"Unexpected source bounds: {record['file']}: {before['boundsMM']['size']} vs {expected}")
    destination = output / record["file"]
    shape.exportStep(str(destination))
    reloaded = Part.read(str(destination))
    after = shape_report(reloaded)
    roundtrip_bounds_error = max(abs(a - b)
        for a, b in zip(before["boundsMM"]["size"], after["boundsMM"]["size"]))
    roundtrip_volume_error = abs(after["volumeMM3"] - before["volumeMM3"]) / before["volumeMM3"]
    if roundtrip_bounds_error > 1e-5 or roundtrip_volume_error > 1e-7:
        raise ValueError(f"STEP round-trip mismatch: {record['file']}")
    raw = destination.read_bytes()
    if not raw.startswith(b"ISO-10303-21;") or b"END-ISO-10303-21;" not in raw:
        raise ValueError(f"Invalid STEP exchange header: {record['file']}")
    entry = {key: record[key] for key in ["projectId", "fixtureId", "role", "revision", "file", "quantity"]}
    entry.update({"url": "/models/" + record["file"],
                  "geometrySha256": geometry_digest(record["geometry"]),
                  "sha256": hashlib.sha256(raw).hexdigest(), "bytes": len(raw),
                  "shape": before, "maxBoundsErrorMM": bbox_error,
                  "roundTrip": after,
                  "roundTripMaxBoundsErrorMM": roundtrip_bounds_error,
                  "roundTripRelativeVolumeError": roundtrip_volume_error})
    return entry


def records_from_projects(projects):
    records, names = [], set()
    for project in projects:
        project_id = safe_id(project["id"])
        revision = str(project["revision"])
        revision_slug = re.sub(r"[^a-zA-Z0-9_-]+", "-", revision).strip("-") or "revision"
        filename = project_id + "-" + revision_slug + "-" + geometry_digest(project["part"])[:12] + ".step"
        if filename in names:
            raise ValueError("Duplicate project model name: " + filename)
        names.add(filename)
        records.append({"projectId": project_id, "fixtureId": None,
                        "role": "part", "revision": revision,
                        "file": filename, "geometry": project["part"], "quantity": project.get("quantity", 1)})
        for fixture in project.get("fixtures", []):
            if not fixture.get("made") or not fixture.get("geometry"):
                continue
            fixture_id = safe_id(fixture["id"])
            filename = project_id + "-" + fixture_id + "-" + revision_slug + "-" + geometry_digest(fixture["geometry"])[:12] + ".step"
            if filename in names:
                raise ValueError("Duplicate fixture model name: " + filename)
            names.add(filename)
            records.append({"projectId": project_id, "fixtureId": fixture_id,
                            "role": "fixture", "revision": revision,
                            "file": filename, "geometry": fixture["geometry"], "quantity": 1})
    return records


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path("public/models"))
    args = parser.parse_args()
    data = json.loads(args.input.read_text(encoding="utf-8"))
    projects = data.get("projects") if isinstance(data, dict) else data
    if not isinstance(projects, list) or not projects:
        raise SystemExit("Input must contain a nonempty Project array")
    initial_documents = set(App.listDocuments())
    records = records_from_projects(projects)
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    staging = Path(tempfile.mkdtemp(prefix="workbench-step-", dir=output.parent))
    try:
        exported = []
        for record in records:
            entry = export_one(record, staging)
            exported.append(entry)
            print(json.dumps({"file": entry["file"], "valid": True,
                              "solids": entry["shape"]["solidCount"],
                              "volumeMM3": round(entry["shape"]["volumeMM3"], 6)}), flush=True)
        if set(App.listDocuments()) != initial_documents:
            raise RuntimeError("The pure-shape exporter unexpectedly changed document state")
        manifest = {"schemaVersion": 1, "units": "mm",
                    "generatedAt": datetime.now(timezone.utc).isoformat(),
                    "generator": {"name": "export-project-cad.py", "version": VERSION,
                                  "freecad": ".".join(App.Version()[0:3])},
                    "limitations": LIMITATIONS,
                    "coordinateFrames": {
                        "turned": {"axisAtoB": "X", "faceCoordinateX": "Y", "faceCoordinateY": "Z", "datumA": [0, 0, 0]},
                        "block": {"width": "X", "depth": "Y", "height": "Z", "datumCorner": [0, 0, 0]}
                    },
                    "projectCount": len(projects), "modelCount": len(exported),
                    "models": exported}
        manifest_path = staging / "index.json"
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        old_manifest = {}
        if (output / "index.json").exists():
            old_manifest = json.loads((output / "index.json").read_text(encoding="utf-8"))
        for entry in exported:
            os.replace(staging / entry["file"], output / entry["file"])
        os.replace(manifest_path, output / "index.json")
        current = {entry["file"] for entry in exported}
        for entry in old_manifest.get("models", []):
            filename = entry.get("file", "")
            if filename not in current and re.fullmatch(r"[a-zA-Z0-9_-]+\.step", filename):
                (output / filename).unlink(missing_ok=True)
        print(json.dumps({"exported": len(exported), "projects": len(projects),
                          "manifest": str(output / "index.json"),
                          "documentsUnchanged": True}), flush=True)
    finally:
        shutil.rmtree(staging, ignore_errors=True)


if __name__ == "__main__":
    main()
