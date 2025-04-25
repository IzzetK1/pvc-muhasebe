"use client";

import { useState, useRef } from 'react';
import { fileFunctions } from '../lib/database';

type FileUploadProps = {
  onUploadComplete: (fileId: string, fileUrl: string) => void;
  path: string;
  maxSize?: number; // MB cinsinden
  allowedTypes?: string[]; // örn: ['image/jpeg', 'image/png', 'application/pdf']
};

export default function FileUpload({ 
  onUploadComplete, 
  path, 
  maxSize = 5, // Varsayılan 5MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'] 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Dosya tipi kontrolü
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      setError(`Desteklenmeyen dosya tipi. İzin verilen tipler: ${allowedTypes.join(', ')}`);
      return;
    }
    
    // Dosya boyutu kontrolü (MB cinsinden)
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Dosya boyutu çok büyük. Maksimum boyut: ${maxSize}MB`);
      return;
    }
    
    setError(null);
    setIsUploading(true);
    setProgress(0);
    
    try {
      // Simüle edilmiş ilerleme
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      // Dosya yükleme
      const result = await fileFunctions.upload(file, path);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Yükleme tamamlandı
      onUploadComplete(result.id, result.url);
      
      // Input'u temizle
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
      setError('Dosya yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
            isUploading ? 'bg-gray-100 border-gray-300' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <div className="w-full px-4">
                <div className="mb-2 text-sm text-center text-gray-500">Yükleniyor... {progress}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <>
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Dosya yüklemek için tıklayın</span> veya sürükleyip bırakın
                </p>
                <p className="text-xs text-gray-500">
                  {allowedTypes.join(', ')} (Maks. {maxSize}MB)
                </p>
              </>
            )}
          </div>
          <input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
            accept={allowedTypes.join(',')}
          />
        </label>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
