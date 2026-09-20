import { ComponentSpec } from '../types';

export const WORKSTATION_SPECS: Record<'central' | 'left' | 'right', {
  title: string;
  subtitle: string;
  dimensions: string;
  frame: string;
  surface: string;
  loadCapacity: string;
  description: string;
}> = {
  central: {
    title: "Central Gadget & Electronics Workstation",
    subtitle: "Main Electronic Prototyping & R&D Bench",
    dimensions: "6 ft W x 2 ft D x 3 ft H (1829mm x 610mm x 914mm)",
    frame: "2x2 inch Black Matte Powder-Coated MS Square Pipe (14-gauge)",
    surface: "1.5-inch Thick Solid Butcher Block Hardwood (Oak with UV polyurethane finish)",
    loadCapacity: "500 lbs (226 kg) static load",
    description: "The core electronics bench equipped with an elevated hutch, dual articulated monitor arms, digital storage oscilloscope, temperature-controlled soldering station, and a high-precision 3D printer mockup."
  },
  left: {
    title: "Left Components & Tool Storage Unit",
    subtitle: "Hardware Bins, Pegboard & Parts Cleaner",
    dimensions: "3 ft W x 2 ft D x 3 ft H (914mm x 610mm x 914mm)",
    frame: "2x2 inch Black Matte Powder-Coated MS Square Pipe",
    surface: "Heavy-duty Phenolic Resin Chemical-Resistant Top",
    loadCapacity: "350 lbs (158 kg) static load",
    description: "Dedicated storage and maintenance module featuring a vertical pegboard backpanel with tool hooks, multi-tier modular parts drawer blocks, and an integrated stainless steel parts cleaner basin."
  },
  right: {
    title: "Computer & Accessories Workstation",
    subtitle: "Engineering Workstation & Computing Hub",
    dimensions: "3 ft W x 2 ft D x 3 ft H (914mm x 610mm x 914mm)",
    frame: "2x2 inch Black Matte Powder-Coated MS Square Pipe",
    surface: "1.5-inch Thick Solid Hardwood with Cable Grommets",
    loadCapacity: "350 lbs (158 kg) static load",
    description: "High-performance computing hub with an under-desk PC tower enclosure, sliding mechanical keyboard tray, curved ultra-wide CAD monitor, and integrated cable management raceways."
  }
};

