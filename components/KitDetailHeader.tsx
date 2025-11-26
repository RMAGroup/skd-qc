import React from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import InfoBox from './InfoBox';
import Button from './Button';

interface KitDetailHeaderProps {
  kitNumber: string;
  modelName?: string;
  isScrolled: boolean;
  pass: number;
  fail: number;
  completed: number;
  total: number;
  percentage: number;
  onBack: () => void;
  onReset: () => void;
}

const KitDetailHeader: React.FC<KitDetailHeaderProps> = ({
  kitNumber,
  modelName,
  isScrolled,
  pass,
  fail,
  completed,
  total,
  percentage,
  onBack,
  onReset,
}) => {
  return (
    <div className={`bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm transition-[padding] duration-300 ${isScrolled ? 'pt-2 pb-4' : 'py-4'}`}>
      <div className="max-w-5xl mx-auto pl-12 pr-6 md:pl-16 md:pr-10 relative">
        
        <div className={`absolute left-2 md:left-4 transition-all duration-300 ${isScrolled ? 'top-1/2 -translate-y-1/2' : ''}`}>
           <Button
              type="ghost"
              size="normal"
              icon={ArrowLeft}
              onClick={onBack}
              className="p-2 rounded-full"
              title="Back to Queue"
            />
        </div>

        <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out overflow-hidden ${isScrolled ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}>
          <div className="min-h-0 flex items-center justify-between mb-4">
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">{kitNumber}</h1>
              <span className="text-sm text-gray-500 font-medium">{modelName} Inspection</span>
            </div>

            <Button
              type="danger"
              size="normal"
              icon={RotateCcw}
              onClick={onReset}
            >
              Reset
            </Button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-3">
             <div className="flex gap-2 items-end">
                 <InfoBox title="Pass" hideTitle={isScrolled}>
                    <span className="font-bold text-green-600 leading-none text-xl">{pass}</span>
                 </InfoBox>
                 
                 <div className={`w-px bg-gray-200 mx-0.5 transition-[height] duration-300 ${isScrolled ? 'h-5' : 'h-6'}`}></div>
                 
                 <InfoBox title="Fail" hideTitle={isScrolled}>
                    <span className="font-bold text-red-600 leading-none text-xl">{fail}</span>
                 </InfoBox>
                 
                 <div className={`w-px bg-gray-200 mx-0.5 transition-[height] duration-300 ${isScrolled ? 'h-5' : 'h-6'}`}></div>
                 
                 <InfoBox title="Done" hideTitle={isScrolled}>
                    <span className="font-bold text-gray-700 leading-none text-xl">{completed}</span>
                    <span className={`font-medium text-gray-400 ml-1 transition-all duration-300 ${isScrolled ? 'text-[10px]' : 'text-xs'}`}>/ {total}</span>
                 </InfoBox>
             </div>

             <span className={`font-bold text-gray-700 leading-none transition-all duration-300 ${isScrolled ? 'text-2xl' : 'text-3xl'}`}>
               {percentage}%
             </span>
          </div>

          <div className={`bg-gray-100 rounded-full overflow-hidden w-full transition-all duration-300 ${isScrolled ? 'h-1.5' : 'h-2'}`}>
             <div 
                className={`h-full transition-all duration-500 ${percentage === 100 ? 'bg-green-500' : 'bg-blue-600'}`} 
                style={{ width: `${percentage}%` }} 
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitDetailHeader;
