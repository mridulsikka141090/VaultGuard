'use client';

import { useState, useEffect } from 'react';

export interface FileItem {
  fileName: string;
  s3Key: string;
  uploadTime: number;
  signedUrl: string;
}

interface UseFetchFilesOptions {
  token?: string;
  onSuccess?: (files: FileItem[]) => void;
  onError?: (error: Error) => void;
}

/**
 * useFetchFiles
 *
 * React hook to fetch user-specific uploaded files (with signed URLs)
 * from the AWS api gateway using an access token stored in localStorage.
 *
 * @param apiUrl - The api gateway endpoint to fetch file metadata
 * @param options - Optional success/error callbacks and manual token override
 * @returns { files, loading, error }
 */
export function useFetchFiles(apiUrl: string, options?: UseFetchFilesOptions) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiUrl) return;

    const controller = new AbortController();

    const fetchFiles = async () => {
      try {
        setLoading(true);
        const token =
          options?.token || localStorage.getItem('access_token');

        if (!token) {
          throw new Error('Access token not found');
        }

        const res = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch files: ${res.status}`);
        }

        const data: FileItem[] = await res.json();
        setFiles(data);
        setError(null);
        options?.onSuccess?.(data);
      } catch (err: any) {
        if (err.name === 'AbortError') return; // skip cancelled requests
        setError(err.message || 'Failed to load files');
        setFiles([]);
        options?.onError?.(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();

    return () => {
      controller.abort(); // cleanup on unmount or dependency change
    };
  }, [apiUrl, options?.token]);

  return { files, loading, error };
}
