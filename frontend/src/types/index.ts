export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  code?: string | null;
  plotPath?: string | null;
  error?: string | null;
  timestamp: Date;
}

export interface UploadResponse {
  filename: string;
  rows: number;
  columns: number;
  column_names: string[];
  preview: Record<string, unknown>[];
  session_id: string;
}

export interface DataPreview {
  columns: string[];
  rows: Record<string, unknown>[];
  total_rows: number;
}

export interface SQLResult {
  result: Record<string, unknown>[] | null;
  columns: string[] | null;
  row_count: number;
  explanation?: string;
  error?: string | null;
}

export interface DataInfo {
  filename: string;
  rows: number;
  columns: number;
  column_names: string[];
  dtypes: Record<string, string>;
  null_counts: Record<string, number>;
  statistics?: Record<string, Record<string, number>>;
}
