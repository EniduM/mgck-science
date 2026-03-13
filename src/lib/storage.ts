/**
 * storage.ts – client-side Cloudinary upload helpers.
 *
 * All uploads are proxied through the Next.js API route `/api/upload`
 * which signs and forwards the request to Cloudinary using server-only
 * credentials.  No Cloudinary secrets are ever exposed to the browser.
 */

// ============================================================================
// Types
// ============================================================================

export interface UploadConfig {
  maxSize?: number;           // bytes
  allowedMimeTypes?: string[];
}

export interface FileUploadResult {
  downloadUrl: string;
  publicId: string;           // Cloudinary public_id (used for deletion)
  fileName: string;
  fileSize: string;
  uploadedAt: Date;
  format: string;
}

// ============================================================================
// Shared helpers
// ============================================================================

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function validateFile(file: File, config: UploadConfig): void {
  if (!file) throw new Error('No file provided');
  if (config.maxSize && file.size > config.maxSize) {
    const maxMB = (config.maxSize / 1024 / 1024).toFixed(2);
    throw new Error(
      `File size exceeds ${maxMB} MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)} MB`
    );
  }
  if (config.allowedMimeTypes && !config.allowedMimeTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type. Allowed: ${config.allowedMimeTypes.join(', ')}`
    );
  }
}

/** POSTs a single file to the Next.js /api/upload route. */
async function uploadToCloudinary(
  file: File,
  folder: string,
  resourceType: 'image' | 'raw' = 'image'
): Promise<FileUploadResult> {
  const body = new FormData();
  body.append('file', file);
  body.append('folder', folder);
  body.append('resource_type', resourceType);

  const res = await fetch('/api/upload', { method: 'POST', body });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error ?? 'Upload failed');
  }

  const data: { url: string; publicId: string; format: string; bytes: number } =
    await res.json();

  return {
    downloadUrl: data.url,
    publicId: data.publicId,
    fileName: file.name,
    fileSize: formatFileSize(data.bytes ?? file.size),
    uploadedAt: new Date(),
    format: data.format,
  };
}

// ============================================================================
// Image uploads
// ============================================================================

const IMAGE_CONFIG: UploadConfig = {
  maxSize: 5 * 1024 * 1024,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
};

/**
 * Upload a single image to Cloudinary.
 * @param file   Image file to upload
 * @param folder Cloudinary folder (e.g. 'mgck-science/events')
 */
export async function uploadImage(
  file: File,
  folder = 'mgck-science/images',
  customConfig?: Partial<UploadConfig>
): Promise<FileUploadResult> {
  validateFile(file, { ...IMAGE_CONFIG, ...customConfig });
  return uploadToCloudinary(file, folder, 'image');
}

/**
 * Upload multiple images to Cloudinary (max 10).
 */
export async function uploadImages(
  files: File[],
  folder = 'mgck-science/images',
  customConfig?: Partial<UploadConfig>
): Promise<FileUploadResult[]> {
  if (!files?.length) throw new Error('No files provided');
  if (files.length > 10) throw new Error('Maximum 10 images at a time');
  return Promise.all(files.map((f) => uploadImage(f, folder, customConfig)));
}

// ============================================================================
// PDF uploads
// ============================================================================

const PDF_CONFIG: UploadConfig = {
  maxSize: 10 * 1024 * 1024,
  allowedMimeTypes: ['application/pdf'],
};

/**
 * Upload a single PDF to Cloudinary.
 * Uses resource_type 'raw' so Cloudinary stores it as a downloadable file.
 */
export async function uploadPDF(
  file: File,
  customConfig?: Partial<UploadConfig>
): Promise<FileUploadResult> {
  validateFile(file, { ...PDF_CONFIG, ...customConfig });
  return uploadToCloudinary(file, 'mgck-science/papers', 'raw');
}

/**
 * Upload multiple PDFs (max 10).
 */
export async function uploadPDFs(
  files: File[],
  customConfig?: Partial<UploadConfig>
): Promise<FileUploadResult[]> {
  if (!files?.length) throw new Error('No files provided');
  if (files.length > 10) throw new Error('Maximum 10 PDFs at a time');
  return Promise.all(files.map((f) => uploadPDF(f, customConfig)));
}

// ============================================================================
// Delete a file from Cloudinary
// ============================================================================

/**
 * Delete a file from Cloudinary by its publicId.
 * @param publicId     Cloudinary public_id returned at upload time
 * @param resourceType 'image' (default) or 'raw' (for PDFs)
 */
export async function deleteFile(
  publicId: string,
  resourceType: 'image' | 'raw' = 'image'
): Promise<void> {
  if (!publicId) throw new Error('publicId is required');

  const res = await fetch('/api/upload', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId, resourceType }),
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error ?? 'Delete failed');
  }
}

/**
 * Delete multiple files from Cloudinary.
 */
export async function deleteFiles(
  publicIds: string[],
  resourceType: 'image' | 'raw' = 'image'
): Promise<void> {
  if (!publicIds?.length) throw new Error('No publicIds provided');
  await Promise.all(publicIds.map((id) => deleteFile(id, resourceType)));
}

// ============================================================================
// Convenience folder constants
// ============================================================================

export const cloudinaryFolders = {
  events: 'mgck-science/events',
  achievements: 'mgck-science/achievements',
  papers: 'mgck-science/papers',
  members: 'mgck-science/members',
  gallery: (category: string) => `mgck-science/gallery/${category}`,
};
