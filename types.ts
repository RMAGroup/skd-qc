export type VehicleType = 'SUV' | 'Pickup';
export type QcStatus = 'PASS' | 'FAIL' | 'N/A' | null;
export type CheckType = 'Appearance' | 'Function';

export interface VehicleModel {
  Code: string;
  Name: string;
  VehicleType: VehicleType;
}

export interface QcCategory {
  Code: string;
  Name: string;
  SortOrder: number;
}

export interface QcItem {
  Id: number;
  QcCategoryCode: string;
  Description: string;
  DetailsOfInspection: string;
  CheckType: CheckType[];
  SortOrder: number;
}

export interface ModelQcItem {
  VehicleModelCode: string;
  QcItemId: number;
  SortOrder: number;
}

export interface SimulatedKit {
  KitNumber: string;
  VehicleModelCode: string;
}

export interface KitQcEntry {
  KitNumber: string;
  QcItemId: number;
  SortOrder: number;
  AppearanceStatus: QcStatus;
  FunctionStatus: QcStatus;
}

export interface AppData {
  VehicleModels: VehicleModel[];
  QcCategories: QcCategory[];
  QcItems: QcItem[];
  ModelQcItems: ModelQcItem[];
  SimulatedKits: SimulatedKit[];
  KitQcEntries: KitQcEntry[];
}

// Helper types for UI
export interface EnrichedQcItem extends QcItem {
  ModelSortOrder: number;
  CurrentEntry?: KitQcEntry;
}

export interface CategoryGroup {
  Category: QcCategory;
  Items: EnrichedQcItem[];
}