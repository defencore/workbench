import { Bookmark } from "lucide-react";
import type { Lang } from "../data/types";
import type { Preferences } from "../storage";
import { tr } from "../data/ui";
export default function SaveButton({
  id,
  prefs,
  toggle,
  lang,
  large = false,
}: {
  id: string;
  prefs: Preferences;
  toggle: (field: "saved" | "completed" | "checks", id: string) => void;
  lang: Lang;
  large?: boolean;
}) {
  const saved = prefs.saved.includes(id);
  return (
    <button
      className={`${large ? "button button-secondary" : "icon-button save-button"} ${saved ? "is-saved" : ""}`}
      aria-label={tr(saved ? "unsave" : "savedAction", lang)}
      aria-pressed={saved}
      onClick={(e) => {
        e.stopPropagation();
        toggle("saved", id);
      }}
    >
      <Bookmark size={large ? 17 : 18} fill={saved ? "currentColor" : "none"} />
      {large && tr(saved ? "savedLabel" : "savedAction", lang)}
    </button>
  );
}
