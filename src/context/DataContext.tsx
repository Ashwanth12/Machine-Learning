import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define dataset and column types
interface ColumnStats {
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  mode?: any;
  unique?: any[];
  dtype: string;
  missing: number;
}

interface Dataset {
  data: any[];
  columns: string[];
  columnStats: Record<string, ColumnStats>;
  shape: [number, number];
  duplicates: number;
}

interface DataContextType {
  dataset: Dataset | null;
  setDataset: (data: Dataset | null) => void;
  rawFile: File | null;
  setRawFile: (file: File | null) => void;
  processedDataset: Dataset | null;
  setProcessedDataset: (data: Dataset | null) => void;
  selectedModel: any | null;
  setSelectedModel: (model: any | null) => void;
  targetColumn: string | null;
  setTargetColumn: (column: string | null) => void;
  modelType: string | null;
  setModelType: (type: string | null) => void;
  modelResults: any | null;
  setModelResults: (results: any | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [processedDataset, setProcessedDataset] = useState<Dataset | null>(null);
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  const [targetColumn, setTargetColumn] = useState<string | null>(null);
  const [modelType, setModelType] = useState<string | null>(null);
  const [modelResults, setModelResults] = useState<any | null>(null);

  return (
    <DataContext.Provider
      value={{
        dataset,
        setDataset,
        rawFile,
        setRawFile,
        processedDataset,
        setProcessedDataset,
        selectedModel,
        setSelectedModel,
        targetColumn,
        setTargetColumn,
        modelType,
        setModelType,
        modelResults,
        setModelResults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};