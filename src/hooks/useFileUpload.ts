// hooks/useFileUpload.ts
'use client';

import { useCallback } from 'react';
import axios from 'axios';

interface PresignedUrlResponse {
  url: string;
}

interface UseFileUploadOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void; // 0–100%
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


        try {
          // Step 2: Upload the file to S3 with progress tracking
          await axios.put(url, file, {
            headers: { 'Content-Type': file.type },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              options?.onProgress?.(percent);
            }
          },
        });

      } catch (uploadError) {
          console.error('Could not update to S3:', uploadError);
          options?.onError?.(uploadError as Error);
          return;
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
