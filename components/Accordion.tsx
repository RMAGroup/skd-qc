import React, { useState, useEffect } from 'react';

type AccordionState = 'default' | 'success' | 'danger' | 'disabled';

interface AccordionProps {
  header: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  state?: AccordionState;
  defaultOpen?: boolean;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  header,
  children,
  isOpen: controlledIsOpen,
  onToggle,
  state = 'default',
  defaultOpen = true,
  className = '',
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (state === 'disabled') return;
    
    if (onToggle) {
      onToggle();
    }
    
    if (!isControlled) {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  const stateStyles = {
    default: {
      container: 'border-gray-100',
      header: 'bg-white hover:bg-gray-50 text-gray-800',
      border: 'border-gray-100',
    },
    success: {
      container: 'border-emerald-200',
      header: 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900',
      border: 'border-emerald-100',
    },
    danger: {
      container: 'border-red-200',
      header: 'bg-red-50 hover:bg-red-100/80 text-red-900',
      border: 'border-red-100',
    },
    disabled: {
      container: 'border-gray-200',
      header: 'bg-gray-100 text-gray-400 cursor-not-allowed',
      border: 'border-gray-200',
    },
  };

  const styles = stateStyles[state];

  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-colors duration-300 ${styles.container} ${className}`}>
      <button
        onClick={handleToggle}
        disabled={state === 'disabled'}
        className={`w-full flex items-center justify-between p-4 transition-colors duration-300 gap-4
          ${styles.header}
          ${!isOpen ? '' : `border-b ${styles.border}`}
        `}
      >
        {header}
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className={`overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;