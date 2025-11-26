import React from 'react';
import { CheckType, EnrichedQcItem, QcStatus } from '../types';
import { isItemComplete } from '../services/qcService';
import StatusToggle from './StatusToggle';

interface QcItemCardProps {
  item: EnrichedQcItem;
  onUpdate: (itemId: number, type: CheckType, status: QcStatus) => void;
}

const QcItemCard: React.FC<QcItemCardProps> = ({ item, onUpdate }) => {
  const hasAppearance = item.CheckType.includes('Appearance');
  const hasFunction = item.CheckType.includes('Function');

  const appearanceStatus = item.CurrentEntry?.AppearanceStatus || null;
  const functionStatus = item.CurrentEntry?.FunctionStatus || null;

  const isCompleted = isItemComplete(item);
  const hasFailure = appearanceStatus === 'FAIL' || functionStatus === 'FAIL';

  const formattedDetails = item.DetailsOfInspection.replace(/\//g, ' / ');

  return (
    <div className={`rounded-xl p-4 border transition-all duration-300
      ${hasFailure 
        ? 'bg-red-50/50 border-red-200 shadow-sm' 
        : isCompleted 
          ? 'bg-green-50/30 border-green-200 shadow-sm' 
          : 'bg-white border-gray-100 shadow-sm hover:shadow-md'}
      mb-3`}
    >
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        
        <div className="flex-1">
          <div className="flex items-start gap-3">
             <div className="mt-0.5 text-base font-bold text-gray-500">
                {item.Id}
             </div>
             <div>
                <h4 className={`font-semibold text-sm md:text-base leading-snug transition-colors duration-300 ${isCompleted ? 'text-gray-900' : 'text-gray-800'}`}>
                  {item.Description}
                </h4>
                <p className="text-sm text-gray-500 mt-0 font-medium">
                  {formattedDetails}
                </p>
             </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 justify-end items-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
          {hasAppearance && (
            <StatusToggle 
              label="Appearance" 
              status={appearanceStatus} 
              onChange={(s) => onUpdate(item.Id, 'Appearance', s)}
            />
          )}
          
          {hasAppearance && hasFunction && <div className="w-px h-10 bg-gray-200 mx-1 hidden sm:block"></div>}

          {hasFunction && (
            <StatusToggle 
              label="Function" 
              status={functionStatus} 
              onChange={(s) => onUpdate(item.Id, 'Function', s)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(QcItemCard);