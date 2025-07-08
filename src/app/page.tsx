'use client';

import { useAuth } from "@/hooks/useAuth"
import { useFetchFiles } from "@/hooks/useFetchFiles";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import Sidebar from "@/components/Sidebar";
import ProgressBar from "@/components/ProgressBar";
import { isVideoFile } from "@/helpers";

export default function Home() {
  const { user, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const { files, loading: fileLoading, error, refetch } = useFetchFiles(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/files`);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { uploadFile } = useFileUpload(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/upload`, {
    onProgress: (progress) => {
      setUploading(true);
      setProgress(progress);
    },
    onSuccess: () => {
      setUploading(false);
      setProgress(0);
      setFile(null);
    },
    onError: (error) => {
      setUploading(false);
      console.error('Upload failed:', error);
    }
  });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
        const token = localStorage.getItem('access_token') || '';
      await uploadFile(file, token);
      if (!uploading && progress === 0) {
        await refetch();
      }
  }

  console.log(user, 'user');

  if (loading || fileLoading) return <Spinner />;
  return (
    <div className="min-h-screen bg-gray-50">
    <div className="lg:grid grid-cols-5 gap-4">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`col-span-5 p-6 transition-all duration-300 ${collapsed ? 'lg:ml-16' : 'lg:ml-48'}`}>
        <h1 className="text-2xl font-bold mb-4 wrap-anywhere">Welcome, {user?.sub || user?.sub}</h1>
        <div className="flex justify-center mb-3">
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
          <button
            onClick={handleUpload}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Upload
          </button>
      </div>
      {uploading && <ProgressBar value={progress} label="Upload Progress" />}
          {/* Bento-style card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {files.map((file) => (
          <div key={file.s3Key} className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col p-4">
            {isVideoFile(file.fileName) ? <video src={file.signedUrl} controls preload="metadata" className="w-full h-48 object-contain rounded-md" /> :  <img
            src={file.signedUrl}
            alt="File"
            className="w-full h-48 object-contain rounded-md"
          />}
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
