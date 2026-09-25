import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { UploadResponse } from '../types';

interface Props {
  onUpload: (data: UploadResponse) => void;
}

export default function FileUpload({ onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<UploadResponse | null>(null);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    setUploading(true);
    setError('');
    try {
      const result = await api.uploadFile(file);
      setUploaded(result);
      onUpload(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    multiple: false,
  });

  if (uploaded) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-medium text-green-800">{uploaded.filename}</p>
            <p className="text-sm text-green-600">
              {uploaded.rows.toLocaleString()} rows × {uploaded.columns} columns loaded
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {uploaded.column_names.map((col) => (
            <span key={col} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              {col}
            </span>
          ))}
        </div>
        <button
          onClick={() => { setUploaded(null); }}
          className="mt-3 text-sm text-green-700 underline hover:text-green-900"
        >
          Upload different file
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        {uploading ? (
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        ) : (
          <>
            <FileSpreadsheet className="w-10 h-10 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isDragActive ? 'Drop your file here' : 'Drag & drop a CSV or Excel file'}
              </p>
              <p className="text-sm text-gray-500 mt-1">or click to browse</p>
            </div>
            <Upload className="w-5 h-5 text-gray-400" />
          </>
        )}
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
