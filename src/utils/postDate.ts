import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import { SITE } from "../config.ts";

dayjs.extend(utc);
dayjs.extend(timezone);

export function getPostDate(date: string | Date, postTimezone?: string) {
  return dayjs(date).tz(postTimezone || SITE.timezone);
}
