import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, className = '' }) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {description && <p className="mt-2 text-gray-600">{description}</p>}
    </div>
  );
};

export default SectionHeader;