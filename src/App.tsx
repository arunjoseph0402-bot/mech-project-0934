import React, { useState, useRef } from 'react';
import { WorkstationId, VisualMode, LightingMode, ComponentSpec } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { InspectorPanel } from './components/InspectorPanel';
import { ThreeCanvas } from './components/ThreeCanvas';
import { HelpModal } from './components/HelpModal';
import { CAMERA_PRESETS } from './data/workstationData';

export default function App() {
  const [selectedWorkstation, setSelectedWorkstation] = useState<WorkstationId>('all');
  const [visualMode, setVisualMode] = useState<VisualMode>('solid');
  const [lightingMode, setLightingMode] = useState<LightingMode>('studio');
  const [explodedSpread, setExplodedSpread] = useState<number>(0);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [selectedComponent, setSelectedComponent] = useState<ComponentSpec | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  const cameraPresetRef = useRef<((preset: typeof CAMERA_PRESETS[0]) => void) | null>(null);
  const resetCameraRef = useRef<(() => void) | null>(null);
  const screenshotRef = useRef<(() => void) | null>(null);

  const handleSelectWorkstation = (id: WorkstationId) => {
    setSelectedWorkstation(id);
    setSelectedComponent(null);
  };

  const handleSelectComponent = (comp: ComponentSpec | null) => {
    setSelectedComponent(comp);
    if (comp) {
      setSelectedWorkstation(comp.workstation);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        visualMode={visualMode}
        setVisualMode={setVisualMode}
        lightingMode={lightingMode}
        setLightingMode={setLightingMode}
        showDimensions={showDimensions}
        setShowDimensions={setShowDimensions}
        onResetCamera={() => resetCameraRef.current?.()}
        onTakeScreenshot={() => screenshotRef.current?.()}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main 3D Viewport */}
      <main className="flex-1 relative w-full h-full pt-16">
        <ThreeCanvas
          selectedWorkstation={selectedWorkstation}
          visualMode={visualMode}
          lightingMode={lightingMode}
          explodedSpread={explodedSpread}
          showDimensions={showDimensions}
          onSelectWorkstation={(id) => handleSelectWorkstation(id)}
          onSelectComponent={handleSelectComponent}
          cameraPresetRef={cameraPresetRef}
          resetCameraRef={resetCameraRef}
          screenshotRef={screenshotRef}
        />

        {/* Left Sidebar (Workstations, Inventory, Camera Views) */}
        <Sidebar
          selectedWorkstation={selectedWorkstation}
          setSelectedWorkstation={handleSelectWorkstation}
          explodedSpread={explodedSpread}
          setExplodedSpread={setExplodedSpread}
          onSelectCameraPreset={(preset) => cameraPresetRef.current?.(preset)}
          onSelectComponent={handleSelectComponent}
          selectedComponent={selectedComponent}
        />

        {/* Right Inspector Panel (CAD specs & dimensions) */}
        <InspectorPanel
          selectedWorkstation={selectedWorkstation}
          selectedComponent={selectedComponent}
          onClose={() => setSelectedComponent(null)}
        />
      </main>

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
