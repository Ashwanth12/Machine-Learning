import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  BarChart2, 
  LineChart, 
  PieChart,
  ScatterChart,
  AlertTriangle, 
  Download,
  Maximize2,
  Copy
} from 'lucide-react';

// Note: In a real implementation, we would use a charting library like Chart.js, D3, or Recharts
// For this implementation, we'll create mock charts with placeholders

const VisualizationPage: React.FC = () => {
  const { dataset } = useData();
  const [chartType, setChartType] = useState<string>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [colorBy, setColorBy] = useState<string>('');
  const [aggFunction, setAggFunction] = useState<string>('sum');
  const [activeTab, setActiveTab] = useState<string>('charts');
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (dataset && dataset.columns.length > 0) {
      // Set default axes based on available columns
      const numericColumns = dataset.columns.filter(
        col => dataset.columnStats[col].dtype === 'numeric'
      );
      const categoricalColumns = dataset.columns.filter(
        col => dataset.columnStats[col].dtype === 'categorical'
      );
      
      if (numericColumns.length > 0) {
        setYAxis(numericColumns[0]);
      }
      
      if (categoricalColumns.length > 0) {
        setXAxis(categoricalColumns[0]);
        setColorBy(categoricalColumns[0]);
      } else if (numericColumns.length > 1) {
        setXAxis(numericColumns[1]);
        setColorBy(numericColumns[1]);
      }
    }
  }, [dataset]);

  if (!dataset || dataset.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">No Dataset Available</h2>
        <p className="text-gray-600 mb-4">Please upload a dataset first to create visualizations.</p>
        <Button variant="primary" onClick={() => window.location.href = '#upload'}>
          Go to Upload
        </Button>
      </div>
    );
  }

  const handleDownloadChart = () => {
    // In a real implementation, this would download the chart as an image
    alert('In a real implementation, this would download the chart as an image');
  };

  const handleCopyChartCode = () => {
    // In a real implementation, this would copy the code to generate this chart
    alert('In a real implementation, this would copy the code to generate this chart');
  };

  const renderChart = () => {
    // This is a placeholder for actual chart rendering
    // In a real implementation, we would use a charting library
    
    const chartHeight = 300;
    const chartWidth = '100%';
    
    const getChartBackground = () => {
      switch (chartType) {
        case 'bar':
          return 'linear-gradient(180deg, #3B82F6 0%, #60A5FA 100%)';
        case 'line':
          return 'linear-gradient(180deg, #10B981 0%, #34D399 100%)';
        case 'pie':
          return 'conic-gradient(from 180deg at 50% 50%, #3B82F6 0deg, #60A5FA 90deg, #93C5FD 180deg, #BFDBFE 270deg)';
        case 'scatter':
          return 'radial-gradient(circle, #8B5CF6 0%, #A78BFA 100%)';
        default:
          return 'linear-gradient(180deg, #3B82F6 0%, #60A5FA 100%)';
      }
    };
    
    const getChartIcon = () => {
      switch (chartType) {
        case 'bar':
          return <BarChart2 size={48} className="text-white opacity-20" />;
        case 'line':
          return <LineChart size={48} className="text-white opacity-20" />;
        case 'pie':
          return <PieChart size={48} className="text-white opacity-20" />;
        case 'scatter':
          return <ScatterChart size={48} className="text-white opacity-20" />;
        default:
          return <BarChart2 size={48} className="text-white opacity-20" />;
      }
    };
    
    return (
      <div 
        ref={chartRef}
        className="relative overflow-hidden rounded-lg flex items-center justify-center"
        style={{ 
          height: chartHeight, 
          width: chartWidth,
          background: getChartBackground()
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {getChartIcon()}
        </div>
        <div className="text-white text-center z-10">
          <p className="text-lg font-semibold mb-1">
            {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
          </p>
          <p className="text-sm opacity-80">
            {xAxis} vs {yAxis} 
            {colorBy && ` (colored by ${colorBy})`}
          </p>
        </div>
      </div>
    );
  };

  const renderPivotTable = () => {
    // This is a placeholder for an actual pivot table
    // In a real implementation, we would use a library for this
    
    if (!xAxis || !yAxis) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <p className="text-gray-500">Please select X and Y axes to generate a pivot table</p>
        </div>
      );
    }
    
    // Create a simple mock pivot table
    const rows = [...new Set(dataset.data.map(row => row[xAxis]))].slice(0, 5);
    const columns = [...new Set(dataset.data.map(row => row[colorBy || xAxis]))].slice(0, 5);
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {xAxis} / {colorBy || xAxis}
              </th>
              {columns.map((col, idx) => (
                <th 
                  key={idx}
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row}
                </td>
                {columns.map((col, colIdx) => (
                  <td 
                    key={colIdx}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {/* Generate a random value for demonstration */}
                    {Math.round(Math.random() * 100)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Data Visualization" 
        description="Create insightful visualizations to explore your data"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar for chart controls */}
        <Card className="lg:col-span-1">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Visualization Type</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={activeTab === 'charts' ? 'primary' : 'outline'} 
                  onClick={() => setActiveTab('charts')}
                  fullWidth
                >
                  Charts
                </Button>
                <Button 
                  variant={activeTab === 'pivot' ? 'primary' : 'outline'} 
                  onClick={() => setActiveTab('pivot')}
                  fullWidth
                >
                  Pivot Table
                </Button>
              </div>
            </div>
            
            {activeTab === 'charts' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Chart Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  <ChartTypeButton 
                    type="bar" 
                    label="Bar Chart" 
                    icon={<BarChart2 size={16} />} 
                    active={chartType === 'bar'} 
                    onClick={() => setChartType('bar')} 
                  />
                  <ChartTypeButton 
                    type="line" 
                    label="Line Chart" 
                    icon={<LineChart size={16} />} 
                    active={chartType === 'line'} 
                    onClick={() => setChartType('line')} 
                  />
                  <ChartTypeButton 
                    type="pie" 
                    label="Pie Chart" 
                    icon={<PieChart size={16} />} 
                    active={chartType === 'pie'} 
                    onClick={() => setChartType('pie')} 
                  />
                  <ChartTypeButton 
                    type="scatter" 
                    label="Scatter Plot" 
                    icon={<ScatterChart size={16} />} 
                    active={chartType === 'scatter'} 
                    onClick={() => setChartType('scatter')} 
                  />
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Selection</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    X-Axis
                  </label>
                  <select 
                    value={xAxis} 
                    onChange={(e) => setXAxis(e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Column</option>
                    {dataset.columns.map((column) => (
                      <option key={column} value={column}>
                        {column} ({dataset.columnStats[column].dtype})
                      </option>
                    ))}
                  </select>
                </div>
                
                {activeTab === 'charts' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Y-Axis
                    </label>
                    <select 
                      value={yAxis} 
                      onChange={(e) => setYAxis(e.target.value)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select Column</option>
                      {dataset.columns
                        .filter(column => dataset.columnStats[column].dtype === 'numeric')
                        .map((column) => (
                          <option key={column} value={column}>
                            {column}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {activeTab === 'charts' ? 'Color By' : 'Columns'}
                  </label>
                  <select 
                    value={colorBy} 
                    onChange={(e) => setColorBy(e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">None</option>
                    {dataset.columns.map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                </div>
                
                {activeTab === 'pivot' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aggregation Function
                    </label>
                    <select 
                      value={aggFunction} 
                      onChange={(e) => setAggFunction(e.target.value)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="sum">Sum</option>
                      <option value="avg">Average</option>
                      <option value="min">Minimum</option>
                      <option value="max">Maximum</option>
                      <option value="count">Count</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Main chart area */}
        <Card className="lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {activeTab === 'charts' ? 'Chart Visualization' : 'Pivot Table'}
            </h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                icon={<Copy size={16} />}
                onClick={handleCopyChartCode}
              >
                Copy Code
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                icon={<Download size={16} />}
                onClick={handleDownloadChart}
              >
                Download
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                icon={<Maximize2 size={16} />}
                onClick={() => {
                  // In a real implementation, this would maximize the chart
                  alert('In a real implementation, this would open a fullscreen chart view');
                }}
              >
                Fullscreen
              </Button>
            </div>
          </div>
          
          {/* Visualization area */}
          {activeTab === 'charts' ? renderChart() : renderPivotTable()}
          
          {(!xAxis || !yAxis) && activeTab === 'charts' && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-md text-yellow-800 text-sm">
              <div className="flex">
                <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
                <p>Please select both X and Y axes to generate a chart.</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

interface ChartTypeButtonProps {
  type: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const ChartTypeButton: React.FC<ChartTypeButtonProps> = ({
  type,
  label,
  icon,
  active,
  onClick
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center p-3 rounded-md transition-colors duration-200 ${
        active 
          ? 'bg-blue-50 border border-blue-200 text-blue-700' 
          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span className={`mr-2 ${active ? 'text-blue-500' : 'text-gray-500'}`}>{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
};

export default VisualizationPage;