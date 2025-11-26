import { INITIAL_DATA } from '../constants';
import { CategoryGroup, EnrichedQcItem, KitQcEntry, QcCategory, SimulatedKit } from '../types';

const { QcItems, ModelQcItems, QcCategories } = INITIAL_DATA;

export const getKitDetails = (kitNumber: string): SimulatedKit | undefined => {
  return INITIAL_DATA.SimulatedKits.find(k => k.KitNumber === kitNumber);
};

export const getVehicleModel = (modelCode: string) => {
  return INITIAL_DATA.VehicleModels.find(m => m.Code === modelCode);
};

export const getInspectionItemsForKit = (
  kitNumber: string,
  entries: KitQcEntry[]
): CategoryGroup[] => {
  const kit = getKitDetails(kitNumber);
  if (!kit) return [];

  // 1. Get all Item IDs valid for this vehicle model
  const validModelItems = ModelQcItems.filter(
    mqi => mqi.VehicleModelCode === kit.VehicleModelCode
  );

  // 2. Map definitions to valid items
  const enrichedItems: EnrichedQcItem[] = validModelItems.map(mqi => {
    const itemDef = QcItems.find(i => i.Id === mqi.QcItemId);
    const existingEntry = entries.find(e => e.KitNumber === kitNumber && e.QcItemId === mqi.QcItemId);
    
    if (!itemDef) throw new Error(`Data Integrity Error: Item ${mqi.QcItemId} not found`);

    return {
      ...itemDef,
      ModelSortOrder: mqi.SortOrder,
      CurrentEntry: existingEntry
    };
  });

  // 3. Group by Category
  const grouped = QcCategories
    .sort((a, b) => a.SortOrder - b.SortOrder)
    .map(category => {
      const itemsInCategory = enrichedItems
        .filter(i => i.QcCategoryCode === category.Code)
        .sort((a, b) => a.ModelSortOrder - b.ModelSortOrder);
      
      return {
        Category: category,
        Items: itemsInCategory
      };
    })
    .filter(g => g.Items.length > 0); // Remove empty categories

  return grouped;
};

export const calculateProgress = (kitNumber: string, entries: KitQcEntry[]) => {
  const kit = getKitDetails(kitNumber);
  if (!kit) return { total: 0, completed: 0, percentage: 0 };

  const validModelItems = ModelQcItems.filter(
    mqi => mqi.VehicleModelCode === kit.VehicleModelCode
  );

  let totalChecksRequired = 0;
  let completedChecks = 0;

  validModelItems.forEach(mqi => {
    const item = QcItems.find(i => i.Id === mqi.QcItemId);
    if (!item) return;

    // Increment denominator based on required checks
    totalChecksRequired += item.CheckType.length;

    // Find entry for this specific item
    const entry = entries.find(e => e.KitNumber === kitNumber && e.QcItemId === mqi.QcItemId);
    
    if (entry) {
      // Only count if the specific check type is required AND has a truthy value (PASS/FAIL/N/A)
      if (item.CheckType.includes('Appearance') && entry.AppearanceStatus) {
        completedChecks++;
      }
      if (item.CheckType.includes('Function') && entry.FunctionStatus) {
        completedChecks++;
      }
    }
  });

  const percentage = totalChecksRequired === 0 ? 0 : Math.round((completedChecks / totalChecksRequired) * 100);

  return { total: totalChecksRequired, completed: completedChecks, percentage };
};

export const getPassFailStats = (kitNumber: string, entries: KitQcEntry[]) => {
  let pass = 0;
  let fail = 0;
  entries.filter(e => e.KitNumber === kitNumber).forEach(e => {
    if (e.AppearanceStatus === 'PASS') pass++;
    if (e.AppearanceStatus === 'FAIL') fail++;
    if (e.FunctionStatus === 'PASS') pass++;
    if (e.FunctionStatus === 'FAIL') fail++;
  });
  return { pass, fail };
};

export const isCheckComplete = (item: EnrichedQcItem, checkType: 'Appearance' | 'Function'): boolean => {
  if (!item.CheckType.includes(checkType)) return true;
  const status = checkType === 'Appearance' ? item.CurrentEntry?.AppearanceStatus : item.CurrentEntry?.FunctionStatus;
  return !!status;
};

export const isItemComplete = (item: EnrichedQcItem): boolean => {
  return isCheckComplete(item, 'Appearance') && isCheckComplete(item, 'Function');
};

export const isCategoryComplete = (items: EnrichedQcItem[]): boolean => {
  return items.every(isItemComplete);
};

export const getCategoryStats = (items: EnrichedQcItem[]) => {
  let pass = 0;
  let fail = 0;
  let completedChecks = 0;
  let totalChecks = 0;

  items.forEach(item => {
    const entry = item.CurrentEntry;
    
    if (item.CheckType.includes('Appearance')) {
      totalChecks++;
      if (entry?.AppearanceStatus) {
        completedChecks++;
        if (entry.AppearanceStatus === 'PASS') pass++;
        if (entry.AppearanceStatus === 'FAIL') fail++;
      }
    }

    if (item.CheckType.includes('Function')) {
      totalChecks++;
      if (entry?.FunctionStatus) {
        completedChecks++;
        if (entry.FunctionStatus === 'PASS') pass++;
        if (entry.FunctionStatus === 'FAIL') fail++;
      }
    }
  });

  return { pass, fail, completedChecks, totalChecks };
};