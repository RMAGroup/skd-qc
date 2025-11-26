import React, { useState, useEffect, useMemo, useReducer } from 'react';
import { Database } from 'lucide-react';
import { INITIAL_DATA, DEFAULT_SORT_ORDER } from './constants';
import { calculateProgress } from './services/qcService';
import { CheckType, KitQcEntry, QcStatus, SimulatedKit } from './types';
import { useActiveKitsCount } from './hooks/useKitProgress';
import KitCard from './components/KitCard';
import KitDetailView from './components/KitDetailView';
import InfoBox from './components/InfoBox';
import DataView from './components/DataView';
import Button from './components/Button';

const App: React.FC = () => {
  const [entries, setEntries] = useState<KitQcEntry[]>([]);
  const [selectedKit, setSelectedKit] = useState<SimulatedKit | null>(null);
  const [resetVersion, setResetVersion] = useState(0);
  const [view, setView] = useState<'queue' | 'inspection' | 'data'>('queue');

  useEffect(() => {
    setEntries(INITIAL_DATA.KitQcEntries);
  }, []);

  const activeKitsCount = useActiveKitsCount(INITIAL_DATA.SimulatedKits, entries);

  const handleUpdateEntry = (kitNumber: string, itemId: number, type: CheckType, status: QcStatus) => {
    setEntries(prev => {
      const existingIndex = prev.findIndex(e => e.KitNumber === kitNumber && e.QcItemId === itemId);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        const entry = { ...updated[existingIndex] };
        
        if (type === 'Appearance') {
          entry.AppearanceStatus = status;
        } else {
          entry.FunctionStatus = status;
        }
        
        updated[existingIndex] = entry;
        return updated;
      } else {
        const sortOrder = INITIAL_DATA.ModelQcItems.find(
             m => m.QcItemId === itemId && m.VehicleModelCode === selectedKit?.VehicleModelCode
        )?.SortOrder || DEFAULT_SORT_ORDER;

        const newEntry: KitQcEntry = {
          KitNumber: kitNumber,
          QcItemId: itemId,
          SortOrder: sortOrder,
          AppearanceStatus: type === 'Appearance' ? status : null,
          FunctionStatus: type === 'Function' ? status : null,
        };
        return [...prev, newEntry];
      }
    });
  };

  const handleResetKit = (kitNumber: string) => {
    setEntries(prev => prev.filter(e => e.KitNumber !== kitNumber));
    setResetVersion(prev => prev + 1);
  };

  const handleSelectKit = (kit: SimulatedKit) => {
    setSelectedKit(kit);
    setView('inspection');
  };

  const handleBackToQueue = () => {
    setSelectedKit(null);
    setView('queue');
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-hidden">
      <nav className="bg-white border-b border-gray-200 z-30 shadow-sm flex-shrink-0">
        <div className="max-w-5xl mx-auto px-8 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">
              AutoQC <span className="text-blue-600">Pro</span>
            </h1>
          </div>
        </div>
      </nav>

      {view === 'inspection' && selectedKit ? (
        <KitDetailView 
          key={`${selectedKit.KitNumber}-${resetVersion}`}
          kit={selectedKit} 
          entries={entries} 
          totalKits={INITIAL_DATA.SimulatedKits.length}
          totalChecksLogged={entries.length}
          onBack={handleBackToQueue} 
          onUpdateEntry={handleUpdateEntry}
          onReset={() => handleResetKit(selectedKit.KitNumber)}
        />
      ) : view === 'data' ? (
        <DataView
          entries={entries}
          onBack={() => setView('queue')}
        />
      ) : (
        <div className="flex-1 w-full overflow-y-auto">
          <div className="max-w-5xl mx-auto px-8 md:px-10 py-8">
            <div className="mb-8 flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="pt-1">
                <h2 className="text-2xl font-bold text-gray-900">Vehicle Inspection Queue</h2>
                <p className="text-gray-500 text-sm mt-1">Select a vehicle kit below to begin or resume quality inspection.</p>
              </div>

              <div className="flex gap-8 items-center bg-white px-5 py-3 rounded-xl border border-gray-100 shadow-sm flex-shrink-0">
                <InfoBox title="Active Kits">
                   <span className="text-2xl font-bold text-gray-800">{activeKitsCount}</span>
                </InfoBox>
                <div className="w-px h-8 bg-gray-100"></div>
                <InfoBox title="Checks Logged">
                   <span className="text-2xl font-bold text-gray-800">{entries.length}</span>
                </InfoBox>
              </div>
            </div>

            <div className="mb-6">
              <Button
                type="secondary"
                size="normal"
                icon={Database}
                onClick={() => setView('data')}
              >
                View All Data
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {INITIAL_DATA.SimulatedKits.map(kit => (
                <KitCard 
                  key={kit.KitNumber} 
                  kit={kit} 
                  entries={entries} 
                  onSelect={handleSelectKit} 
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;