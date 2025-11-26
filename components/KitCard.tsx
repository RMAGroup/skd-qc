import React from 'react';
import { KitQcEntry, SimulatedKit } from '../types';
import { calculateProgress, getVehicleModel } from '../services/qcService';
import { getKitCardStyle } from '../utils/kitCardStyles';

interface KitCardProps {
  kit: SimulatedKit;
  entries: KitQcEntry[];
  onSelect: (kit: SimulatedKit) => void;
}

const KitCard: React.FC<KitCardProps> = ({ kit, entries, onSelect }) => {
  const model = getVehicleModel(kit.VehicleModelCode);
  const { percentage, completed, total } = calculateProgress(kit.KitNumber, entries);
  
  const isComplete = percentage === 100;
  const style = getKitCardStyle(isComplete, model);

  return (
    <button 
      onClick={() => onSelect(kit)}
      className={`w-full text-left group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg ${style.bgClass}`}
    >
      {isComplete && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
          <div className="border-4 border-gray-300/50 text-gray-300/50 font-black text-3xl uppercase p-2 transform -rotate-12 tracking-widest whitespace-nowrap">
            Completed
          </div>
        </div>
      )}

      <div className="relative z-10 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className={`text-lg font-bold tracking-tight leading-tight ${style.textPrimary}`}>{kit.KitNumber}</h3>
            <p className={`font-normal text-xs mt-0.5 ${style.textSecondary}`}>{model?.Name}</p>
          </div>
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium tracking-wide uppercase backdrop-blur-sm ${style.badgeClass}`}>
              {model?.VehicleType}
          </span>
        </div>

        <div>
          <div className="flex justify-between items-end mb-1.5">
             <div className="flex items-baseline">
                <span className={`text-2xl font-bold leading-none ${style.textPrimary}`}>{completed}</span>
                <span className={`text-lg font-medium leading-none opacity-60 mx-1 ${style.textPrimary}`}>/</span>
                <span className={`text-lg font-medium leading-none opacity-60 ${style.textPrimary}`}>{total}</span>
             </div>
             <span className={`text-xl font-bold opacity-80 ${style.textSecondary}`}>{percentage}%</span>
          </div>
          
          <div className={`w-full rounded-full h-1.5 overflow-hidden backdrop-blur-sm ${style.progressBarBg}`}>
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${style.progressBarFill}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default KitCard;