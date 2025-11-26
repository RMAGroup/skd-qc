import React, { useMemo } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { KitQcEntry } from '../types';
import { calculateProgress } from '../services/qcService';
import Button from './Button';

interface DataViewProps {
  entries: KitQcEntry[];
  onBack: () => void;
}

const DataView: React.FC<DataViewProps> = ({ entries, onBack }) => {
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(entries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'QC Entries');
    XLSX.writeFile(workbook, `qc-entries-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Group entries by kit and determine completion status
  const groupedEntries = useMemo(() => {
    const kitMap = new Map<string, { entries: KitQcEntry[]; isComplete: boolean }>();
    
    entries.forEach(entry => {
      if (!kitMap.has(entry.KitNumber)) {
        kitMap.set(entry.KitNumber, { entries: [], isComplete: false });
      }
      kitMap.get(entry.KitNumber)!.entries.push(entry);
    });

    // Calculate completion for each kit
    kitMap.forEach((value, kitNumber) => {
      const progress = calculateProgress(kitNumber, entries);
      value.isComplete = progress.percentage === 100;
    });

    return kitMap;
  }, [entries]);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm py-4">
        <div className="max-w-7xl mx-auto pl-12 pr-6 md:pl-16 md:pr-10 relative">
          <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2">
            <Button
              type="ghost"
              size="normal"
              icon={ArrowLeft}
              onClick={onBack}
              className="p-2 rounded-full"
              title="Back to Queue"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">QC Entries Data</h2>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                All quality control entries in spreadsheet format
              </p>
            </div>
            <Button
              type="primary"
              size="normal"
              icon={Download}
              onClick={handleExport}
            >
              Export to Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pl-12 pr-6 md:pl-16 md:pr-10 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Kit Number</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">QC Item ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Sort Order</th>
                  <th className="px-2 py-3 text-left font-semibold text-gray-900">Appearance</th>
                  <th className="px-2 py-3 text-left font-semibold text-gray-900">Function</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => {
                  const kitData = groupedEntries.get(entry.KitNumber);
                  const isComplete = kitData?.isComplete || false;
                  const isFirstInKit = index === 0 || entries[index - 1].KitNumber !== entry.KitNumber;
                  
                  return (
                    <React.Fragment key={index}>
                      {isFirstInKit && index > 0 && (
                        <tr className="h-2">
                          <td colSpan={5}></td>
                        </tr>
                      )}
                      <tr 
                        className={`transition-colors ${
                          isComplete ? 'bg-green-50 hover:bg-green-100/50' : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        <td className={`px-4 py-3 font-medium ${isComplete ? 'text-green-900' : 'text-gray-900'}`}>
                          {entry.KitNumber}
                        </td>
                        <td className={`px-4 py-3 ${isComplete ? 'text-green-800' : 'text-gray-700'}`}>
                          {entry.QcItemId}
                        </td>
                        <td className={`px-4 py-3 ${isComplete ? 'text-green-800' : 'text-gray-700'}`}>
                          {entry.SortOrder}
                        </td>
                        <td className="px-2 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                            entry.AppearanceStatus === 'PASS' ? 'bg-green-100 text-green-800' :
                            entry.AppearanceStatus === 'FAIL' ? 'bg-red-100 text-red-800' :
                            entry.AppearanceStatus === 'N/A' ? 'bg-gray-100 text-gray-600' :
                            'bg-gray-50 text-gray-400'
                          }`}>
                            {entry.AppearanceStatus || '—'}
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                            entry.FunctionStatus === 'PASS' ? 'bg-green-100 text-green-800' :
                            entry.FunctionStatus === 'FAIL' ? 'bg-red-100 text-red-800' :
                            entry.FunctionStatus === 'N/A' ? 'bg-gray-100 text-gray-600' :
                            'bg-gray-50 text-gray-400'
                          }`}>
                            {entry.FunctionStatus || '—'}
                          </span>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataView;
