export function getDownloadUrl(url: string): string {
  if (!url) return url;
  return url.includes('/raw/upload/')
    ? url.replace('/raw/upload/', '/raw/upload/fl_attachment/')
    : url;
}
