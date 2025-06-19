import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import { BarChart2, PieChart, Activity, AlertTriangle, Loader, ChevronDown, ChevronUp } from 'lucide-react';

const ProfilingPage: React.FC = () => {
  const { dataset } = useData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    variables: false,
    correlations: false,
    missing: false
  });

  useEffect(() => {
    // Reset profile data when dataset changes
    setProfileData(null);
  }, [dataset]);

  if (!dataset || dataset.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">No Dataset Available</h2>
        <p className="text-gray-600 mb-4">Please upload a dataset first to generate a profile report.</p>
        <Button variant="primary" onClick={() => window.location.href = '#upload'}>
          Go to Upload
        </Button>
      </div>
    );
  }

  const handleGenerateProfile = () => {
    setIsGenerating(true);
    
    // This would typically call a backend API for profiling
    // For now, we'll simulate it with a timeout and generate a basic profile
    setTimeout(() => {
      const profile = generateBasicProfile(dataset);
      setProfileData(profile);
      setIsGenerating(false);
    }, 1500);
  };

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Data Profiling" 
        description="Generate detailed insights about your dataset"
      />
      
      {!profileData && (
        <Card>
          <div className="text-center p-6">
            {isGenerating ? (
              <div className="flex flex-col items-center">
                <Loader size={48} className="text-blue-500 mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Generating Profile Report</h3>
                <p className="text-gray-600">This may take a moment depending on the size of your dataset...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <BarChart2 size={48} className="text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Ready to Generate Profile</h3>
                <p className="text-gray-600 mb-6">
                  Generate a comprehensive profile report to understand your data better. 
                  The report will include statistics, distributions, correlations, and more.
                </p>
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleGenerateProfile}
                >
                  Generate Profile Report
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
      
      {profileData && (
        <div className="space-y-6">
          {/* Overview Section */}
          <ProfileSection 
            title="Dataset Overview" 
            icon={<BarChart2 size={20} />}
            isExpanded={expandedSections.overview}
            onToggle={() => toggleSection('overview')}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard title="Number of Rows" value={profileData.overview.rows} />
              <StatCard title="Number of Columns" value={profileData.overview.columns} />
              <StatCard title="Missing Cells" value={`${profileData.overview.missing} (${profileData.overview.missingPercent}%)`} />
              <StatCard title="Duplicate Rows" value={profileData.overview.duplicates} />
              <StatCard title="Memory Usage" value={profileData.overview.memoryUsage} />
              <StatCard title="Data Types" value={profileData.overview.datatypes.join(', ')} />
            </div>
          </ProfileSection>
          
          {/* Variables Section */}
          <ProfileSection 
            title="Variable Analysis" 
            icon={<Activity size={20} />}
            isExpanded={expandedSections.variables}
            onToggle={() => toggleSection('variables')}
          >
            <div className="space-y-4">
              {profileData.variables.map((variable: any) => (
                <Card key={variable.name} className="overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                    <h4 className="font-medium text-gray-800">{variable.name}</h4>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {variable.type}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {variable.type === 'numeric' && (
                        <>
                          <StatCard title="Min" value={variable.min.toFixed(2)} size="sm" />
                          <StatCard title="Max" value={variable.max.toFixed(2)} size="sm" />
                          <StatCard title="Mean" value={variable.mean.toFixed(2)} size="sm" />
                          <StatCard title="St. Dev" value={variable.std.toFixed(2)} size="sm" />
                        </>
                      )}
                      {variable.type === 'categorical' && (
                        <>
                          <StatCard title="Unique Values" value={variable.unique} size="sm" />
                          <StatCard title="Most Common" value={variable.mostCommon} size="sm" />
                          <StatCard title="Frequency" value={variable.mostCommonFreq} size="sm" />
                          <StatCard title="Missing" value={`${variable.missing} (${variable.missingPercent}%)`} size="sm" />
                        </>
                      )}
                    </div>
                    
                    {/* Placeholder for distribution chart */}
                    <div className="mt-4 h-32 bg-gray-100 rounded-md flex items-center justify-center">
                      {variable.type === 'numeric' ? (
                        <Activity size={24} className="text-blue-400" />
                      ) : (
                        <PieChart size={24} className="text-blue-400" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ProfileSection>
          
          {/* Correlations Section */}
          <ProfileSection 
            title="Correlations" 
            icon={<Activity size={20} />}
            isExpanded={expandedSections.correlations}
            onToggle={() => toggleSection('correlations')}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variable</th>
                    {profileData.correlations.columns.map((col: string) => (
                      <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {profileData.correlations.data.map((row: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {profileData.correlations.columns[index]}
                      </td>
                      {row.map((value: number, i: number) => (
                        <td 
                          key={i} 
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          style={{
                            backgroundColor: value > 0 
                              ? `rgba(59, 130, 246, ${Math.abs(value) * 0.5})` 
                              : value < 0 
                                ? `rgba(239, 68, 68, ${Math.abs(value) * 0.5})` 
                                : 'transparent'
                          }}
                        >
                          {value.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ProfileSection>
          
          {/* Missing Values Section */}
          <ProfileSection 
            title="Missing Values" 
            icon={<AlertTriangle size={20} />}
            isExpanded={expandedSections.missing}
            onToggle={() => toggleSection('missing')}
          >
            <div className="space-y-4">
              {profileData.missing.map((item: any) => (
                <div key={item.column} className="flex items-center">
                  <div className="w-40 font-medium text-gray-800">{item.column}</div>
                  <div className="flex-grow h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500" 
                      style={{ width: `${item.percentMissing}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-right text-sm text-gray-600">
                    {item.percentMissing}%
                  </div>
                </div>
              ))}
            </div>
          </ProfileSection>
        </div>
      )}
    </div>
  );
};

interface ProfileSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  icon,
  children,
  isExpanded,
  onToggle
}) => {
  return (
    <Card>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <span className="mr-2 text-blue-500">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <span className="text-gray-500">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </div>
      
      {isExpanded && (
        <div className="border-t p-4">
          {children}
        </div>
      )}
    </Card>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  size?: 'sm' | 'md' | 'lg';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, size = 'md' }) => {
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };
  
  const titleClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const valueClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };
  
  return (
    <div className={`bg-white border rounded-md ${sizeClasses[size]}`}>
      <div className={`${titleClasses[size]} text-gray-500 mb-1`}>{title}</div>
      <div className={`${valueClasses[size]} font-semibold text-gray-800`}>{value}</div>
    </div>
  );
};

// Utility function to generate a basic profile (in real app, this would come from backend)
const generateBasicProfile = (dataset: any) => {
  const { data, columns, columnStats } = dataset;
  
  // Generate basic correlation matrix (mock data)
  const numericColumns = columns.filter(col => columnStats[col].dtype === 'numeric');
  const correlationMatrix = Array(numericColumns.length).fill(0).map((_, i) => 
    Array(numericColumns.length).fill(0).map((_, j) => {
      if (i === j) return 1;
      // Generate random correlation (-1 to 1)
      return Math.round((Math.random() * 2 - 1) * 100) / 100;
    })
  );
  
  // Generate missing values data
  const missingData = columns.map(col => ({
    column: col,
    missing: columnStats[col].missing,
    percentMissing: ((columnStats[col].missing / data.length) * 100).toFixed(1)
  }));
  
  // Generate variable analysis
  const variables = columns.map(col => {
    const stats = columnStats[col];
    
    if (stats.dtype === 'numeric') {
      return {
        name: col,
        type: 'numeric',
        min: stats.min || 0,
        max: stats.max || 0,
        mean: stats.mean || 0,
        std: Math.sqrt((Math.random() * 10)), // Mock standard deviation
        missing: stats.missing,
        missingPercent: ((stats.missing / data.length) * 100).toFixed(1)
      };
    } else {
      // For categorical variables
      return {
        name: col,
        type: 'categorical',
        unique: stats.unique ? stats.unique.length : 0,
        mostCommon: 'Category A', // Mock most common category
        mostCommonFreq: '30%', // Mock frequency
        missing: stats.missing,
        missingPercent: ((stats.missing / data.length) * 100).toFixed(1)
      };
    }
  });
  
  return {
    overview: {
      rows: data.length,
      columns: columns.length,
      missing: columns.reduce((acc, col) => acc + columnStats[col].missing, 0),
      missingPercent: ((columns.reduce((acc, col) => acc + columnStats[col].missing, 0) / (data.length * columns.length)) * 100).toFixed(1),
      duplicates: dataset.duplicates,
      memoryUsage: `${Math.round(JSON.stringify(data).length / 1024)} KB`,
      datatypes: [...new Set(columns.map(col => columnStats[col].dtype))]
    },
    variables,
    correlations: {
      columns: numericColumns,
      data: correlationMatrix
    },
    missing: missingData
  };
};

export default ProfilingPage;