import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import DataTable from '../components/DataTable';
import { Check, X, AlertTriangle, Trash2, FileText, RefreshCw } from 'lucide-react';

const CleaningPage: React.FC = () => {
  const { dataset, setDataset, setProcessedDataset } = useData();
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [fillingMethod, setFillingMethod] = useState<Record<string, string>>({});
  const [fillingValue, setFillingValue] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [processedData, setProcessedData] = useState<any[] | null>(null);

  if (!dataset || dataset.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">No Dataset Available</h2>
        <p className="text-gray-600 mb-4">Please upload a dataset first to start cleaning your data.</p>
        <Button variant="primary" onClick={() => window.location.href = '#upload'}>
          Go to Upload
        </Button>
      </div>
    );
  }

  const handleColumnSelection = (column: string) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const handleFillingMethodChange = (column: string, method: string) => {
    setFillingMethod({ ...fillingMethod, [column]: method });
  };

  const handleFillingValueChange = (column: string, value: string) => {
    setFillingValue({ ...fillingValue, [column]: value });
  };

  const handleRemoveDuplicates = () => {
    if (!dataset) return;
    
    // Convert data to string for comparison
    const stringifiedData = dataset.data.map(row => JSON.stringify(row));
    const uniqueIndices = new Set<number>();
    
    stringifiedData.forEach((row, index) => {
      if (!uniqueIndices.has(index)) {
        const firstIndex = stringifiedData.indexOf(row);
        if (firstIndex === index) {
          uniqueIndices.add(index);
        }
      }
    });
    
    const uniqueData = Array.from(uniqueIndices).map(index => dataset.data[index]);
    
    setProcessedData(uniqueData);
    setShowPreview(true);
  };

  const handleRemoveColumns = () => {
    if (!dataset || selectedColumns.length === 0) return;
    
    const remainingColumns = dataset.columns.filter(col => !selectedColumns.includes(col));
    const cleanedData = dataset.data.map(row => {
      const newRow: Record<string, any> = {};
      remainingColumns.forEach(col => {
        newRow[col] = row[col];
      });
      return newRow;
    });
    
    setProcessedData(cleanedData);
    setShowPreview(true);
  };

  const handleFillMissingValues = () => {
    if (!dataset) return;
    
    const processedRows = [...dataset.data];
    
    // For each column with a filling method
    Object.entries(fillingMethod).forEach(([column, method]) => {
      const columnStats = dataset.columnStats[column];
      const isNumeric = columnStats.dtype === 'numeric';
      
      // Calculate fill value based on method
      let fillValue: any = null;
      
      if (method === 'constant') {
        fillValue = fillingValue[column] || '';
        // Convert to number if numeric column
        if (isNumeric && fillValue !== '') {
          fillValue = Number(fillValue);
        }
      } else if (method === 'mean' && isNumeric) {
        fillValue = columnStats.mean;
      } else if (method === 'median' && isNumeric) {
        // Calculate median (simplified)
        const values = processedRows
          .map(row => row[column])
          .filter(val => val !== null && val !== undefined && val !== '');
        values.sort((a, b) => a - b);
        const mid = Math.floor(values.length / 2);
        fillValue = values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid];
      } else if (method === 'mode') {
        // Calculate mode (most frequent value)
        const valueCounts: Record<string, number> = {};
        processedRows.forEach(row => {
          const val = String(row[column]);
          if (val !== 'null' && val !== 'undefined' && val !== '') {
            valueCounts[val] = (valueCounts[val] || 0) + 1;
          }
        });
        
        let maxCount = 0;
        let modeValue = '';
        
        Object.entries(valueCounts).forEach(([val, count]) => {
          if (count > maxCount) {
            maxCount = count;
            modeValue = val;
          }
        });
        
        fillValue = isNumeric ? Number(modeValue) : modeValue;
      }
      
      // Apply fill value to missing data
      if (fillValue !== null) {
        processedRows.forEach(row => {
          if (row[column] === null || row[column] === undefined || row[column] === '') {
            row[column] = fillValue;
          }
        });
      }
    });
    
    setProcessedData(processedRows);
    setShowPreview(true);
  };

  const handleApplyChanges = () => {
    if (!processedData) return;
    
    // Update dataset with processed data
    const updatedDataset = {
      ...dataset,
      data: processedData,
      shape: [processedData.length, dataset.columns.length]
    };
    
    setDataset(updatedDataset);
    setProcessedDataset(updatedDataset);
    setProcessedData(null);
    setShowPreview(false);
    setSelectedColumns([]);
    setFillingMethod({});
    setFillingValue({});
  };

  const handleCancelChanges = () => {
    setProcessedData(null);
    setShowPreview(false);
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Data Cleaning" 
        description="Clean and prepare your dataset for analysis"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Remove Columns" className="lg:col-span-1">
          <p className="text-sm text-gray-600 mb-4">
            Select columns you want to remove from the dataset.
          </p>
          
          <div className="max-h-80 overflow-y-auto border rounded-md">
            {dataset.columns.map(column => (
              <div 
                key={column} 
                className="flex items-center p-3 border-b last:border-b-0 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  id={`col-${column}`}
                  checked={selectedColumns.includes(column)}
                  onChange={() => handleColumnSelection(column)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                />
                <label htmlFor={`col-${column}`} className="ml-3 text-sm text-gray-700 flex-grow">
                  {column}
                </label>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {dataset.columnStats[column].dtype}
                </span>
              </div>
            ))}
          </div>
          
          <Button 
            variant="danger" 
            fullWidth 
            className="mt-4"
            icon={<Trash2 size={16} />}
            onClick={handleRemoveColumns}
            disabled={selectedColumns.length === 0}
          >
            Remove Selected Columns
          </Button>
        </Card>
        
        <Card title="Handle Duplicates" className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">
              Duplicate rows detected:
            </span>
            <span className="text-sm font-medium">
              {dataset.duplicates}
            </span>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mb-4">
            <div className="flex">
              <AlertTriangle size={20} className="text-yellow-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                Duplicate rows can affect the quality of your analysis and models. Consider removing them.
              </p>
            </div>
          </div>
          
          <Button 
            variant="warning" 
            fullWidth 
            onClick={handleRemoveDuplicates}
            disabled={dataset.duplicates === 0}
            icon={<RefreshCw size={16} />}
          >
            Remove Duplicates
          </Button>
        </Card>
        
        <Card title="Fill Missing Values" className="lg:col-span-1">
          <p className="text-sm text-gray-600 mb-4">
            Choose columns with missing values and select a filling method.
          </p>
          
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {dataset.columns
              .filter(column => dataset.columnStats[column].missing > 0)
              .map(column => (
                <div key={column} className="border rounded-md p-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{column}</span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                      {dataset.columnStats[column].missing} missing
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <select
                      value={fillingMethod[column] || ''}
                      onChange={(e) => handleFillingMethodChange(column, e.target.value)}
                      className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Method</option>
                      <option value="constant">Constant Value</option>
                      {dataset.columnStats[column].dtype === 'numeric' && (
                        <>
                          <option value="mean">Mean</option>
                          <option value="median">Median</option>
                        </>
                      )}
                      <option value="mode">Mode (Most Frequent)</option>
                    </select>
                    
                    {fillingMethod[column] === 'constant' && (
                      <input
                        type={dataset.columnStats[column].dtype === 'numeric' ? 'number' : 'text'}
                        value={fillingValue[column] || ''}
                        onChange={(e) => handleFillingValueChange(column, e.target.value)}
                        placeholder="Enter value"
                        className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
          
          {dataset.columns.filter(column => dataset.columnStats[column].missing > 0).length === 0 && (
            <div className="bg-green-50 border border-green-100 rounded-md p-4 mb-4">
              <div className="flex">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-green-700">
                  No missing values detected in the dataset.
                </p>
              </div>
            </div>
          )}
          
          <Button 
            variant="info" 
            fullWidth 
            className="mt-4"
            onClick={handleFillMissingValues}
            disabled={Object.keys(fillingMethod).length === 0}
            icon={<FileText size={16} />}
          >
            Fill Missing Values
          </Button>
        </Card>
      </div>
      
      {showPreview && processedData && (
        <Card title="Preview Changes">
          <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
            <p className="text-sm text-blue-700">
              Below is a preview of your changes. Review the data and click "Apply Changes" to save or "Cancel" to discard.
            </p>
          </div>
          
          <DataTable 
            data={processedData.slice(0, 5)} 
            columns={dataset.columns.filter(col => !selectedColumns.includes(col))} 
            pageSize={5}
          />
          
          <div className="mt-4 text-sm text-gray-600">
            Showing 5 of {processedData.length} rows
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <Button 
              variant="outline" 
              onClick={handleCancelChanges}
              icon={<X size={16} />}
            >
              Cancel
            </Button>
            <Button 
              variant="success" 
              onClick={handleApplyChanges}
              icon={<Check size={16} />}
            >
              Apply Changes
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CleaningPage;