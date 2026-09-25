import { UploadResponse, DataPreview, SQLResult, DataInfo } from '../types';

const API_BASE = '/api';

export const api = {
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async chat(message: string, sessionId: string) {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id: sessionId }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async clearSession(sessionId: string) {
    await fetch(`${API_BASE}/chat/${sessionId}`, { method: 'DELETE' });
  },

  async getDataPreview(sessionId: string, rows = 10): Promise<DataPreview> {
    const res = await fetch(`${API_BASE}/data/preview/${sessionId}?rows=${rows}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getDataInfo(sessionId: string): Promise<DataInfo> {
    const res = await fetch(`${API_BASE}/data/info/${sessionId}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async executeSQL(query: string, sessionId: string): Promise<SQLResult> {
    const res = await fetch(`${API_BASE}/data/sql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, session_id: sessionId }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
