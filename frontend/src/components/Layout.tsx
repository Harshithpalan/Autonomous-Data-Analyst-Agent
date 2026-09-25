import React from 'react';
import { BarChart3, Github } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-600 rounded-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Data Analyst Agent</h1>
            <p className="text-xs text-gray-500">Autonomous AI-powered data analysis</p>
          </div>
        </div>
        <a
          href="https://github.com/Harshithpalan/Autonomous-Data-Analyst-Agent"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-600"
        >
          <Github className="w-5 h-5" />
        </a>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