export const COMPONENT_SPECS: ComponentSpec[] = [
  {
    id: 'central-desktop',
    name: 'Solid Wood Desktop Surface',
    category: 'Structure',
    workstation: 'central',
    dimensions: '72" W x 24" D x 1.5" Thk',
    material: 'American Oak Butcher Block',
    weight: '65 lbs',
    specs: { 'Finish': 'UV Resistant Matte Polyurethane', 'Edge': 'Ergonomic Bullnose Front' },
    description: 'Primary work surface with routed cable channels and built-in power/USB flush grommets.'
  },
  {
    id: 'dual-monitors',
    name: 'Dual Articulated Monitors',
    category: 'Electronics',
    workstation: 'central',
    dimensions: '27-inch 4K IPS Displays (x2)',
    material: 'Anodized Aluminum & Glass',
    weight: '24 lbs',
    specs: { 'Resolution': '3840 x 2160', 'Refresh Rate': '144Hz', 'Mount': 'Pneumatic Spring Arm' },
    description: 'Dual multi-monitor setup mounted on articulating gas-spring arms attached to the raised hutch.'
  },
  {
    id: 'oscilloscope',
    name: 'Digital Storage Oscilloscope',
    category: 'Instruments',
    workstation: 'central',
    dimensions: '14" W x 8" D x 7" H',
    material: 'ABS Composite & Glass Display',
    weight: '8.5 lbs',
    specs: { 'Bandwidth': '200 MHz', 'Channels': '4 Analog Channels', 'Sample Rate': '1 GSa/s' },
    description: 'Benchtop DSO with real-time waveform capture, FFT analysis, and dual rotary encoder knobs.'
  },
  {
    id: 'soldering-station',
    name: 'Precision Soldering Station',
    category: 'Tools',
    workstation: 'central',
    dimensions: '8" W x 6" D x 5" H',
    material: 'ESD-Safe Polymer & Silicone',
    weight: '4.2 lbs',
    specs: { 'Temp Range': '100°C - 480°C', 'Power': '120W Induction Heater', 'Tip Standoff': 'Brass Wool & Sponge' },
    description: 'Micro-processor controlled ESD-safe soldering iron with digital readout and ergonomic grip.'
  },
  {
    id: 'printer-mockup',
    name: '3D Printer Workstation',
    category: 'Fabrication',
    workstation: 'central',
    dimensions: '18" W x 18" D x 24" H',
    material: 'Aluminum Extrusion & Tempered Glass',
    weight: '28 lbs',
    specs: { 'Build Volume': '220 x 220 x 250 mm', 'Extruder': 'Direct Drive All-Metal', 'Filament': 'PLA/ABS/PETG' },
    description: 'FDM 3D printer for rapid prototyping of custom enclosures, brackets, and jigs.'
  },
  {
    id: 'power-strip',
    name: 'Integrated Power & USB Hub',
    category: 'Electrical',
    workstation: 'central',
    dimensions: '12" W x 2.5" D x 2" H',
    material: 'Anodized Aluminum',
    weight: '2.5 lbs',
    specs: { 'Outlets': '4x NEMA 5-15R', 'USB Ports': '2x USB-A, 2x USB-C PD 65W', 'Protection': 'Surge 1080 Joules' },
    description: 'Flush-mounted desktop power module with surge protection and fast USB power delivery.'
  },
  {
    id: 'pegboard',
    name: 'Vertical Pegboard Backpanel',
    category: 'Storage',
    workstation: 'left',
    dimensions: '36" W x 24" H x 1" D',
    material: 'Perforated Cold-Rolled Steel',
    weight: '15 lbs',
    specs: { 'Hole Pitch': '1-inch spacing', 'Slots': 'Universal tool hooks and magnetic strips' },
    description: 'Heavy-duty steel pegboard holding hand tools, pliers, screwdrivers, and calipers.'
  },
  {
    id: 'parts-drawers',
    name: 'Modular Parts Drawer Blocks',
    category: 'Storage',
    workstation: 'left',
    dimensions: '16" W x 12" D x 18" H',
    material: 'High-Impact Polystyrene (HIPS)',
    weight: '12 lbs',
    specs: { 'Bins': '24 Transparent Small Bins, 6 Medium Drawers', 'Labeling': 'Slot-in label tabs' },
    description: 'Stackable storage bins for electronic components, resistors, capacitors, and fasteners.'
  },
  {
    id: 'parts-cleaner',
    name: 'Parts Cleaner Basin',
    category: 'Maintenance',
    workstation: 'left',
    dimensions: '14" W x 14" D x 10" H',
    material: '304 Stainless Steel',
    weight: '14 lbs',
    specs: { 'Capacity': '3 Gallons', 'Features': 'Recirculating solvent pump, flex nozzle, drain' },
    description: 'Benchtop solvent cleaning basin for degreasing machined parts and circuit boards.'
  },
  {
    id: 'pc-tower',
    name: 'Workstation PC Enclosure',
    category: 'Computing',
    workstation: 'right',
    dimensions: '9" W x 18" D x 17" H',
    material: 'Steel Chassis & Tempered Glass',
    weight: '32 lbs',
    specs: { 'CPU': '32-Core Workstation Processor', 'GPU': 'Professional CAD/Rendering GPU', 'RAM': '128GB DDR5' },
    description: 'High-performance CAD rendering and simulation rig housed in an under-desk steel cradle.'
  },
  {
    id: 'curved-monitor',
    name: 'Curved Ultra-Wide Monitor',
    category: 'Computing',
    workstation: 'right',
    dimensions: '38" W x 10" D x 18" H',
    material: 'Matte Black Bezel & Aluminum Base',
    weight: '18 lbs',
    specs: { 'Resolution': '3840 x 1600 UWQHD+', 'Curvature': '2300R', 'Panel Type': 'IPS Nano Color' },
    description: 'Immersive ultra-wide display for multi-window CAD modeling, schematics, and coding.'
  },
  {
    id: 'keyboard-tray',
    name: 'Sliding Mechanical Keyboard Tray',
    category: 'Ergonomics',
    workstation: 'right',
    dimensions: '28" W x 12" D x 3" H',
    material: 'Steel Ball-Bearing Slides & Hardwood',
    weight: '8 lbs',
    specs: { 'Keyboard': 'Hot-swappable Mechanical', 'Mouse': 'Ergonomic Vertical Wireless' },
    description: 'Under-desk ball-bearing sliding tray housing a tactile mechanical keyboard and precision mouse.'
  }
];

export const CAMERA_PRESETS = [
  { id: 'isometric', name: 'Isometric View', position: [10, 8, 12] as [number, number, number], target: [0, 2, 0] as [number, number, number] },
  { id: 'front', name: 'Front Elevation', position: [0, 3, 11] as [number, number, number], target: [0, 2, 0] as [number, number, number] },
  { id: 'top', name: 'Top Plan View', position: [0, 14, 0.01] as [number, number, number], target: [0, 0, 0] as [number, number, number] },
  { id: 'central', name: 'Central Electronics Bench', position: [0, 4, 6] as [number, number, number], target: [0, 2, 0] as [number, number, number] },
  { id: 'left', name: 'Left Tool Storage Unit', position: [-5, 4, 6] as [number, number, number], target: [-4.5, 2, 0] as [number, number, number] },
  { id: 'right', name: 'Right PC Workstation', position: [5, 4, 6] as [number, number, number], target: [4.5, 2, 0] as [number, number, number] }
];
