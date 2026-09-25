import React, { useState } from 'react';
import { Database, Play, Loader2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { SQLResult } from '../types';
import { api } from '../services/api';

interface Props {
  sessionId: string;
}

export default function SQLEditor({ sessionId }: Props) {
  const [query, setQuery] = useState('SELECT * FROM dataset LIMIT 10');
  const [result, setResult] = useState<SQLResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.executeSQL(query, sessionId);
      setResult(res);
      if (res.error) setError(res.error);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Query failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <Database className="w-4 h-4 text-gray-500" />
        <h3 className="font-medium text-gray-700">SQL Query</h3>
      </div>
      <div className="p-4">
        <div className="flex gap-2">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 font-mono text-sm border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={3}
            placeholder="Enter SQL query..."
          />
        </div>
        <button
          onClick={execute}
          disabled={loading || !query.trim()}
          className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2 text-sm"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Run Query
        </button>
      </div>

      {error && (
        <div className="px-4 pb-4">
          <div className="bg-red-50 text-red-700 rounded-lg p-3 text-sm">{error}</div>
        </div>
      )}

      {result && result.result && (
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-500 mb-2">{result.row_count} rows returned</p>
          {result.explanation && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
              {result.explanation}
            </div>
          )}
          <div className="overflow-x-auto max-h-64 scrollbar-thin border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {result.columns?.map((col) => (
                    <th key={col} className="px-3 py-2 text-left font-medium text-gray-600 border-b">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.result?.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 border-b last:border-0">
                    {result.columns?.map((col) => (
                      <td key={col} className="px-3 py-2 text-gray-700 whitespace-nowrap">
                        {row[col] !== null ? String(row[col]) : <span className="text-gray-300">null</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
