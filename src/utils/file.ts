/**
 * 
 * @param disposition 
 * @returns 
 */
export const getFilenameFromDisposition = (disposition?: string | null) => {
  if (!disposition) return null;
  const m = /filename\*?=(?:UTF-8''|")?([^\";]+)/i.exec(disposition);
  if (!m) return null;
  try { return decodeURIComponent(m[1].replace(/"/g, "")); }
  catch { return m[1].replace(/"/g, ""); }
}

/**
 * 
 * @param blob 
 * @param fileName 
 */
export const saveBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
