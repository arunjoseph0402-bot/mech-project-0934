import React from 'react';
import { X, Box, MousePointer, RotateCw, ZoomIn, Sliders } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">Modular Workstation CAD Guide</h2>
            <p className="text-xs text-slate-400">WebGL & Three.js 3D Workstation Visualizer</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="flex items-start space-x-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <RotateCw className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Orbit Controls</strong>
              Click and drag with left mouse button to rotate the 3D scene around the workstation.
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <ZoomIn className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Zoom & Pan</strong>
              Use your mouse scroll wheel to zoom in/out. Right-click and drag to pan the camera view.
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <MousePointer className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Click Inspection</strong>
              Click directly on any table or equipment module in 3D to open detailed CAD specifications, dimensions, and material properties.
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <Sliders className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Modular Exploded View</strong>
              Use the slider in the sidebar to physically slide the left tool storage and right PC workstations away from the central electronics bench to inspect modular connection channels.
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/30 transition-all"
          >
            Got It, Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
