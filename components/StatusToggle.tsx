import React from 'react';
import { Check, X } from 'lucide-react';
import { QcStatus } from '../types';

interface StatusToggleProps {
  status: QcStatus;
  onChange: (status: QcStatus) => void;
  label: string;
}

const StatusToggle: React.FC<StatusToggleProps> = ({ status, onChange, label }) => {
  const isPass = status === 'PASS';
  const isFail = status === 'FAIL';

  return (
    <div className="flex flex-col items-start gap-1.5">
      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{label}</span>
      <div className="flex bg-gray-100 rounded-lg p-1 shadow-inner border border-gray-200">
        <button
          onClick={() => onChange(isPass ? null : 'PASS')}
          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-1
            ${isPass 
              ? 'bg-green-600 text-white shadow-md transform scale-105' 
              : 'text-gray-500 hover:bg-white hover:shadow-sm'}`}
        >
          <Check size={12} strokeWidth={3} />
          PASS
        </button>

        <button
          onClick={() => onChange(isFail ? null : 'FAIL')}
          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-1 mx-1
            ${isFail 
              ? 'bg-red-600 text-white shadow-md transform scale-105' 
              : 'text-gray-500 hover:bg-white hover:shadow-sm'}`}
        >
          <X size={12} strokeWidth={3} />
          FAIL
        </button>
      </div>
    </div>
  );
};

export default StatusToggle;