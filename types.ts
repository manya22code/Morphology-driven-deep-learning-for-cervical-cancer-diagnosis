export enum AppState {
  UPLOADING = 'uploading',
  PREDICTING = 'predicting',
  RESULTS = 'results',
}

export enum ModelType {
  ORIGINAL = 'original',
  AUGMENTED = 'augmented',
}

export interface PredictionResult {
  original: string;
  augmented: string;
}
