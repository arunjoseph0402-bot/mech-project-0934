import React, { useState } from 'react';
import { WorkstationId, ComponentSpec } from '../types';
import { WORKSTATION_SPECS, COMPONENT_SPECS, CAMERA_PRESETS } from '../data/workstationData';
import { LayoutGrid, Cpu, Wrench, Monitor, Camera, Sliders, ChevronRight, CheckCircle2, Search } from 'lucide-react';

interface SidebarProps {
  selectedWorkstation: WorkstationId;
  setSelectedWorkstation: (id: WorkstationId) => void;
  explodedSpread: number;
  setExplodedSpread: (val: number) => void;
  onSelectCameraPreset: (preset: typeof CAMERA_PRESETS[0]) => void;
  onSelectComponent: (comp: ComponentSpec) => void;
  selectedComponent: ComponentSpec | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedWorkstation,
  setSelectedWorkstation,
  explodedSpread,
  setExplodedSpread,
  onSelectCameraPreset,
  onSelectComponent,
  selectedComponent,
}) => {
  const [activeTab, setActiveTab] = useState<'workstations' | 'components' | 'views'>('workstations');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComponents = COMPONENT_SPECS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="absolute left-4 top-20 bottom-4 w-80 z-10 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-800 bg-slate-950/40 p-1.5">
        <button
          onClick={() => setActiveTab('workstations')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'workstations' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Workstations</span>
        </button>
        <button
          onClick={() => setActiveTab('components')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'components' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Inventory</span>
        </button>
        <button
          onClick={() => setActiveTab('views')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'views' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Views</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {activeTab === 'workstations' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
              Select Workstation Module
            </div>

            {/* All Workstations */}
            <div
              onClick={() => setSelectedWorkstation('all')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedWorkstation === 'all'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                  : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm">Complete 3-Table System</span>
                {selectedWorkstation === 'all' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
              </div>
              <p className="text-xs text-slate-400">Total Width: 12 ft (3.65m) | Continuous Modular Assembly</p>
            </div>

            {/* Central Table */}
            <div
              onClick={() => setSelectedWorkstation('central')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedWorkstation === 'central'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                  : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm">Central Electronics Bench</span>
                {selectedWorkstation === 'central' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
              </div>
              <p className="text-xs text-slate-400 mb-2">{WORKSTATION_SPECS.central.dimensions}</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-300">Dual Monitors</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-300">Oscilloscope</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-300">3D Printer</span>
              </div>
            </div>

            {/* Left Table */}
            <div
              onClick={() => setSelectedWorkstation('left')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedWorkstation === 'left'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                  : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm">Left Tool Storage Unit</span>
                {selectedWorkstation === 'left' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
              </div>
              <p className="text-xs text-slate-400 mb-2">{WORKSTATION_SPECS.left.dimensions}</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-300">Pegboard</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-300">Parts Drawers</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-300">Cleaner Basin</span>
              </div>
            </div>

            {/* Right Table */}
            <div
              onClick={() => setSelectedWorkstation('right')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedWorkstation === 'right'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                  : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm">Right PC Workstation</span>
                {selectedWorkstation === 'right' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
              </div>
              <p className="text-xs text-slate-400 mb-2">{WORKSTATION_SPECS.right.dimensions}</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-cyan-300">Tower Enclosure</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-cyan-300">Curved Monitor</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-cyan-300">Keyboard Tray</span>
              </div>
            </div>

            {/* Exploded View Slider */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center space-x-1">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Modular Exploded View</span>
                </span>
                <span className="text-indigo-400 font-mono">{explodedSpread.toFixed(1)} ft</span>
              </div>
              <input
                type="range"
                min="0"
                max="2.5"
                step="0.1"
                value={explodedSpread}
                onChange={(e) => setExplodedSpread(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">Slide to physically separate modular tables and inspect connection joints.</p>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              {filteredComponents.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => onSelectComponent(comp)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedComponent?.id === comp.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-white">{comp.name}</span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${
                      comp.workstation === 'central' ? 'bg-indigo-500/20 text-indigo-300' :
                      comp.workstation === 'left' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {comp.workstation}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{comp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'views' && (
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
              Preset Camera Angles
            </div>
            {CAMERA_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectCameraPreset(preset)}
                className="w-full text-left p-3 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-xs text-white group-hover:text-indigo-300 transition-colors">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    X:{preset.position[0]} Y:{preset.position[1]} Z:{preset.position[2]}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
