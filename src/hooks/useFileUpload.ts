// hooks/useFileUpload.ts
'use client';

import { useCallback } from 'react';

interface PresignedUrlResponse {
  url: string;
}

interface UseFileUploadOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * useFileUpload
 *
 * A React hook to handle file uploads using a presigned URL flow.
 * It first fetches a presigned S3 URL from the backend, then uploads
 * the file directly to S3 using that URL.
 *
 * @param apiUrl - The backend API endpoint that returns the presigned URL
 * @param options - Optional success/error callbacks
 * @returns { uploadFile } - Function to trigger the upload
 */
export function useFileUpload(apiUrl: string, options?: UseFileUploadOptions) {
  const uploadFile = useCallback(
    async (file: File, token: string): Promise<void> => {
      try {
        // Step 1: Get a presigned URL from your backend
        const presignedRes = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
          }),
        });

        if (!presignedRes.ok) {
          throw new Error(`Presigned URL fetch failed: ${presignedRes.status}`);
        }

        const { url }: PresignedUrlResponse = await presignedRes.json();

        // Step 2: Upload the file directly to S3 using the presigned URL
        const s3UploadRes = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if (!s3UploadRes.ok) {
          throw new Error(`S3 upload failed: ${s3UploadRes.status}`);
        }

        options?.onSuccess?.();
      } catch (error: any) {
        console.error('Upload error:', error);
        options?.onError?.(error);
      }
    },
    [apiUrl, options]
  );

  return { uploadFile };
}
