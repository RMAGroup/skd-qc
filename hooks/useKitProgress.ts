import { useMemo } from 'react';
import { SimulatedKit, KitQcEntry } from '../types';
import { calculateProgress } from '../services/qcService';

export const useKitProgress = (kits: SimulatedKit[], entries: KitQcEntry[]) => {
  return useMemo(() => {
    const progressMap = new Map<string, { completed: number; total: number; percentage: number }>();
    
    kits.forEach(kit => {
      progressMap.set(kit.KitNumber, calculateProgress(kit.KitNumber, entries));
    });
    
    return progressMap;
  }, [kits, entries]);
};

export const useActiveKitsCount = (kits: SimulatedKit[], entries: KitQcEntry[]) => {
  const progressMap = useKitProgress(kits, entries);
  
  return useMemo(() => {
    return kits.filter(kit => {
      const progress = progressMap.get(kit.KitNumber);
      return progress && progress.percentage < 100;
    }).length;
  }, [kits, progressMap]);
};
