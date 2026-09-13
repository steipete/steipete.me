import { next, rewrite } from "@vercel/functions";
import { markdownTarget } from "./utils/markdownRouting.ts";

export default function proxy(request: Request) {
  const target = markdownTarget(request);
  return target ? rewrite(target) : next();
}
