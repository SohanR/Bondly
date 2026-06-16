import { BASE_URL } from "../config";

const getMediaUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return BASE_URL.replace(/\/$/, "") + path;
};

export { getMediaUrl };
