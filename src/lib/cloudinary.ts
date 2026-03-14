export function getDownloadUrl(url: string): string {
  if (!url) return '';
  return url.replace('/upload/', '/upload/fl_attachment/');
}
