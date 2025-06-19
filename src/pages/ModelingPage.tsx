import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  BarChartHorizontal, 
  CheckCircle2, 
  AlertTriangle, 
  Brain, 
  Zap, 
  Cog, 
  LineChart,
  Loader
} from 'lucide-react';

const ModelingPage: React.FC = () => {
  const { 
    dataset, 
    setTargetColumn, 
    targetColumn, 
    setModelType, 
    modelType, 
    setModelResults, 
    modelResults 
  } = useData();
  
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);
  const [testSize, setTestSize] = useState<number>(0.2);
  const [randomState, setRandomState] = useState<number>(42);
  const [hyperparams, setHyperparams] = useState<Record<string, any>>({});
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  
  if (!dataset || dataset.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">No Dataset Available</h2>
        <p className="text-gray-600 mb-4">Please upload a dataset first to train models.</p>
        <Button variant="primary" onClick={() => window.location.href = '#upload'}>
          Go to Upload
        </Button>
      </div>
    );
  }

  const handleTargetColumnChange = (column: string) => {
    setTargetColumn(column);
    setModelResults(null);
    setSelectedAlgorithms([]);
  };

  const handleModelTypeChange = (type: string) => {
    setModelType(type);
    setModelResults(null);
    setSelectedAlgorithms([]);
  };

  const handleAlgorithmToggle = (algorithm: string) => {
    if (selectedAlgorithms.includes(algorithm)) {
      setSelectedAlgorithms(selectedAlgorithms.filter(algo => algo !== algorithm));
    } else {
      setSelectedAlgorithms([...selectedAlgorithms, algorithm]);
    }
  };

  const handleHyperparamChange = (algorithm: string, param: string, value: any) => {
    setHyperparams({
      ...hyperparams,
      [algorithm]: {
        ...(hyperparams[algorithm] || {}),
        [param]: value
      }
    });
  };

  const handleTrainModels = () => {
    if (!targetColumn || selectedAlgorithms.length === 0) return;
    
    setIsTraining(true);
    
    // Simulate model training with a timeout
    setTimeout(() => {
      // Generate mock results based on selected algorithms and model type
      const results = selectedAlgorithms.map(algorithm => {
        if (modelType === 'regression') {
          return {
            algorithm,
            metrics: {
              mae: Math.random() * 5,
              rmse: Math.random() * 10,
              r2: Math.random() * 0.5 + 0.5
            },
            isBest: false
          };
        } else if (modelType === 'classification') {
          return {
            algorithm,
            metrics: {
              accuracy: Math.random() * 0.3 + 0.7,
              precision: Math.random() * 0.3 + 0.7,
              recall: Math.random() * 0.3 + 0.7,
              f1: Math.random() * 0.3 + 0.7
            },
            isBest: false
          };
        } else if (modelType === 'clustering') {
          return {
            algorithm,
            metrics: {
              silhouette: Math.random() * 0.8 + 0.1,
              inertia: Math.random() * 1000
            },
            isBest: false
          };
        } else { // dimensionality reduction
          return {
            algorithm,
            metrics: {
              explainedVariance: Math.random() * 0.5 + 0.5
            },
            isBest: false
          };
        }
      });
      
      // Determine the best model
      if (modelType === 'regression') {
        // For regression, higher R2 is better
        const bestIndex = results.reduce((bestIdx, result, idx, arr) => 
          result.metrics.r2 > arr[bestIdx].metrics.r2 ? idx : bestIdx, 0);
        results[bestIndex].isBest = true;
      } else if (modelType === 'classification') {
        // For classification, higher F1 is better
        const bestIndex = results.reduce((bestIdx, result, idx, arr) => 
          result.metrics.f1 > arr[bestIdx].metrics.f1 ? idx : bestIdx, 0);
        results[bestIndex].isBest = true;
      } else if (modelType === 'clustering') {
        // For clustering, higher silhouette is better
        const bestIndex = results.reduce((bestIdx, result, idx, arr) => 
          result.metrics.silhouette > arr[bestIdx].metrics.silhouette ? idx : bestIdx, 0);
        results[bestIndex].isBest = true;
      } else { // dimensionality reduction
        // For dimensionality reduction, higher explained variance is better
        const bestIndex = results.reduce((bestIdx, result, idx, arr) => 
          result.metrics.explainedVariance > arr[bestIdx].metrics.explainedVariance ? idx : bestIdx, 0);
        results[bestIndex].isBest = true;
      }
      
      setModelResults(results);
      setIsTraining(false);
      setStep(3);
    }, 2000);
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Get available algorithms based on model type
  const getAlgorithms = () => {
    switch (modelType) {
      case 'regression':
        return [
          'Linear Regression',
          'Decision Tree Regressor',
          'Random Forest Regressor',
          'Support Vector Regressor',
          'K-Nearest Neighbors Regressor',
          'Ridge Regressor',
          'Lasso Regressor',
        ];
      case 'classification':
        return [
          'Logistic Regression',
          'Decision Tree Classifier',
          'Random Forest Classifier',
          'Support Vector Classifier',
          'K-Nearest Neighbors Classifier',
          'Naive Bayes',
          'Gradient Boosting Classifier',
        ];
      case 'clustering':
        return [
          'K-Means',
          'DBSCAN',
          'Hierarchical Clustering',
          'Gaussian Mixture',
          'BIRCH',
        ];
      case 'dimensionality_reduction':
        return [
          'PCA',
          'LDA',
          'T-SNE',
          'UMAP',
          'Truncated SVD',
        ];
      default:
        return [];
    }
  };

  const renderHyperparameters = (algorithm: string) => {
    // These are simplified hyperparameters for demonstration
    // In a real application, these would be more comprehensive
    switch (algorithm) {
      case 'Linear Regression':
        return (
          <div className="space-y-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Fit Intercept
              </label>
              <select 
                className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={(hyperparams[algorithm]?.fitIntercept || 'true')}
                onChange={(e) => handleHyperparamChange(algorithm, 'fitIntercept', e.target.value)}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>
        );
      case 'Decision Tree Regressor':
      case 'Decision Tree Classifier':
        return (
          <div className="space-y-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Max Depth
              </label>
              <input 
                type="number" 
                className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={hyperparams[algorithm]?.maxDepth || 5}
                onChange={(e) => handleHyperparamChange(algorithm, 'maxDepth', parseInt(e.target.value))}
                min="1"
                max="20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Min Samples Split
              </label>
              <input 
                type="number" 
                className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={hyperparams[algorithm]?.minSamplesSplit || 2}
                onChange={(e) => handleHyperparamChange(algorithm, 'minSamplesSplit', parseInt(e.target.value))}
                min="2"
                max="10"
              />
            </div>
          </div>
        );
      case 'Random Forest Regressor':
      case 'Random Forest Classifier':
        return (
          <div className="space-y-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                n_estimators
              </label>
              <input 
                type="number" 
                className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={hyperparams[algorithm]?.nEstimators || 100}
                onChange={(e) => handleHyperparamChange(algorithm, 'nEstimators', parseInt(e.target.value))}
                min="10"
                max="1000"
                step="10"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Max Depth
              </label>
              <input 
                type="number" 
                className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={hyperparams[algorithm]?.maxDepth || 5}
                onChange={(e) => handleHyperparamChange(algorithm, 'maxDepth', parseInt(e.target.value))}
                min="1"
                max="20"
              />
            </div>
          </div>
        );
      case 'K-Means':
        return (
          <div className="space-y-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                n_clusters
              </label>
              <input 
                type="number" 
                className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={hyperparams[algorithm]?.nClusters || 3}
                onChange={(e) => handleHyperparamChange(algorithm, 'nClusters', parseInt(e.target.value))}
                min="2"
                max="10"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Max Iterations
              </label>
              <input 
                type="number" 
                className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={hyperparams[algorithm]?.maxIter || 300}
                onChange={(e) => handleHyperparamChange(algorithm, 'maxIter', parseInt(e.target.value))}
                min="100"
                max="1000"
                step="100"
              />
            </div>
          </div>
        );
      case 'PCA':
        return (
          <div className="space-y-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                n_components
              </label>
              <input 
                type="number" 
                className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={hyperparams[algorithm]?.nComponents || 2}
                onChange={(e) => handleHyperparamChange(algorithm, 'nComponents', parseInt(e.target.value))}
                min="1"
                max="10"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Model Training" 
        description="Train and evaluate machine learning models on your data"
      />
      
      <Card>
        <div className="border-b pb-4 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Model Setup</h3>
            <div className="flex space-x-2">
              <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`flex items-center justify-center h-6 w-6 rounded-full ${step >= 1 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <span className="text-sm font-medium">1</span>
                </div>
                <span className="ml-2 text-sm">Setup</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-200"></div>
              <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`flex items-center justify-center h-6 w-6 rounded-full ${step >= 2 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <span className="text-sm font-medium">2</span>
                </div>
                <span className="ml-2 text-sm">Algorithms</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-200"></div>
              <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`flex items-center justify-center h-6 w-6 rounded-full ${step >= 3 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <span className="text-sm font-medium">3</span>
                </div>
                <span className="ml-2 text-sm">Results</span>
              </div>
            </div>
          </div>
        </div>
        
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-3">
                1. Select the Target Column
              </h4>
              <select 
                value={targetColumn || ''}
                onChange={(e) => handleTargetColumnChange(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select a column</option>
                {dataset.columns.map((column) => (
                  <option key={column} value={column}>
                    {column} ({dataset.columnStats[column].dtype})
                  </option>
                ))}
              </select>
              {targetColumn && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected target: <span className="font-medium">{targetColumn}</span> ({dataset.columnStats[targetColumn].dtype})
                </div>
              )}
            </div>
            
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-3">
                2. Select the Problem Type
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ModelTypeCard 
                  title="Regression" 
                  description="Predict continuous values"
                  icon={<LineChart size={20} />}
                  isSelected={modelType === 'regression'}
                  onClick={() => handleModelTypeChange('regression')}
                  isDisabled={targetColumn ? dataset.columnStats[targetColumn].dtype !== 'numeric' : false}
                />
                <ModelTypeCard 
                  title="Classification" 
                  description="Predict categories or classes"
                  icon={<CheckCircle2 size={20} />}
                  isSelected={modelType === 'classification'}
                  onClick={() => handleModelTypeChange('classification')}
                />
                <ModelTypeCard 
                  title="Clustering" 
                  description="Group similar data points"
                  icon={<Brain size={20} />}
                  isSelected={modelType === 'clustering'}
                  onClick={() => handleModelTypeChange('clustering')}
                />
                <ModelTypeCard 
                  title="Dimensionality Reduction" 
                  description="Reduce features while preserving information"
                  icon={<Zap size={20} />}
                  isSelected={modelType === 'dimensionality_reduction'}
                  onClick={() => handleModelTypeChange('dimensionality_reduction')}
                />
              </div>
            </div>
            
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-3">
                3. Training Settings
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Size (0.1 - 0.5)
                  </label>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="0.5" 
                    step="0.05"
                    value={testSize}
                    onChange={(e) => setTestSize(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Small (10%)</span>
                    <span>Medium (30%)</span>
                    <span>Large (50%)</span>
                  </div>
                  <div className="mt-1 text-center text-sm font-medium">
                    {Math.round(testSize * 100)}% test data
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Random State (for reproducibility)
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    value={randomState}
                    onChange={(e) => setRandomState(parseInt(e.target.value))}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="primary" 
                disabled={!targetColumn || !modelType}
                onClick={handleNextStep}
              >
                Next: Select Algorithms
              </Button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-base font-medium text-gray-800">
                  Select Algorithms and Configure Hyperparameters
                </h4>
                <span className="text-sm text-gray-500">
                  Selected: {selectedAlgorithms.length} / {getAlgorithms().length}
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {getAlgorithms().map((algorithm) => (
                  <div 
                    key={algorithm}
                    className={`border rounded-lg overflow-hidden transition-colors ${
                      selectedAlgorithms.includes(algorithm) 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div 
                      className="flex items-center px-4 py-3 cursor-pointer"
                      onClick={() => handleAlgorithmToggle(algorithm)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAlgorithms.includes(algorithm)}
                        onChange={() => handleAlgorithmToggle(algorithm)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 font-medium">{algorithm}</span>
                      <span className="ml-auto text-gray-500">
                        <Cog size={16} />
                      </span>
                    </div>
                    
                    {selectedAlgorithms.includes(algorithm) && renderHyperparameters(algorithm)}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
              >
                Back
              </Button>
              <Button 
                variant="primary" 
                disabled={selectedAlgorithms.length === 0}
                onClick={handleTrainModels}
              >
                {isTraining ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    Training Models...
                  </>
                ) : (
                  'Train Models'
                )}
              </Button>
            </div>
          </div>
        )}
        
        {step === 3 && modelResults && (
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-3">
                Model Training Results
              </h4>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Algorithm
                      </th>
                      {modelType === 'regression' && (
                        <>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            MAE
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            RMSE
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            R² Score
                          </th>
                        </>
                      )}
                      {modelType === 'classification' && (
                        <>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Accuracy
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precision
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Recall
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            F1 Score
                          </th>
                        </>
                      )}
                      {modelType === 'clustering' && (
                        <>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Silhouette Score
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Inertia
                          </th>
                        </>
                      )}
                      {modelType === 'dimensionality_reduction' && (
                        <>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Explained Variance
                          </th>
                        </>
                      )}
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {modelResults.map((result, index) => (
                      <tr key={index} className={result.isBest ? 'bg-green-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.algorithm}
                        </td>
                        {modelType === 'regression' && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.metrics.mae.toFixed(4)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.metrics.rmse.toFixed(4)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(result.metrics.r2 * 100).toFixed(2)}%
                            </td>
                          </>
                        )}
                        {modelType === 'classification' && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(result.metrics.accuracy * 100).toFixed(2)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(result.metrics.precision * 100).toFixed(2)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(result.metrics.recall * 100).toFixed(2)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(result.metrics.f1 * 100).toFixed(2)}%
                            </td>
                          </>
                        )}
                        {modelType === 'clustering' && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.metrics.silhouette.toFixed(4)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {Math.round(result.metrics.inertia)}
                            </td>
                          </>
                        )}
                        {modelType === 'dimensionality_reduction' && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(result.metrics.explainedVariance * 100).toFixed(2)}%
                            </td>
                          </>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {result.isBest ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Best Model
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Trained
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Brain className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Model Training Complete
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Your models have been trained successfully. You can now download the best model 
                        or any of the trained models from the Download page.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
              >
                Back
              </Button>
              <Button 
                variant="primary" 
                onClick={() => window.location.href = '#download'}
              >
                Go to Download
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

interface ModelTypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  isDisabled?: boolean;
}

const ModelTypeCard: React.FC<ModelTypeCardProps> = ({
  title,
  description,
  icon,
  isSelected,
  onClick,
  isDisabled = false
}) => {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
        isDisabled
          ? 'opacity-50 cursor-not-allowed'
          : isSelected
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={isDisabled ? undefined : onClick}
    >
      <div className="flex items-start">
        <div className={`p-2 rounded-md ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
          {icon}
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ModelingPage;