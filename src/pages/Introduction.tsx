import React from 'react';
import { BookOpen, Upload, FileText, Database, PieChart, BarChartHorizontal, Download } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';

const Introduction: React.FC = () => {
  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Welcome to the AutoML Platform" 
        description="A comprehensive platform for data analysis, visualization, and machine learning without writing code."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard 
          title="Upload" 
          icon={<Upload size={24} className="text-blue-600" />} 
          description="Easily upload your dataset and explore its contents with detailed statistics."
        />
        <FeatureCard 
          title="Cleaning" 
          icon={<FileText size={24} className="text-blue-600" />} 
          description="Remove unnecessary columns, handle missing values, and detect outliers."
        />
        <FeatureCard 
          title="Profiling" 
          icon={<Database size={24} className="text-blue-600" />} 
          description="Get comprehensive insights into your data with detailed profiling reports."
        />
        <FeatureCard 
          title="Visualization" 
          icon={<PieChart size={24} className="text-blue-600" />} 
          description="Create interactive visualizations to uncover patterns in your data."
        />
        <FeatureCard 
          title="Modeling" 
          icon={<BarChartHorizontal size={24} className="text-blue-600" />} 
          description="Train and evaluate machine learning models with just a few clicks."
        />
        <FeatureCard 
          title="Download" 
          icon={<Download size={24} className="text-blue-600" />} 
          description="Download your processed datasets and trained models for deployment."
        />
      </div>
      
      <Card className="mt-8">
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-4">What is AutoML?</h2>
          <p>
            Automated Machine Learning (AutoML) democratizes the machine learning process by automating the selection, 
            composition, and parametrization of machine learning models. Our platform provides an intuitive interface 
            to leverage these capabilities without requiring deep expertise in data science or programming.
          </p>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Key Benefits</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Reduce the time and expertise needed to implement machine learning solutions</li>
            <li>Quickly explore and analyze data with interactive visualizations</li>
            <li>Compare multiple algorithms to find the best model for your data</li>
            <li>Focus on deriving insights rather than technical implementation details</li>
            <li>Make data-driven decisions with confidence</li>
          </ul>
          
          <p className="mt-4">
            Get started by navigating to the <strong>Upload</strong> section and uploading your dataset!
          </p>
        </div>
      </Card>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon, description }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center mb-4">
        <div className="mr-3 p-2 bg-blue-50 rounded-lg">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Introduction;