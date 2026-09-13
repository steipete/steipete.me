import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";

export function getPath(id: string, filePath: string | undefined, includeBase = true) {
  const pathSegments = filePath
    ?.replace(BLOG_PATH, "")
    .split("/")
    .filter((path) => path !== "" && !path.startsWith("_"))
    .slice(0, -1)
    .map(slugifyStr);

  const basePath = includeBase ? "/posts" : "";

  const slug = id.split("/").at(-1);
  return [basePath, ...(pathSegments ?? []), slug].join("/");
}
