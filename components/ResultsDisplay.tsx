import React from 'react';
import { PredictionResult } from '../types';

interface ResultsDisplayProps {
  originalImage: string | null;
  augmentedImage: string | null;
  predictions: PredictionResult | null;
  onReset: () => void;
}

const ResultCard: React.FC<{ title: string; imageSrc: string | null; prediction: string; modelAccuracy: string; isAugmented?: boolean }> = ({ title, imageSrc, prediction, modelAccuracy, isAugmented = false }) => {
  const isCancerous = prediction.toLowerCase().includes('cancerous');
  const predictionColor = isCancerous ? 'text-red-600' : 'text-green-600';
  const bgColor = isAugmented ? 'bg-blue-50' : 'bg-slate-50';
  const borderColor = isAugmented ? 'border-blue-200' : 'border-slate-200';

  return (
    <div className={`flex-1 p-4 border ${borderColor} ${bgColor} rounded-lg`}>
      <h3 className="text-lg font-semibold text-center mb-4 text-slate-800">{title}</h3>
      {imageSrc && (
        <img src={imageSrc} alt={title} className="w-full h-auto object-contain rounded-md aspect-square mb-4" />
      )}
      <div className="text-center bg-white p-4 rounded-md border border-slate-200">
        <p className="text-sm text-slate-500">Model Prediction:</p>
        <p className={`text-xl font-bold ${predictionColor}`}>{prediction}</p>
        <p className="text-xs text-slate-400 mt-2">(Accuracy: ~{modelAccuracy})</p>
      </div>
    </div>
  );
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ originalImage, augmentedImage, predictions, onReset }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-slate-900">Diagnosis Results</h2>
      
      <div className="w-full flex flex-col md:flex-row gap-6 mb-8">
        <ResultCard 
          title="Original Model Analysis"
          imageSrc={originalImage}
          prediction={predictions?.original || 'N/A'}
          modelAccuracy="82.5%"
        />
        <ResultCard 
          title="Augmented Model Analysis"
          imageSrc={augmentedImage}
          prediction={predictions?.augmented || 'N/A'}
          modelAccuracy="88.9%"
          isAugmented
        />
      </div>

      <button
        onClick={onReset}
        className="px-8 py-2.5 rounded-md font-semibold text-white bg-slate-600 hover:bg-slate-700 transition-colors"
      >
        Upload Another Image
      </button>
    </div>
  );
};

export default ResultsDisplay;
