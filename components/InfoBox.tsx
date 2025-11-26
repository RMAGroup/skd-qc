import React from 'react';

interface InfoBoxProps {
  title: string;
  children: React.ReactNode;
  hideTitle?: boolean;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

const InfoBox: React.FC<InfoBoxProps> = ({ 
  title, 
  children, 
  hideTitle = false, 
  className = '',
  align = 'start'
}) => {
  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
  }[align];

  return (
    <div className={`flex flex-col ${alignClass} justify-center ${className}`}>
      <span 
        className={`text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 transition-opacity duration-200
          ${hideTitle ? 'hidden' : 'block'}`}
      >
        {title}
      </span>
      <div className="flex items-baseline leading-none">
        {children}
      </div>
    </div>
  );
};

export default InfoBox;