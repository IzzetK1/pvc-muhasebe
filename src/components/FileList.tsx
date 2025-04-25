"use client";

import { useState, useEffect } from 'react';
import { fileFunctions, FileObject } from '@/lib/database';
import { supabase } from '@/lib/supabase';

type FileListProps = {
  transactionId?: string;
  partnerExpenseId?: string;
  onDelete?: (fileId: string) => void;
};

export default function FileList({ transactionId, partnerExpenseId, onDelete }: FileListProps) {
  const [files, setFiles] = useState<(FileObject & { url: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        let data: FileObject[] = [];
        
        if (transactionId) {
          data = await fileFunctions.getByTransactionId(transactionId);
        } else if (partnerExpenseId) {
          data = await fileFunctions.getByPartnerExpenseId(partnerExpenseId);
        }
        
        // URL'leri ekle
        const filesWithUrls = data.map(file => {
          const { data } = supabase.storage
            .from('files')
            .getPublicUrl(file.path);
          
          return {
            ...file,
            url: data.publicUrl
          };
        });
        
        setFiles(filesWithUrls);
      } catch (err) {
        console.error('Dosyalar yüklenirken hata:', err);
        setError('Dosyalar yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFiles();
  }, [transactionId, partnerExpenseId]);

  const handleDelete = async (fileId: string) => {
    if (window.confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
      try {
        await fileFunctions.delete(fileId);
        setFiles(files.filter(file => file.id !== fileId));
        if (onDelete) {
          onDelete(fileId);
        }
      } catch (err) {
        console.error('Dosya silinirken hata:', err);
        setError('Dosya silinirken bir hata oluştu.');
      }
    }
  };

  // Dosya boyutunu formatla
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Dosya tipine göre ikon belirle
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      );
    } else if (fileType.includes('pdf')) {
      return (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      );
    }
  };

  if (loading) {
    return <div className="text-center py-4">Dosyalar yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  if (files.length === 0) {
    return <div className="text-center py-4 text-gray-500">Henüz dosya yüklenmemiş.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700">Yüklenen Dosyalar</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {files.map((file) => (
          <div key={file.id} className="flex items-center p-4 border rounded-lg bg-gray-50">
            <div className="flex-shrink-0 mr-4">
              {getFileIcon(file.type)}
            </div>
            <div className="flex-1 min-w-0">
              <a 
                href={file.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 truncate hover:underline"
              >
                {file.name}
              </a>
              <p className="text-xs text-gray-500">
                {formatFileSize(file.size)} • {new Date(file.uploaded_at).toLocaleDateString('tr-TR')}
              </p>
            </div>
            {onDelete && (
              <button
                onClick={() => handleDelete(file.id)}
                className="ml-2 text-red-600 hover:text-red-800"
                title="Dosyayı sil"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
