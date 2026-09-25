import React, { useState } from 'react';
import Layout from './components/Layout';
import FileUpload from './components/FileUpload';
import ChatInterface from './components/ChatInterface';
import DataTable from './components/DataTable';
import SQLEditor from './components/SQLEditor';
import Visualization from './components/Visualization';
import { UploadResponse, DataPreview } from './types';
import { api } from './services/api';

export default function App() {
  const [sessionData, setSessionData] = useState<UploadResponse | null>(null);
  const [dataPreview, setDataPreview] = useState<DataPreview | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'sql'>('chat');
  const [currentPlot, setCurrentPlot] = useState<string | null>(null);

  const handleUpload = async (data: UploadResponse) => {
    setSessionData(data);
    const preview = await api.getDataPreview(data.session_id, 10);
    setDataPreview(preview);
  };

  if (!sessionData) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Autonomous Data Analyst</h2>
            <p className="text-gray-600">Upload a dataset and let AI analyze it for you</p>
          </div>
          <FileUpload onUpload={handleUpload} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex h-[calc(100vh-57px)]">
        <div className="w-1/2 flex flex-col border-r">
          <div className="flex border-b bg-white">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'chat'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'sql'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              SQL
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            {activeTab === 'chat' ? (
              <ChatInterface
                sessionId={sessionData.session_id}
                onResult={(r) => r.plotPath && setCurrentPlot(r.plotPath)}
              />
            ) : (
              <div className="p-4 overflow-y-auto h-full">
                <SQLEditor sessionId={sessionData.session_id} />
              </div>
            )}
          </div>
        </div>

        <div className="w-1/2 flex flex-col overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {currentPlot && (
            <Visualization plotPath={currentPlot} onClose={() => setCurrentPlot(null)} />
          )}
          {dataPreview && <DataTable data={dataPreview} />}
        </div>
      </div>
    </Layout>
  );
}
