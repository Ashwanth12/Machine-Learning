import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import { Download, File, AlertTriangle, FileJson, File as FileCsv, BookOpen } from 'lucide-react';

const DownloadPage: React.FC = () => {
  const { dataset, modelResults, modelType, targetColumn } = useData();
  const [selectedFormat, setSelectedFormat] = useState<string>('csv');
  const [selectedModel, setSelectedModel] = useState<string>('');
  
  if (!dataset || dataset.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">No Dataset Available</h2>
        <p className="text-gray-600 mb-4">Please upload a dataset first to download processed data.</p>
        <Button variant="primary" onClick={() => window.location.href = '#upload'}>
          Go to Upload
        </Button>
      </div>
    );
  }

  const handleDownloadDataset = () => {
    if (!dataset) return;
    
    let content: string;
    
    if (selectedFormat === 'csv') {
      // Create CSV
      const headers = dataset.columns.join(',');
      const rows = dataset.data.map(row => 
        dataset.columns.map(col => row[col]).join(',')
      );
      content = [headers, ...rows].join('\n');
    } else if (selectedFormat === 'json') {
      // Create JSON
      content = JSON.stringify(dataset.data, null, 2);
    } else {
      // Create TSV
      const headers = dataset.columns.join('\t');
      const rows = dataset.data.map(row => 
        dataset.columns.map(col => row[col]).join('\t')
      );
      content = [headers, ...rows].join('\n');
    }
    
    // Create a blob and trigger download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dataset.${selectedFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadModel = () => {
    if (!selectedModel) return;
    
    // In a real application, this would download the actual model
    // For demonstration, we'll simulate a download with metadata
    
    // Create a mock model metadata file
    const modelMetadata = {
      name: selectedModel,
      type: modelType,
      targetColumn,
      createdAt: new Date().toISOString(),
      hyperparameters: {
        // Mock hyperparameters
        param1: 'value1',
        param2: 'value2'
      },
      performance: modelResults?.find(model => model.algorithm === selectedModel)?.metrics
    };
    
    const content = JSON.stringify(modelMetadata, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedModel.toLowerCase().replace(/\s+/g, '_')}_model.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Download" 
        description="Download your processed dataset and trained models"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Download Dataset">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Download your processed dataset in your preferred format.
              </p>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Select Format
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <FormatButton 
                    format="csv" 
                    label="CSV" 
                    icon={<FileCsv size={16} />}
                    isSelected={selectedFormat === 'csv'}
                    onClick={() => setSelectedFormat('csv')}
                  />
                  <FormatButton 
                    format="json" 
                    label="JSON" 
                    icon={<FileJson size={16} />}
                    isSelected={selectedFormat === 'json'}
                    onClick={() => setSelectedFormat('json')}
                  />
                  <FormatButton 
                    format="tsv" 
                    label="TSV" 
                    icon={<File size={16} />}
                    isSelected={selectedFormat === 'tsv'}
                    onClick={() => setSelectedFormat('tsv')}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <BookOpen size={20} className="text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Dataset Information
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 space-y-1">
                    <p>Rows: {dataset.shape[0]}</p>
                    <p>Columns: {dataset.shape[1]}</p>
                    <p>Size: ~{Math.round(JSON.stringify(dataset.data).length / 1024)} KB</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              icon={<Download size={16} />}
              onClick={handleDownloadDataset}
              fullWidth
            >
              Download Dataset
            </Button>
          </div>
        </Card>
        
        <Card title="Download Models">
          <div className="space-y-6">
            {!modelResults || modelResults.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle size={20} className="text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      No Models Available
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        You haven't trained any models yet. Go to the Modeling page to train models.
                      </p>
                    </div>
                    <div className="mt-4">
                      <Button 
                        variant="warning" 
                        size="sm"
                        onClick={() => window.location.href = '#modeling'}
                      >
                        Go to Modeling
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Download your trained machine learning models.
                  </p>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Model
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select a model</option>
                      {modelResults.map((model, index) => (
                        <option key={index} value={model.algorithm}>
                          {model.algorithm} {model.isBest ? '(Best)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {selectedModel && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <File size={20} className="text-green-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Model Details: {selectedModel}
                        </h3>
                        <div className="mt-2 text-sm text-green-700 space-y-1">
                          <p>Type: {modelType}</p>
                          <p>Target: {targetColumn}</p>
                          {modelResults.find(model => model.algorithm === selectedModel)?.isBest && (
                            <p className="font-medium">This is the best performing model!</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <Button 
                  variant="success" 
                  icon={<Download size={16} />}
                  onClick={handleDownloadModel}
                  disabled={!selectedModel}
                  fullWidth
                >
                  Download Selected Model
                </Button>
              </>
            )}
            
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                How to Use Downloaded Models
              </h4>
              <p className="text-xs text-gray-600">
                The downloaded model can be loaded in your Python environment using:
              </p>
              <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                <code>
                  import pickle{"\n"}
                  with open('model_file.pkl', 'rb') as f:{"\n"}
                  {"    "}model = pickle.load(f){"\n"}
                  {"    "}# Make predictions{"\n"}
                  {"    "}predictions = model.predict(X_test)
                </code>
              </pre>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

interface FormatButtonProps {
  format: string;
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

const FormatButton: React.FC<FormatButtonProps> = ({
  format,
  label,
  icon,
  isSelected,
  onClick
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center px-4 py-3 border ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 text-blue-700' 
          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
      } rounded-md focus:outline-none transition-colors duration-200`}
    >
      <span className={`mr-2 ${isSelected ? 'text-blue-500' : 'text-gray-500'}`}>{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default DownloadPage;