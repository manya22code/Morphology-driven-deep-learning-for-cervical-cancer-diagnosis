import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';
import Spinner from './Spinner';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading, error }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div
        onDragEnter={handleDragEvents}
        onDragOver={handleDragEvents}
        onDragLeave={handleDragEvents}
        onDrop={handleDrop}
        className={`w-full p-8 border-2 border-dashed rounded-lg transition-colors duration-300 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'}`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/png, image/jpeg, image/webp, image/bmp"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40">
            <Spinner />
            <p className="mt-4 text-slate-600">Processing image...</p>
          </div>
        ) : (
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <UploadIcon className="w-12 h-12 text-slate-500 mb-4" />
            <p className="text-lg font-semibold text-slate-700">Drag & drop your image here</p>
            <p className="text-slate-500 mt-1">or <span className="text-blue-600 font-medium">click to browse</span></p>
            <p className="text-xs text-slate-400 mt-4">PNG, JPG, WEBP, or BMP files supported</p>
          </label>
        )}
      </div>
      {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
    </div>
  );
};

export default ImageUploader;