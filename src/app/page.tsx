'use client';

import { useAuth } from "@/hooks/useAuth"
import { useFetchFiles } from "@/hooks/useFetchFiles";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useEffect } from "react";
import Spinner from "@/components/Spinner";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const { uploadFile } = useFileUpload(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/upload`);
  const { user, loading } = useAuth();

  const { files, loading: fileLoading, error } = useFetchFiles(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/files`);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const token = localStorage.getItem('access_token') || '';
    if (file && token) {
      await uploadFile(file, token);
    }
  };

  if (loading || fileLoading) return <Spinner />;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-5 gap-4">
        <div className="sm:col-span-1 bg-gray-800 shadow-md p-4 pt-8 min-w-12">
          <Sidebar />
        </div>
        <div className="sm:col-span-4 p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome, {user?.email || user?.sub}</h1>
           <div className="flex justify-center mb-10">
        <input
          type="file"
          className="block w-full max-w-md text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-600 file:text-white
                     hover:file:bg-blue-700"
          onChange={handleChange}
          accept="image/*,video/*"
        />
      </div>
          {/* Bento-style card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {files.map((file) => (
          <div key={file.s3Key} className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col p-4">
          <img
            src={file.signedUrl}
            alt="File"
            className="w-full h-48 object-contain rounded-md"
          />
          <div className="text-sm text-gray-900 font-medium truncate">{file.fileName}</div>
          <div className="text-xs text-gray-500">Uploaded at: {new Date(file.uploadTime).toLocaleString()}</div>
          <a href={file.signedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Download</a>
        </div>
        ))}
      </div>

        </div>
      </div>
    </div>
  )
}
