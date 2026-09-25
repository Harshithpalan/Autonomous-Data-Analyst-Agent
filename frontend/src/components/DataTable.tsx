import React from 'react';
import { Table } from 'lucide-react';
import { DataPreview } from '../types';

interface Props {
  data: DataPreview;
}

export default function DataTable({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <Table className="w-4 h-4 text-gray-500" />
        <h3 className="font-medium text-gray-700">Data Preview</h3>
        <span className="text-sm text-gray-400 ml-auto">{data.total_rows.toLocaleString()} total rows</span>
      </div>
      <div className="overflow-x-auto max-h-96 scrollbar-thin">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {data.columns.map((col) => (
                <th key={col} className="px-4 py-2 text-left font-medium text-gray-600 border-b">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 border-b last:border-0">
                {data.columns.map((col) => (
                  <td key={col} className="px-4 py-2 text-gray-700 whitespace-nowrap">
                    {row[col] !== null && row[col] !== undefined ? String(row[col]) : <span className="text-gray-300">null</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
