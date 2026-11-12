import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
async function list(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map(async (entry) =>
        entry.isDirectory()
          ? list(join(dir, entry.name))
          : join(dir, entry.name),
      ),
    )
  ).flat();
}
const files = (await list("dist"))
  .filter((file) => !file.endsWith("sw.js") && !file.endsWith("CNAME"))
  .sort();
const hash = createHash("sha256");
for (const file of files) hash.update(await readFile(file));
const version = hash.digest("hex").slice(0, 12);
const precache = [
  "/",
  ...files.map((file) => "/" + file.replace(/^dist\//, "")),
];
const worker = `const CACHE='workbench-${version}';
const FILES=${JSON.stringify(precache)};
let disabled=false;
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('workbench-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('message',event=>{if(event.data?.type==='DISABLE_CACHE'){disabled=true;event.ports[0]?.postMessage('disabled');}});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(disabled||request.method!=='GET'||url.origin!==self.location.origin||url.pathname==='/sw.js')return;
 if(request.mode==='navigate'){
  event.respondWith(fetch(request).catch(()=>caches.open(CACHE).then(cache=>cache.match('/index.html',{ignoreVary:true})).then(response=>response||Response.error())));
 }else if(FILES.includes(url.pathname)){
  event.respondWith(caches.open(CACHE).then(cache=>cache.match(url.pathname,{ignoreVary:true})).then(cached=>cached||fetch(request)));
 }
});
`;
await writeFile("dist/sw.js", worker);
console.log(`Offline cache: ${precache.length} resources, version ${version}`);
