// lib/upload.ts — Secure file upload handler
// Replaces includes/functions.php (handle_secure_upload, etc.)

import { getR2 } from './db';

export const UPLOAD_MAX_BYTES = 5 * 1024 * 1024; // 5MB

export const ALLOWED_UPLOADS: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
  'application/pdf': ['pdf'],
};

export const BLOCKED_EXTENSIONS = [
  'php', 'phtml', 'php3', 'php4', 'php5', 'php7', 'pht',
  'exe', 'sh', 'cgi', 'bat', 'cmd', 'com', 'js', 'jsp',
  'asp', 'aspx', 'py', 'pl', 'rb',
];

export class UploadRejected extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadRejected';
  }
}

export interface UploadMeta {
  original_filename: string;
  stored_filename: string;
  mime_type: string;
  file_size: number;
  checksum_sha256: string;
}

function randomHex(bytes: number): string {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function handleSecureUpload(
  file: File,
  subfolder: string
): Promise<UploadMeta> {
  if (!file || file.size === 0) throw new UploadRejected('No file was uploaded.');
  if (file.size > UPLOAD_MAX_BYTES) throw new UploadRejected('File exceeds maximum allowed size.');

  const originalName = file.name;
  const ext = originalName.split('.').pop()?.toLowerCase() ?? '';

  if (BLOCKED_EXTENSIONS.includes(ext)) {
    throw new UploadRejected('This file type is not allowed.');
  }

  const mime = file.type;
  if (!ALLOWED_UPLOADS[mime]) {
    throw new UploadRejected('Unsupported file type: ' + mime);
  }

  const allowedExts = ALLOWED_UPLOADS[mime];
  if (!allowedExts.includes(ext)) {
    throw new UploadRejected('File extension does not match its actual content.');
  }

  const buffer = await file.arrayBuffer();
  const checksum = await sha256Hex(buffer);
  const safeExt = ext === 'jpeg' ? 'jpg' : ext;
  const storedFilename = `${subfolder}/${randomHex(16)}.${safeExt}`;

  const r2 = getR2();
  await r2.put(storedFilename, buffer, {
    httpMetadata: { contentType: mime },
    customMetadata: { originalFilename: originalName, checksum },
  });

  return {
    original_filename: originalName.slice(0, 255),
    stored_filename: storedFilename,
    mime_type: mime,
    file_size: file.size,
    checksum_sha256: checksum,
  };
}

// Handle camera capture (base64 data URL)
export async function handleDataUrlUpload(
  dataUrl: string,
  subfolder: string
): Promise<UploadMeta> {
  const match = dataUrl.match(/^data:(image\/(jpeg|png|webp));base64,(.+)$/);
  if (!match) throw new UploadRejected('Invalid camera capture format.');

  const mime = match[1];
  const ext = match[2] === 'jpeg' ? 'jpg' : match[2];
  const base64 = match[3];

  const binary = atob(base64);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);

  if (buffer.length > UPLOAD_MAX_BYTES) throw new UploadRejected('Captured photo exceeds maximum allowed size.');

  const checksum = await sha256Hex(buffer.buffer);
  const storedFilename = `${subfolder}/${randomHex(16)}.${ext}`;

  const r2 = getR2();
  await r2.put(storedFilename, buffer.buffer, {
    httpMetadata: { contentType: mime },
    customMetadata: { checksum },
  });

  return {
    original_filename: `camera_photo.${ext}`,
    stored_filename: storedFilename,
    mime_type: mime,
    file_size: buffer.length,
    checksum_sha256: checksum,
  };
}

// Serve file from R2
export async function getFileFromR2(storedFilename: string): Promise<R2ObjectBody | null> {
  const r2 = getR2();
  return r2.get(storedFilename);
}
