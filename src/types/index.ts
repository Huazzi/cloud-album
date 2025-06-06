export interface Photo {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  contentType: string;
  url: string;
  thumbnailUrl: string;
  metadata?: {
    width?: number;
    height?: number;
    takenAt?: string;
    [key: string]: any;
  };
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface AuthResponse {
  token: string;
  expiresIn: number;
}