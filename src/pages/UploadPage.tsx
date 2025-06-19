import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertTriangle } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { useData } from '../context/DataContext';

const UploadPage: React.FC = () => {
  const { dataset, setDataset, setRawFile } = useData();
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setErrorMessage('Please upload a CSV file');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const text = await file.text();
      const rows = text.split('\n');
      
      if (rows.length === 0) {
        throw new Error('File appears to be empty');
      }
      
      const headers = rows[0].split(',').map(header => header.trim());
      const data = [];
      
      for (let i = 1; i < rows.length; i++) {
        if (rows[i].trim() === '') continue;
        
        const values = rows[i].split(',').map(value => value.trim());
        if (values.length !== headers.length) {
          throw new Error(`Row ${i} has ${values.length} columns instead of ${headers.length}`);
        }
        
        const row: Record<string, any> = {};
        for (let j = 0; j < headers.length; j++) {
          // Try to convert to number if possible
          const value = values[j];
          row[headers[j]] = isNaN(Number(value)) ? value : Number(value);
        }
        data.push(row);
      }

      // Calculate basic column statistics
      const columnStats: Record<string, any> = {};
      headers.forEach(column => {
        const columnValues = data.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
        const isNumeric = columnValues.every(val => typeof val === 'number');
        
        if (isNumeric) {
          const numericValues = columnValues as number[];
          columnStats[column] = {
            min: Math.min(...numericValues),
            max: Math.max(...numericValues),
            mean: numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length,
            missing: data.length - columnValues.length,
            dtype: 'numeric'
          };
        } else {
          const uniqueValues = [...new Set(columnValues)];
          columnStats[column] = {
            unique: uniqueValues.length,
            missing: data.length - columnValues.length,
            dtype: 'categorical'
          };
        }
      });

      // Count duplicates
      const serializedRows = data.map(row => JSON.stringify(row));
      const uniqueRows = new Set(serializedRows);
      const duplicates = serializedRows.length - uniqueRows.size;
      
      setDataset({
        data,
        columns: headers,
        columnStats,
        shape: [data.length, headers.length],
        duplicates
      });
      
      setRawFile(file);
      setIsUploading(false);
    } catch (error) {
      console.error('Error parsing CSV file:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error parsing the CSV file');
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Upload Your Dataset" 
        description="Upload a CSV file to start your data analysis journey"
      />
      
      <Card className="p-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
        <Upload size={48} className="text-blue-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Drag and drop your CSV file here</h3>
        <p className="text-sm text-gray-500 mb-4">or click the button below to browse files</p>
        
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          ref={fileInputRef}
          className="hidden"
        />
        
        <Button 
          variant="primary" 
          onClick={handleButtonClick}
          disabled={isUploading}
          className="px-6"
        >
          {isUploading ? 'Uploading...' : 'Browse Files'}
        </Button>
        
        {errorMessage && (
          <div className="mt-4 flex items-center text-red-500">
            <AlertTriangle size={16} className="mr-2" />
            <span>{errorMessage}</span>
          </div>
        )}
      </Card>
      
      {dataset && dataset.data.length > 0 && (
        <div className="space-y-6 mt-8">
          <Card title="Dataset Preview">
            <DataTable 
              data={dataset.data.slice(0, 10)} 
              columns={dataset.columns} 
              pageSize={5}
            />
            <div className="mt-4 text-sm text-gray-600">
              Showing first 10 rows of {dataset.data.length} rows
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card title="Dataset Information">
              <div className="space-y-2">
                <InfoItem label="Rows" value={dataset.shape[0]} />
                <InfoItem label="Columns" value={dataset.shape[1]} />
                <InfoItem label="Duplicate Rows" value={dataset.duplicates} />
              </div>
            </Card>
            
            <Card title="Column Types">
              <div className="space-y-2">
                {Object.entries(dataset.columnStats).map(([column, stats]) => (
                  <InfoItem 
                    key={column} 
                    label={column} 
                    value={stats.dtype}
                    customClass={stats.dtype === 'numeric' ? 'text-blue-600' : 'text-green-600'} 
                  />
                ))}
              </div>
            </Card>
            
            <Card title="Missing Values">
              <div className="space-y-2">
                {Object.entries(dataset.columnStats).map(([column, stats]) => (
                  <InfoItem 
                    key={column} 
                    label={column} 
                    value={stats.missing} 
                    customClass={stats.missing > 0 ? 'text-orange-500' : 'text-gray-600'}
                  />
                ))}
              </div>
            </Card>
          </div>
          
          <Card title="Dataset Statistics">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowStats(!showStats)}
              className="mb-4"
            >
              {showStats ? 'Hide Statistics' : 'Show Statistics'}
            </Button>
            
            {showStats && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mean</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Missing</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(dataset.columnStats).map(([column, stats]) => (
                      <tr key={column}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{column}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.dtype}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stats.dtype === 'numeric' ? stats.min.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stats.dtype === 'numeric' ? stats.max.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stats.dtype === 'numeric' ? stats.mean.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.missing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

interface InfoItemProps {
  label: string;
  value: any;
  customClass?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, customClass = 'text-gray-600' }) => {
  return (
    <div className="flex justify-between">
      <span className="text-sm font-medium text-gray-900">{label}:</span>
      <span className={`text-sm ${customClass}`}>{value}</span>
    </div>
  );
};

export default UploadPage;