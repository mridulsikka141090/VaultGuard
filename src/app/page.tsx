'use client';

import { useAuth } from "@/hooks/useAuth"
import { useFetchFiles } from "@/hooks/useFetchFiles";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useEffect } from "react";

export default function Home() {
  const { uploadFile } = useFileUpload(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/upload-url`);
  const { user, loading } = useAuth();

  const { files, loading: fileLoading, error } = useFetchFiles(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/files`);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const token = localStorage.getItem('access_token') || '';
    if (file && token) {
      await uploadFile(file, token);
    }
  };

  console.log('User:', user);
  console.log('Files:', files);
  if (loading || fileLoading) return <div>Loading...</div>;
  return (
    <div className="min-h-screen bg-gray-200 px-4 py-10">
      {/* Upload section */}
      <div className="flex justify-center mb-10">
        <input
          type="file"
          className="block w-full max-w-md text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-600 file:text-white
                     hover:file:bg-blue-700"
        />
      </div>


      {/* Bento-style card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {files.map((file) => (
          <div key={file.s3Key} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col p-4">
          <img
            src={file.signedUrl}
            alt="File"
            className="w-full h-48 object-contain rounded-md"
          />
          <div className="text-sm text-gray-800 font-medium truncate">{file.fileName}</div>
          <div className="text-xs text-gray-500">Uploaded at: {new Date(file.uploadTime).toLocaleString()}</div>
          <a href={file.signedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Download</a>
        </div>
        ))}
      </div>
    </div>
  )
}
