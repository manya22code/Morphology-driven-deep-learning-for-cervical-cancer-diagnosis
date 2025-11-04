import React from 'react';
import Spinner from './Spinner';

interface PredictionViewProps {
  originalImage: string | null;
  augmentedImage: string | null;
  fileName: string;
  onPredict: () => void;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
}

const ImageDisplayCard: React.FC<{ title: string; imageSrc: string | null; alt: string }> = ({ title, imageSrc, alt }) => (
  <div className="flex-1 p-4 border border-slate-200 rounded-lg bg-slate-50">
    <h3 className="text-lg font-semibold text-center mb-4 text-slate-700">{title}</h3>
    {imageSrc ? (
      <img src={imageSrc} alt={alt} className="w-full h-auto object-contain rounded-md aspect-square" />
    ) : (
      <div className="w-full h-full bg-slate-200 rounded-md flex items-center justify-center aspect-square">
        <p className="text-slate-500">No image</p>
      </div>
    )}
  </div>
);

const PredictionView: React.FC<PredictionViewProps> = ({ originalImage, augmentedImage, fileName, onPredict, onCancel, isLoading, error }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2 text-slate-800">Ready for Analysis</h2>
      <p className="text-slate-500 mb-6">Uploaded: <span className="font-medium text-slate-600">{fileName}</span></p>
      
      <div className="w-full flex flex-col md:flex-row gap-6 mb-8">
        <ImageDisplayCard title="Original Image" imageSrc={originalImage} alt="Original uploaded cytology image" />
        <ImageDisplayCard title="Augmented Image" imageSrc={augmentedImage} alt="Augmented version of cytology image" />
      </div>

      {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}

      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2 rounded-md font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onPredict}
          disabled={isLoading}
          className="px-8 py-2.5 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? <><Spinner /> Analyzing...</> : 'Run Diagnosis'}
        </button>
      </div>
    </div>
  );
};

export default PredictionView;
