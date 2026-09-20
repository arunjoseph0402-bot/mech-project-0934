import React, { useEffect, useRef } from 'react';
import { WorkstationId, VisualMode, LightingMode, ComponentSpec } from '../types';
import { COMPONENT_SPECS } from '../data/workstationData';

declare const THREE: any;

interface ThreeCanvasProps {
  selectedWorkstation: WorkstationId;
  visualMode: VisualMode;
  lightingMode: LightingMode;
  explodedSpread: number;
  showDimensions: boolean;
  onSelectWorkstation: (id: 'central' | 'left' | 'right') => void;
  onSelectComponent: (comp: ComponentSpec | null) => void;
  cameraPresetRef: React.MutableRefObject<((preset: any) => void) | null>;
  resetCameraRef: React.MutableRefObject<(() => void) | null>;
  screenshotRef: React.MutableRefObject<(() => void) | null>;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  selectedWorkstation,
  visualMode,
  lightingMode,
  explodedSpread,
  showDimensions,
  onSelectWorkstation,
  onSelectComponent,
  cameraPresetRef,
  resetCameraRef,
  screenshotRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(lightingMode === 'cyber' ? 0x030712 : lightingMode === 'workshop' ? 0x18120b : 0x090d16);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(10, 8, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Orbit Controls
    // @ts-ignore
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go below ground
    controls.minDistance = 3;
    controls.maxDistance = 30;
    controls.target.set(0, 2, 0);

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(
      lightingMode === 'workshop' ? 0xfff4e0 : lightingMode === 'cyber' ? 0x1e1b4b : 0xffffff,
      lightingMode === 'workshop' ? 0.8 : 0.6
    );
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(
      lightingMode === 'workshop' ? 0xffedd5 : lightingMode === 'cyber' ? 0x38bdf8 : 0xffffff,
      lightingMode === 'workshop' ? 1.5 : 2.0
    );
    dirLight.position.set(12, 15, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(
      lightingMode === 'cyber' ? 0xec4899 : 0x93c5fd,
      0.8
    );
    fillLight.position.set(-12, 10, -10);
    scene.add(fillLight);

    // Ground Floor Grid
    const gridHelper = new THREE.GridHelper(30, 30, 0x4f46e5, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Floor shadow receiver
    const floorGeo = new THREE.PlaneGeometry(50, 50);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050811,
      roughness: 0.9,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // 4. Advanced PBR Materials & Procedural Textures
    const createWoodPBR = () => {
      const wCanvas = document.createElement('canvas');
      wCanvas.width = 512;
      wCanvas.height = 512;
      const wCtx = wCanvas.getContext('2d')!;

      // Base warm oak butcher block color
      wCtx.fillStyle = '#b45309';
      wCtx.fillRect(0, 0, 512, 512);

      // Butcher block vertical planks
      for (let x = 0; x < 512; x += 64) {
        wCtx.fillStyle = 'rgba(0,0,0,0.12)';
        wCtx.fillRect(x - 1, 0, 2, 512);
      }

      // Fine wood grain streaks
      wCtx.fillStyle = '#92400e';
      for (let i = 0; i < 250; i++) {
        const y = Math.random() * 512;
        const h = Math.random() * 3 + 1;
        wCtx.globalAlpha = Math.random() * 0.25 + 0.08;
        wCtx.fillRect(0, y, 512, h);
      }
      wCtx.globalAlpha = 1.0;

      const map = new THREE.CanvasTexture(wCanvas);
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.repeat.set(2, 2);

      // Bump map for wood grain texture feel
      const bCanvas = document.createElement('canvas');
      bCanvas.width = 256;
      bCanvas.height = 256;
      const bCtx = bCanvas.getContext('2d')!;
      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, 256, 256);
      bCtx.fillStyle = '#505050';
      for (let i = 0; i < 120; i++) {
        bCtx.fillRect(0, Math.random() * 256, 256, Math.random() * 2);
      }
      const bumpMap = new THREE.CanvasTexture(bCanvas);
      bumpMap.wrapS = THREE.RepeatWrapping;
      bumpMap.wrapT = THREE.RepeatWrapping;

      return { map, bumpMap };
    };

    const createPowderCoatBump = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 128, 128);
      const imgData = ctx.getImageData(0, 0, 128, 128);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const n = (Math.random() - 0.5) * 40;
        const val = Math.min(255, Math.max(0, 128 + n));
        imgData.data[i] = val;
        imgData.data[i+1] = val;
        imgData.data[i+2] = val;
      }
      ctx.putImageData(imgData, 0, 0);
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      return texture;
    };

    const createBrushedSteelBump = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = '#a0a0a0';
      for (let i = 0; i < 400; i++) {
        const y = Math.random() * 256;
        ctx.fillRect(0, y, 256, 1);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    const woodPBR = createWoodPBR();
    const powderCoatBump = createPowderCoatBump();
    const brushedSteelBump = createBrushedSteelBump();

    const getMaterial = (color: number, roughness = 0.5, metalness = 0.1, emissive = 0, type: 'standard' | 'metal' | 'wood' | 'silver' = 'standard') => {
      if (visualMode === 'wireframe') {
        return new THREE.MeshBasicMaterial({ color, wireframe: true });
      }
      if (visualMode === 'blueprint') {
        return new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
      }

      if (type === 'wood') {
        return new THREE.MeshStandardMaterial({
          map: woodPBR.map,
          bumpMap: woodPBR.bumpMap,
          bumpScale: 0.02,
          roughness: 0.35,
          metalness: 0.05,
        });
      }

      if (type === 'metal') {
        return new THREE.MeshStandardMaterial({
          color,
          roughness: 0.65,
          metalness: 0.3,
          bumpMap: powderCoatBump,
          bumpScale: 0.015,
        });
      }

      if (type === 'silver') {
        return new THREE.MeshStandardMaterial({
          color,
          roughness: 0.25,
          metalness: 0.9,
          bumpMap: brushedSteelBump,
          bumpScale: 0.005,
        });
      }

      return new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness,
        emissive,
        emissiveIntensity: emissive ? 0.5 : 0,
      });
    };

    const woodMaterial = getMaterial(0xb45309, 0.4, 0.1, 0, 'wood');
    const metalMaterial = getMaterial(0x1e293b, 0.65, 0.3, 0, 'metal'); // Matte black powder-coated MS square pipe
    const silverMaterial = getMaterial(0x94a3b8, 0.25, 0.9, 0, 'silver'); // Brushed stainless steel
    const darkScreenMat = getMaterial(0x0f172a, 0.1, 0.1, 0, 'standard');
    const glowingScreenMat = getMaterial(0x38bdf8, 0.1, 0.1, 0.3, 'standard');

    // Master group for entire workstation system
    const systemGroup = new THREE.Group();
    scene.add(systemGroup);

    // --- TABLE 1: LEFT TABLE (Components & Tool Storage) ---
    // Dimensions: 3ft wide x 2ft deep x 3ft high. X center = -4.5 - explodedSpread
    const leftGroup = new THREE.Group();
    leftGroup.userData = { id: 'left', name: 'Left Tool Storage Unit' };

    // Metal Frame (4 legs + perimeter rails)
    const legGeo = new THREE.BoxGeometry(0.1, 3, 0.1);
    const leftLeg1 = new THREE.Mesh(legGeo, metalMaterial);
    leftLeg1.position.set(-1.4, 1.5, -0.9);
    leftLeg1.castShadow = true;
    leftGroup.add(leftLeg1);

    const leftLeg2 = new THREE.Mesh(legGeo, metalMaterial);
    leftLeg2.position.set(1.4, 1.5, -0.9);
    leftLeg2.castShadow = true;
    leftGroup.add(leftLeg2);

    const leftLeg3 = new THREE.Mesh(legGeo, metalMaterial);
    leftLeg3.position.set(-1.4, 1.5, 0.9);
    leftLeg3.castShadow = true;
    leftGroup.add(leftLeg3);

    const leftLeg4 = new THREE.Mesh(legGeo, metalMaterial);
    leftLeg4.position.set(1.4, 1.5, 0.9);
    leftLeg4.castShadow = true;
    leftGroup.add(leftLeg4);

    // Frame horizontal support rails
    const railX = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.1, 0.1), metalMaterial);
    railX.position.set(0, 0.5, 0.9);
    leftGroup.add(railX);
    const railX2 = railX.clone();
    railX2.position.z = -0.9;
    leftGroup.add(railX2);

    // Wooden Side Enclosure Panels (matching technical drawing)
    const leftSidePanelGeo = new THREE.BoxGeometry(0.05, 2.8, 1.9);
    const leftSideWall = new THREE.Mesh(leftSidePanelGeo, woodMaterial);
    leftSideWall.position.set(-1.42, 1.5, 0);
    leftSideWall.castShadow = true;
    leftGroup.add(leftSideWall);

    const rightSideWall = new THREE.Mesh(leftSidePanelGeo, woodMaterial);
    rightSideWall.position.set(1.42, 1.5, 0);
    rightSideWall.castShadow = true;
    leftGroup.add(rightSideWall);

    // Left Desktop Surface (3ft wide x 2ft deep x 0.15ft thk)
    const leftDeskGeo = new THREE.BoxGeometry(3, 0.15, 2);
    const leftDesk = new THREE.Mesh(leftDeskGeo, woodMaterial);
    leftDesk.position.set(0, 3.075, 0);
    leftDesk.castShadow = true;
    leftDesk.receiveShadow = true;
    leftGroup.add(leftDesk);

    // Details for Left Table: Vertical Pegboard Backpanel with Wooden Frame + tool hooks & tools
    const pegboardBack = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2, 0.05), getMaterial(0x334155, 0.7, 0.3));
    pegboardBack.position.set(0, 4.1, -0.95);
    leftGroup.add(pegboardBack);

    // Wooden frame trim around pegboard
    const pegFrameTop = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.1, 0.08), woodMaterial);
    pegFrameTop.position.set(0, 5.1, -0.95);
    leftGroup.add(pegFrameTop);
    const pegFrameBot = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.1, 0.08), woodMaterial);
    pegFrameBot.position.set(0, 3.1, -0.95);
    leftGroup.add(pegFrameBot);

    // Tool hooks and tool mockups on pegboard
    for (let i = 0; i < 5; i++) {
      const toolHook = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2), silverMaterial);
      toolHook.rotation.x = Math.PI / 2;
      toolHook.position.set(-1 + i * 0.5, 4.3 + (i % 2) * 0.2, -0.9);
      leftGroup.add(toolHook);

      // Tool handle
      const toolHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.6), getMaterial(0xef4444, 0.5));
      toolHandle.position.set(-1 + i * 0.5, 4.0 + (i % 2) * 0.2, -0.85);
      leftGroup.add(toolHandle);
    }

    // Small parts storage drawer blocks / bins with white accent drawer front (matching technical drawing)
    const drawerBlock = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.5), woodMaterial);
    drawerBlock.position.set(-0.8, 2.37, 0.1);
    drawerBlock.castShadow = true;
    leftGroup.add(drawerBlock);

    // Miniature drawers inside bin with white front faces
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 2; c++) {
        const smallDrawer = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 1.4), getMaterial(0xf8fafc, 0.2));
        smallDrawer.position.set(-1.05 + c * 0.55, 2.05 + r * 0.38, 0.1);
        leftGroup.add(smallDrawer);
      }
    }

    // Parts Cleaner Basin (Stainless steel sink)
    const basinOuter = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 1.0), getMaterial(0x64748b, 0.2, 0.9));
    basinOuter.position.set(0.8, 3.25, 0);
    leftGroup.add(basinOuter);

    const basinInner = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.8), getMaterial(0x334155, 0.3, 0.8));
    basinInner.position.set(0.8, 3.32, 0);
    leftGroup.add(basinInner);

    // Faucet
    const faucetBase = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5), silverMaterial);
    faucetBase.position.set(0.8, 3.65, -0.4);
    leftGroup.add(faucetBase);
    const faucetSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4), silverMaterial);
    faucetSpout.rotation.x = Math.PI / 2;
    faucetSpout.position.set(0.8, 3.85, -0.2);
    leftGroup.add(faucetSpout);

    systemGroup.add(leftGroup);


    // --- TABLE 2: CENTRAL TABLE (Gadget/Electronics Workstation) ---
    // Dimensions: 6ft wide x 2ft deep x 3ft high. X center = 0
    const centralGroup = new THREE.Group();
    centralGroup.userData = { id: 'central', name: 'Central Electronics Bench' };

    // 6ft Metal Frame legs
    const cLeg1 = new THREE.Mesh(legGeo, metalMaterial);
    cLeg1.position.set(-2.8, 1.5, -0.9);
    cLeg1.castShadow = true;
    centralGroup.add(cLeg1);

    const cLeg2 = new THREE.Mesh(legGeo, metalMaterial);
    cLeg2.position.set(2.8, 1.5, -0.9);
    cLeg2.castShadow = true;
    centralGroup.add(cLeg2);

    const cLeg3 = new THREE.Mesh(legGeo, metalMaterial);
    cLeg3.position.set(-2.8, 1.5, 0.9);
    cLeg3.castShadow = true;
    centralGroup.add(cLeg3);

    const cLeg4 = new THREE.Mesh(legGeo, metalMaterial);
    cLeg4.position.set(2.8, 1.5, 0.9);
    cLeg4.castShadow = true;
    centralGroup.add(cLeg4);

    // Center rails
    const cRailX = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.1, 0.1), metalMaterial);
    cRailX.position.set(0, 0.5, 0.9);
    centralGroup.add(cRailX);
    const cRailX2 = cRailX.clone();
    cRailX2.position.z = -0.9;
    centralGroup.add(cRailX2);

    // Wooden Side Enclosure Panels for Central Bench
    const centralLeftSideWall = new THREE.Mesh(leftSidePanelGeo, woodMaterial);
    centralLeftSideWall.position.set(-2.82, 1.5, 0);
    centralLeftSideWall.castShadow = true;
    centralGroup.add(centralLeftSideWall);

    const centralRightSideWall = new THREE.Mesh(leftSidePanelGeo, woodMaterial);
    centralRightSideWall.position.set(2.82, 1.5, 0);
    centralRightSideWall.castShadow = true;
    centralGroup.add(centralRightSideWall);

    // Central Desktop Surface (6ft wide x 2ft deep x 0.15ft thk)
    const centralDeskGeo = new THREE.BoxGeometry(6, 0.15, 2);
    const centralDesk = new THREE.Mesh(centralDeskGeo, woodMaterial);
    centralDesk.position.set(0, 3.075, 0);
    centralDesk.castShadow = true;
    centralDesk.receiveShadow = true;
    centralGroup.add(centralDesk);

    // Raised Hutch / Backpanel in Solid Wood (matching technical drawing)
    const hutchPanel = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2.2, 0.1), woodMaterial);
    hutchPanel.position.set(0, 4.25, -0.95);
    hutchPanel.castShadow = true;
    centralGroup.add(hutchPanel);

    // Dual Monitors on Articulated Arms
    const monitorArm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2), silverMaterial);
    monitorArm1.position.set(-1.2, 4.2, -0.85);
    centralGroup.add(monitorArm1);

    const monitorGeo = new THREE.BoxGeometry(2.2, 1.3, 0.1);
    const monitorMesh1 = new THREE.Mesh(monitorGeo, darkScreenMat);
    monitorMesh1.position.set(-1.2, 4.3, -0.75);
    centralGroup.add(monitorMesh1);

    const screen1 = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.2), glowingScreenMat);
    screen1.position.set(-1.2, 4.3, -0.69);
    centralGroup.add(screen1);

    // Monitor 2
    const monitorArm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2), silverMaterial);
    monitorArm2.position.set(1.2, 4.2, -0.85);
    centralGroup.add(monitorArm2);

    const monitorMesh2 = new THREE.Mesh(monitorGeo, darkScreenMat);
    monitorMesh2.position.set(1.2, 4.3, -0.75);
    centralGroup.add(monitorMesh2);

    const screen2 = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.2), glowingScreenMat);
    screen2.position.set(1.2, 4.3, -0.69);
    centralGroup.add(screen2);

    // Integrated Digital Storage Oscilloscope (DSO) on left of central bench
    const scopeBase = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 1.0), getMaterial(0x334155, 0.4, 0.6));
    scopeBase.position.set(-1.8, 3.55, 0.2);
    centralGroup.add(scopeBase);

    const scopeScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.4), glowingScreenMat);
    scopeScreen.position.set(-1.8, 3.65, 0.71);
    centralGroup.add(scopeScreen);

    // Soldering Station in middle-left of central bench
    const solderBase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.8), getMaterial(0x0f172a, 0.3, 0.5));
    solderBase.position.set(-0.4, 3.35, 0.3);
    centralGroup.add(solderBase);

    const solderIronHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.6), getMaterial(0xeab308, 0.4));
    solderIronHandle.rotation.z = Math.PI / 3;
    solderIronHandle.position.set(-0.2, 3.5, 0.3);
    centralGroup.add(solderIronHandle);

    // 3D Printer Mockup on right of central bench
    const printerBase = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 1.8), getMaterial(0x1e293b, 0.5, 0.5));
    printerBase.position.set(1.6, 3.2, 0);
    centralGroup.add(printerBase);

    // Printer Gantry (4 vertical posts + top frame)
    const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8);
    const pPost1 = new THREE.Mesh(postGeo, silverMaterial);
    pPost1.position.set(0.8, 4.1, 0.8);
    centralGroup.add(pPost1);
    const pPost2 = new THREE.Mesh(postGeo, silverMaterial);
    pPost2.position.set(-0.8, 4.1, 0.8);
    centralGroup.add(pPost2);
    const pPost3 = new THREE.Mesh(postGeo, silverMaterial);
    pPost3.position.set(0.8, 4.1, -0.8);
    centralGroup.add(pPost3);
    const pPost4 = new THREE.Mesh(postGeo, silverMaterial);
    pPost4.position.set(-0.8, 4.1, -0.8);
    centralGroup.add(pPost4);

    const printBed = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 1.2), getMaterial(0x38bdf8, 0.2, 0.8, 0x38bdf8));
    printBed.position.set(1.6, 3.5, 0);
    centralGroup.add(printBed);

    // Power Strip & USB Hub inset into desktop edge with wooden trim
    const powerStrip = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.3), getMaterial(0x0f172a, 0.2, 0.9));
    powerStrip.position.set(2.2, 3.16, 0.8);
    centralGroup.add(powerStrip);

    systemGroup.add(centralGroup);


    // --- TABLE 3: RIGHT TABLE (Computer & Accessories Workstation) ---
    // Dimensions: 3ft wide x 2ft deep x 3ft high. X center = +4.5 + explodedSpread
    const rightGroup = new THREE.Group();
    rightGroup.userData = { id: 'right', name: 'Right PC Workstation' };

    // Metal Frame legs
    const rLeg1 = new THREE.Mesh(legGeo, metalMaterial);
    rLeg1.position.set(-1.4, 1.5, -0.9);
    rLeg1.castShadow = true;
    rightGroup.add(rLeg1);

    const rLeg2 = new THREE.Mesh(legGeo, metalMaterial);
    rLeg2.position.set(1.4, 1.5, -0.9);
    rLeg2.castShadow = true;
    rightGroup.add(rLeg2);

    const rLeg3 = new THREE.Mesh(legGeo, metalMaterial);
    rLeg3.position.set(-1.4, 1.5, 0.9);
    rLeg3.castShadow = true;
    rightGroup.add(rLeg3);

    const rLeg4 = new THREE.Mesh(legGeo, metalMaterial);
    rLeg4.position.set(1.4, 1.5, 0.9);
    rLeg4.castShadow = true;
    rightGroup.add(rLeg4);

    // Frame rails
    const rRailX = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.1, 0.1), metalMaterial);
    rRailX.position.set(0, 0.5, 0.9);
    rightGroup.add(rRailX);
    const rRailX2 = rRailX.clone();
    rRailX2.position.z = -0.9;
    rightGroup.add(rRailX2);

    // Wooden Side Enclosure Panels for Right Workstation
    const rightLeftSideWall = new THREE.Mesh(leftSidePanelGeo, woodMaterial);
    rightLeftSideWall.position.set(-1.42, 1.5, 0);
    rightLeftSideWall.castShadow = true;
    rightGroup.add(rightLeftSideWall);

    const rightRightSideWall = new THREE.Mesh(leftSidePanelGeo, woodMaterial);
    rightRightSideWall.position.set(1.42, 1.5, 0);
    rightRightSideWall.castShadow = true;
    rightGroup.add(rightRightSideWall);

    // Right Desktop Surface (3ft wide x 2ft deep x 0.15ft thk)
    const rightDeskGeo = new THREE.BoxGeometry(3, 0.15, 2);
    const rightDesk = new THREE.Mesh(rightDeskGeo, woodMaterial);
    rightDesk.position.set(0, 3.075, 0);
    rightDesk.castShadow = true;
    rightDesk.receiveShadow = true;
    rightGroup.add(rightDesk);

    // White Drawer Unit above PC Tower (matching technical drawing)
    const rightDrawerBox = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 1.8), woodMaterial);
    rightDrawerBox.position.set(0, 2.45, 0);
    rightDrawerBox.castShadow = true;
    rightGroup.add(rightDrawerBox);

    const whiteDrawerFace = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.42, 0.05), getMaterial(0xf8fafc, 0.2));
    whiteDrawerFace.position.set(0, 2.45, 0.91);
    rightGroup.add(whiteDrawerFace);

    const drawerHandle = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.05), silverMaterial);
    drawerHandle.position.set(0, 2.45, 0.94);
    rightGroup.add(drawerHandle);

    // Computer Tower Enclosure Underneath
    const pcTower = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.4, 1.6), getMaterial(0x0f172a, 0.3, 0.7));
    pcTower.position.set(0.6, 1.25, 0);
    pcTower.castShadow = true;
    rightGroup.add(pcTower);

    // PC Glass Side Panel with glowing internal components
    const pcGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.2), getMaterial(0x38bdf8, 0.1, 0.1, 0x38bdf8));
    pcGlass.rotation.y = Math.PI / 2;
    pcGlass.position.set(1.06, 1.25, 0);
    rightGroup.add(pcGlass);

    // Curved Desktop Monitor (Ultra-wide)
    const curvedMonitor = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.2, 0.1), darkScreenMat);
    curvedMonitor.position.set(0, 4.0, -0.4);
    rightGroup.add(curvedMonitor);

    const curvedScreen = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.1), glowingScreenMat);
    curvedScreen.position.set(0, 4.0, -0.34);
    rightGroup.add(curvedScreen);

    // Sliding Keyboard Tray
    const keyboardTray = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 0.8), woodMaterial);
    keyboardTray.position.set(0, 2.85, 0.4);
    rightGroup.add(keyboardTray);

    const keyboard = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 0.3), getMaterial(0x1e293b, 0.5));
    keyboard.position.set(0, 2.89, 0.4);
    rightGroup.add(keyboard);

    const computerMouse = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.25), getMaterial(0x1e293b, 0.5));
    computerMouse.position.set(0.8, 2.89, 0.4);
    rightGroup.add(computerMouse);

    systemGroup.add(rightGroup);


    // --- 5. Apply Exploded View Spreading & Highlighting ---
    const updatePositions = () => {
      leftGroup.position.set(-4.5 - explodedSpread, 0, 0);
      centralGroup.position.set(0, 0, 0);
      rightGroup.position.set(4.5 + explodedSpread, 0, 0);
    };
    updatePositions();

    // Highlighting selected workstation
    [leftGroup, centralGroup, rightGroup].forEach((group: any) => {
      const id = group.userData.id;
      const isSelected = selectedWorkstation === 'all' || selectedWorkstation === id;
      group.children.forEach((child: any) => {
        if (child instanceof THREE.Mesh && child.material) {
          // If not selected, make slightly translucent / dimmed
          if (!isSelected) {
            child.material.transparent = true;
            child.material.opacity = 0.3;
          } else {
            child.material.transparent = false;
            child.material.opacity = 1.0;
          }
        }
      });
    });


    // --- 6. Raycasting for Click Selection ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(systemGroup.children, true);

      if (intersects.length > 0) {
        let obj: any = intersects[0].object;
        while (obj && obj !== systemGroup && obj.parent !== systemGroup) {
          obj = obj.parent;
        }
        if (obj && obj.userData && obj.userData.id) {
          onSelectWorkstation(obj.userData.id);
          onSelectComponent(null);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);


    // --- 7. Camera Control Handlers for Sidebar ---
    cameraPresetRef.current = (preset) => {
      const targetPos = new THREE.Vector3(...preset.position);
      const targetLook = new THREE.Vector3(...preset.target);
      
      // Smooth animation
      const startPos = camera.position.clone();
      const startTarget = controls.target.clone();
      let progress = 0;

      const animateCamera = () => {
        progress += 0.05;
        if (progress <= 1) {
          camera.position.lerpVectors(startPos, targetPos, progress);
          controls.target.lerpVectors(startTarget, targetLook, progress);
          controls.update();
          requestAnimationFrame(animateCamera);
        }
      };
      animateCamera();
    };

    resetCameraRef.current = () => {
      cameraPresetRef.current?.({
        id: 'default',
        position: [10, 8, 12],
        target: [0, 2, 0]
      });
    };

    screenshotRef.current = () => {
      renderer.render(scene, camera);
      const dataURL = renderer.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'modular-workstation-cad.png';
      link.href = dataURL;
      link.click();
    };


    // --- 8. Animation Loop ---
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [visualMode, lightingMode, explodedSpread, selectedWorkstation]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* 3D Dimension Callout Overlays when enabled */}
      {showDimensions && (
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
          <div className="absolute top-[25%] left-[22%] bg-slate-900/90 border border-indigo-500/50 px-3 py-1.5 rounded-lg shadow-xl text-[11px] font-mono text-indigo-300 backdrop-blur-sm">
            ← Left Storage: 3ft W × 2ft D × 3ft H →
          </div>
          <div className="absolute top-[20%] left-[46%] bg-slate-900/90 border border-indigo-500/50 px-3 py-1.5 rounded-lg shadow-xl text-[11px] font-mono text-indigo-300 backdrop-blur-sm">
            ← Central Bench: 6ft W × 2ft D × 3ft H →
          </div>
          <div className="absolute top-[25%] right-[22%] bg-slate-900/90 border border-indigo-500/50 px-3 py-1.5 rounded-lg shadow-xl text-[11px] font-mono text-indigo-300 backdrop-blur-sm">
            ← Right PC: 3ft W × 2ft D × 3ft H →
          </div>
        </div>
      )}
    </div>
  );
};
