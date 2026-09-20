import React from 'react';
import { ComponentSpec } from '../types';
import { WORKSTATION_SPECS } from '../data/workstationData';
import { X, Info, Shield, HardHat, Ruler, Tag, Wrench } from 'lucide-react';

interface InspectorPanelProps {
  selectedWorkstation: 'all' | 'central' | 'left' | 'right';
  selectedComponent: ComponentSpec | null;
  onClose: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedWorkstation,
  selectedComponent,
  onClose,
}) => {
  const workstationSpec = selectedWorkstation !== 'all' ? WORKSTATION_SPECS[selectedWorkstation] : null;

  if (!workstationSpec && !selectedComponent) return null;

  return (
    <div className="absolute right-4 top-20 bottom-4 w-96 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              {selectedComponent ? selectedComponent.name : workstationSpec?.title}
            </h3>
            <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider">
              {selectedComponent ? `Category: ${selectedComponent.category}` : workstationSpec?.subtitle}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Details */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar text-xs">
        {selectedComponent ? (
          <>
            <div>
              <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-slate-200 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                {selectedComponent.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                  <Ruler className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-semibold">Dimensions</span>
                </div>
                <div className="font-mono text-slate-200 font-medium">{selectedComponent.dimensions}</div>
              </div>

              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold">Weight</span>
                </div>
                <div className="font-mono text-slate-200 font-medium">{selectedComponent.weight}</div>
              </div>
            </div>

            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-400 mb-2">
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold">Material Specification</span>
              </div>
              <div className="text-slate-200 font-medium">{selectedComponent.material}</div>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Technical Specs</h4>
              <div className="bg-slate-950/40 rounded-xl border border-slate-800 divide-y divide-slate-800/60 overflow-hidden">
                {Object.entries(selectedComponent.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between p-2.5">
                    <span className="text-slate-400">{key}</span>
                    <span className="font-mono text-slate-200 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : workstationSpec ? (
          <>
            <div>
              <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Overview</h4>
              <p className="text-slate-200 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                {workstationSpec.description}
              </p>
            </div>

            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                <Ruler className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold">Precise CAD Dimensions</span>
              </div>
              <div className="font-mono text-slate-200 font-medium text-sm">{workstationSpec.dimensions}</div>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                  <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold">Metal Frame Construction</span>
                </div>
                <div className="text-slate-200">{workstationSpec.frame}</div>
              </div>

              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                  <HardHat className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold">Surface Material</span>
                </div>
                <div className="text-slate-200">{workstationSpec.surface}</div>
              </div>

              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold">Static Load Capacity</span>
                </div>
                <div className="font-mono text-slate-200 font-medium">{workstationSpec.loadCapacity}</div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
