import React, { useState, useCallback } from 'react';
import { getDiagnosis } from './services/geminiService';
import { AppState, PredictionResult, ModelType } from './types';
import { fileToBase64, generateAugmentedImage } from './utils/fileHelpers';
import ImageUploader from './components/ImageUploader';
import PredictionView from './components/PredictionView';
import ResultsDisplay from './components/ResultsDisplay';
import { GithubIcon } from './components/icons';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOADING);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [augmentedImage, setAugmentedImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setError(null);
      setIsLoading(true);
      setFileName(file.name);
      const base64Original = await fileToBase64(file);
      const base64Augmented = await generateAugmentedImage(base64Original);
      setOriginalImage(base64Original);
      setAugmentedImage(base64Augmented);
      setAppState(AppState.PREDICTING);
    } catch (err) {
      setError('Failed to process image. Please try another file.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePredict = useCallback(async () => {
    if (!originalImage || !augmentedImage) {
      setError('Image data is missing. Please re-upload.');
      return;
    }
    try {
      setError(null);
      setIsLoading(true);
      
      const originalMimeType = originalImage.substring(5, originalImage.indexOf(';'));
      const originalBase64Data = originalImage.split(',')[1];
      
      const augmentedMimeType = augmentedImage.substring(5, augmentedImage.indexOf(';'));
      const augmentedBase64Data = augmentedImage.split(',')[1];
      
      const [originalResult, augmentedResult] = await Promise.all([
        getDiagnosis(originalBase64Data, originalMimeType, ModelType.ORIGINAL),
        getDiagnosis(augmentedBase64Data, augmentedMimeType, ModelType.AUGMENTED),
      ]);
      
      setPredictions({ original: originalResult, augmented: augmentedResult });
      setAppState(AppState.RESULTS);
    } catch (err: any) {
      setError(err.message || 'Failed to get prediction from our model. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, augmentedImage]);

  const handleReset = useCallback(() => {
    setAppState(AppState.UPLOADING);
    setOriginalImage(null);
    setAugmentedImage(null);
    setPredictions(null);
    setError(null);
    setIsLoading(false);
    setFileName('');
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.UPLOADING:
        return <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} error={error} />;
      case AppState.PREDICTING:
        return (
          <PredictionView
            originalImage={originalImage}
            augmentedImage={augmentedImage}
            fileName={fileName}
            onPredict={handlePredict}
            onCancel={handleReset}
            isLoading={isLoading}
            error={error}
          />
        );
      case AppState.RESULTS:
        return (
          <ResultsDisplay
            originalImage={originalImage}
            augmentedImage={augmentedImage}
            predictions={predictions}
            onReset={handleReset}
          />
        );
      default:
        return <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} error={error} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col items-center justify-center p-4 selection:bg-blue-100">
      <main className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Morphology driven deep learning for cervical cancer diagnosis</h1>
          <p className="text-slate-600 mt-2 text-lg">
            by Manya 22BCB0185 and Sowmya 22BCB0189
          </p>
        </header>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-slate-200 transition-all duration-300">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center py-8 text-slate-500 mt-8">
        <p>This web app is for project 1 under Anusha N, SCOPE, VIT Vellore.</p>
        <div className="flex justify-center items-center gap-4 mt-4">
            <a href="https://github.com/react" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <GithubIcon className="w-5 h-5" />
                <span>View on GitHub</span>
            </a>
        </div>
      </footer>
    </div>
  );
}