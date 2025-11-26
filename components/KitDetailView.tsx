import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SimulatedKit, KitQcEntry, CheckType, QcStatus } from '../types';
import { calculateProgress, getInspectionItemsForKit, getPassFailStats, getVehicleModel, isCategoryComplete } from '../services/qcService';
import KitDetailHeader from './KitDetailHeader';
import CategorySection from './CategorySection';
import Button from './Button';

interface KitDetailViewProps {
  kit: SimulatedKit;
  entries: KitQcEntry[];
  totalKits: number;
  totalChecksLogged: number;
  onBack: () => void;
  onUpdateEntry: (kitNumber: string, itemId: number, type: CheckType, status: QcStatus) => void;
  onReset: () => void;
}

const KitDetailView: React.FC<KitDetailViewProps> = ({ 
  kit, 
  entries, 
  onBack, 
  onUpdateEntry,
  onReset
}) => {
  const model = getVehicleModel(kit.VehicleModelCode);
  const categories = useMemo(() => getInspectionItemsForKit(kit.KitNumber, entries), [kit.KitNumber, entries]);
  const progress = calculateProgress(kit.KitNumber, entries);
  const stats = getPassFailStats(kit.KitNumber, entries);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Track completed categories to trigger auto-advance
  const completedCategoryCodes = useMemo(() => {
    return categories
      .filter(g => isCategoryComplete(g.Items))
      .map(g => g.Category.Code);
  }, [categories]);

  const prevCompletedRef = useRef<string[]>([]);

  // Initialize state: Collapse all except the first incomplete category
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    let firstIncompleteFound = false;

    const initialCategories = getInspectionItemsForKit(kit.KitNumber, entries);
    
    initialCategories.forEach(group => {
      if (isCategoryComplete(group.Items)) {
         initialState[group.Category.Code] = true;
      } else {
         if (!firstIncompleteFound) {
             initialState[group.Category.Code] = false; // Open first incomplete
             firstIncompleteFound = true;
         } else {
             initialState[group.Category.Code] = true; // Collapse subsequent incomplete
         }
      }
    });
    return initialState;
  });

  // Auto-advance effect
  useEffect(() => {
    const prev = prevCompletedRef.current;
    const current = completedCategoryCodes;

    // Find if any category was just completed
    const newlyCompleted = current.filter(c => !prev.includes(c));

    if (newlyCompleted.length > 0) {
       setCollapsedSections(prevSections => {
         const nextState = { ...prevSections };
         
         // Collapse newly completed
         newlyCompleted.forEach(code => {
           nextState[code] = true;
         });

         // Find the next incomplete category to open
         // We look through the full list of categories
         const nextIncomplete = categories.find(c => !isCategoryComplete(c.Items));
         if (nextIncomplete) {
           nextState[nextIncomplete.Category.Code] = false;
         }

         return nextState;
       });
    }

    prevCompletedRef.current = current;
  }, [completedCategoryCodes, categories]);

  // Scroll detection using IntersectionObserver (prevents layout shift feedback loops)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the top sentinel is NOT intersecting, we have scrolled down
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '0px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleUpdate = (itemId: number, type: CheckType, status: QcStatus) => {
    onUpdateEntry(kit.KitNumber, itemId, type, status);
  };

  const toggleSection = (code: string) => {
    setCollapsedSections(prev => ({ ...prev, [code]: !prev[code] }));
  };

  return (
    <div className="flex-1 h-full overflow-y-auto scroll-smooth bg-gray-50 relative">
      <div ref={observerTarget} className="absolute top-0 left-0 w-full h-px pointer-events-none opacity-0" />
      
      <KitDetailHeader
        kitNumber={kit.KitNumber}
        modelName={model?.Name}
        isScrolled={isScrolled}
        pass={stats.pass}
        fail={stats.fail}
        completed={progress.completed}
        total={progress.total}
        percentage={progress.percentage}
        onBack={onBack}
        onReset={onReset}
      />

      <div className="max-w-5xl mx-auto pl-12 pr-6 md:pl-16 md:pr-10 pt-6 pb-10 space-y-4">
        {categories.map((group) => {
          const isComplete = isCategoryComplete(group.Items);
          const isCollapsed = collapsedSections[group.Category.Code];

          return (
            <CategorySection
              key={group.Category.Code}
              group={group}
              isComplete={isComplete}
              isCollapsed={isCollapsed}
              onToggle={toggleSection}
              onUpdateItem={handleUpdate}
            />
          );
        })}

        <div className="pt-4 pb-8">
            <Button
                type="secondary"
                size="large"
                icon={ArrowLeft}
                onClick={onBack}
                className="w-full justify-start pl-8 group"
            >
                Back to Queue
            </Button>
        </div>

        {categories.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p>No inspection items configuration found for this model.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default KitDetailView;