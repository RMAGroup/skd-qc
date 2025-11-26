import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { CategoryGroup, CheckType, QcStatus } from '../types';
import { getCategoryStats } from '../services/qcService';
import QcItemCard from './QcItemCard';
import Accordion from './Accordion';

interface CategorySectionProps {
  group: CategoryGroup;
  isComplete: boolean;
  isCollapsed: boolean;
  onToggle: (code: string) => void;
  onUpdateItem: (itemId: number, type: CheckType, status: QcStatus) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  group,
  isComplete,
  isCollapsed,
  onToggle,
  onUpdateItem,
}) => {
  const sectionStats = getCategoryStats(group.Items);
  const accordionState = isComplete ? 'success' : 'default';

  const header = (
    <>
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-lg font-bold text-gray-400">
          {group.Category.Code}
        </span>
        <h2 className="text-lg font-bold truncate">
          {group.Category.Name}
        </h2>
      </div>

      <div className="flex items-center gap-4 ml-auto flex-shrink-0">
        {isComplete ? (
          <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-fadeIn">
            <Check size={12} strokeWidth={3} />
            DONE
          </span>
        ) : (
          <div className="flex items-baseline text-lg">
            <span className="font-bold text-gray-900">
              {sectionStats.completedChecks}
            </span>
            <span className="font-medium text-gray-400 mx-1">/</span>
            <span className="font-medium text-gray-400">
              {sectionStats.totalChecks}
            </span>
          </div>
        )}

        <div className={`text-gray-400 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}>
          <ChevronDown size={20} />
        </div>
      </div>
    </>
  );

  return (
    <Accordion
      header={header}
      isOpen={!isCollapsed}
      onToggle={() => onToggle(group.Category.Code)}
      state={accordionState}
    >
      <div className="p-4 space-y-3 bg-gray-50/50">
        {group.Items.map((item) => (
          <QcItemCard 
            key={item.Id} 
            item={item} 
            onUpdate={onUpdateItem} 
          />
        ))}
      </div>
    </Accordion>
  );
};

export default CategorySection;
