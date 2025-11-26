import { VehicleModel } from '../types';

export interface KitCardStyle {
  bgClass: string;
  textPrimary: string;
  textSecondary: string;
  progressBarBg: string;
  progressBarFill: string;
  badgeClass: string;
}

export const getKitCardStyle = (isComplete: boolean, model?: VehicleModel): KitCardStyle => {
  if (isComplete) {
    return {
      bgClass: 'bg-gray-50 border border-gray-200 hover:bg-gray-100',
      textPrimary: 'text-gray-400',
      textSecondary: 'text-gray-400',
      progressBarBg: 'bg-gray-200',
      progressBarFill: 'bg-gray-400',
      badgeClass: 'bg-gray-200 text-gray-500',
    };
  }

  const isRanger = model?.Code === 'Ranger';
  
  return {
    bgClass: isRanger 
      ? 'bg-slate-800 shadow-md shadow-slate-200 border border-slate-700 hover:bg-slate-900'
      : 'bg-blue-700 shadow-md shadow-blue-200 border border-blue-600 hover:bg-blue-800',
    textPrimary: 'text-white',
    textSecondary: isRanger ? 'text-slate-300' : 'text-blue-200',
    progressBarBg: isRanger ? 'bg-black/30' : 'bg-black/20',
    progressBarFill: 'bg-white',
    badgeClass: 'bg-white/10 text-white',
  };
};
