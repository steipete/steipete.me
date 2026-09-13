import { SITE } from "../config.ts";

interface Publication {
  pubDatetime: Date;
  draft?: boolean;
  unlisted?: boolean;
}

export interface PublicationOptions {
  now?: number;
  preview?: boolean;
}

export function isPublished(
  data: Publication,
  { now = Date.now(), preview = false }: PublicationOptions = {},
) {
  return !data.draft && (preview || now > data.pubDatetime.getTime() - SITE.scheduledPostMargin);
}

export function isListed(data: Publication, options?: PublicationOptions) {
  return !data.unlisted && isPublished(data, options);
}
