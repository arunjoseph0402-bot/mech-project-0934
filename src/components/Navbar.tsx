import React from 'react';
import { Box, Camera, HelpCircle, Download, Layers, Eye, RefreshCw } from 'lucide-react';
import { VisualMode, LightingMode } from '../types';

interface NavbarProps {
  visualMode: VisualMode;
  setVisualMode: (mode: VisualMode) => void;
  lightingMode: LightingMode;
  setLightingMode: (mode: LightingMode) => void;
  showDimensions: boolean;
  setShowDimensions: (show: boolean) => void;
  onResetCamera: () => void;
  onTakeScreenshot: () => void;
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  visualMode,
  setVisualMode,
  lightingMode,
  setLightingMode,
  showDimensions,
  setShowDimensions,
  onResetCamera,
  onTakeScreenshot,
  onOpenHelp,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between text-slate-100 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20 border border-indigo-400/30">
          <Box className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-base tracking-tight text-white">Modular Workstation CAD</h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              Three.js WebGL
            </span>
          </div>
          <p className="text-xs text-slate-400">Industrial Electronics & Engineering Bench System (12ft Total)</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Visual Mode Toggle */}
        <div className="hidden md:flex items-center bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setVisualMode('solid')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              visualMode === 'solid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Solid CAD
          </button>
          <button
            onClick={() => setVisualMode('wireframe')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              visualMode === 'wireframe' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Wireframe
          </button>
          <button
            onClick={() => setVisualMode('blueprint')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              visualMode === 'blueprint' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Blueprint
          </button>
        </div>

        {/* Lighting Mode */}
        <div className="hidden lg:flex items-center bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setLightingMode('studio')}
            className={`px-2.5 py-1 text-xs rounded-md ${lightingMode === 'studio' ? 'bg-slate-800 text-indigo-300 font-semibold' : 'text-slate-400'}`}
            title="Studio Lighting"
          >
            Studio
          </button>
          <button
            onClick={() => setLightingMode('workshop')}
            className={`px-2.5 py-1 text-xs rounded-md ${lightingMode === 'workshop' ? 'bg-slate-800 text-amber-300 font-semibold' : 'text-slate-400'}`}
            title="Warm Workshop"
          >
            Workshop
          </button>
          <button
            onClick={() => setLightingMode('cyber')}
            className={`px-2.5 py-1 text-xs rounded-md ${lightingMode === 'cyber' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400'}`}
            title="Cyber Neon"
          >
            Neon
          </button>
        </div>

        {/* Toggle Dimensions */}
        <button
          onClick={() => setShowDimensions(!showDimensions)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            showDimensions
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
          title="Toggle 3D Dimension Callouts"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Dimensions</span>
        </button>

        {/* Reset Camera */}
        <button
          onClick={onResetCamera}
          className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
          title="Reset Camera View"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Screenshot */}
        <button
          onClick={onTakeScreenshot}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
          title="Download PNG Snapshot"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export CAD</span>
        </button>

        {/* Help */}
        <button
          onClick={onOpenHelp}
          className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
          title="System Instructions & Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
