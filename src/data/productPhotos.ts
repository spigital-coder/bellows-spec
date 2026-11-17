export type PhotoCategory =
  | 'All'
  | 'Metallic Bellows'
  | 'Expansion Joints'
  | 'Fabric & Rectangular'
  | 'Engine & Turbine'
  | 'Hose & Valve';

export interface ProductPhoto {
  id: string;
  title: string;
  category: Exclude<PhotoCategory, 'All'>;
  url: string;
  keywords: string;
}

export const PHOTO_CATEGORIES: PhotoCategory[] = [
  'All',
  'Metallic Bellows',
  'Expansion Joints',
  'Fabric & Rectangular',
  'Engine & Turbine',
  'Hose & Valve',
];

export const PRODUCT_PHOTOS: ProductPhoto[] = [
  {
    id: 'single-ply-bellows',
    title: 'Single-Ply Bellows',
    category: 'Metallic Bellows',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/Single-Ply-Bellows-1.jpg',
    keywords: 'single ply metallic bellows stainless steel convolution',
  },
  {
    id: 'two-ply-bellows',
    title: 'Two-Ply Bellows',
    category: 'Metallic Bellows',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/Two-Ply-Bellows-1.jpg',
    keywords: 'two ply 2-ply dual ply metallic bellows flexible',
  },
  {
    id: 'multi-ply-bellows',
    title: 'Multi-Ply Bellows',
    category: 'Metallic Bellows',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/Multi-Ply-Bellows.jpg.webp',
    keywords: 'multi ply multiply laminated metallic bellows high cycle',
  },
  {
    id: 'valve-bellows',
    title: 'Valve Bellows',
    category: 'Hose & Valve',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/Valve-Bellows-1.png.webp',
    keywords: 'valve stem seal bellows stainless steel precision',
  },
  {
    id: 'single-expansion-joint',
    title: 'Single Expansion Joint',
    category: 'Expansion Joints',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/06/Single-Expansion-Joint.jpg',
    keywords: 'single expansion joint flanged axial movement',
  },
  {
    id: 'universal-with-control-rods',
    title: 'Universal Expansion Joint with Control Rods',
    category: 'Expansion Joints',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/Universal-with-Control-Rods-1.jpg.webp',
    keywords: 'universal control rods tie rods double bellows expansion joint',
  },
  {
    id: 'universal-dual-bellows-type',
    title: 'Universal Dual Bellows Type',
    category: 'Expansion Joints',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/Universal-Dual-Bellows-Type.jpg.webp',
    keywords: 'universal dual bellows lateral axial expansion joint',
  },
  {
    id: 'universal-expansion-joints',
    title: 'Universal Expansion Joints',
    category: 'Expansion Joints',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/06/Universal-Expansion-Joints.jpg',
    keywords: 'universal expansion joints center spool dual bellows',
  },
  {
    id: 'pressure-balanced-ej',
    title: 'Pressure Balanced Expansion Joint',
    category: 'Expansion Joints',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/06/Pressure-Balanced-EJ.jpg',
    keywords: 'pressure balanced ej elbow thrust load tie rods',
  },
  {
    id: 'swing-expansion-joints',
    title: 'Swing Expansion Joints',
    category: 'Expansion Joints',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/06/Swing-Expansion-Joints.jpg',
    keywords: 'swing expansion joints angular lateral planar movement',
  },
  {
    id: 'hinged-expansion-joints',
    title: 'Hinged Expansion Joints',
    category: 'Expansion Joints',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/06/Hinged-Expansion-Joints.jpg',
    keywords: 'hinged expansion joints angular rotation single plane pin',
  },
  {
    id: 'gimbal-expansion-joints',
    title: 'Gimbal Expansion Joints',
    category: 'Expansion Joints',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/06/Gimbal-Expansion-Joints.jpg',
    keywords: 'gimbal expansion joints multi plane angular rotation',
  },
  {
    id: 'universal-gimbal-ej-3d',
    title: 'Universal Gimbal Expansion Joint (3D)',
    category: 'Expansion Joints',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/Universal-Gimbal-EJ-3D.jpg.webp',
    keywords: 'universal gimbal ej 3d cad rendering assembly',
  },
  {
    id: '8in-single-with-beveled',
    title: '8" Single Expansion Joint with Beveled Ends',
    category: 'Metallic Bellows',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/8in-Single-with-Beveled.jpg.webp',
    keywords: '8in 8 inch single beveled weld ends pipe',
  },
  {
    id: '24in-single',
    title: '24" Single Expansion Joint',
    category: 'Metallic Bellows',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/24in-Single.jpg.webp',
    keywords: '24in 24 inch large diameter single bellows joint',
  },
  {
    id: 'braided-stainless-steel-hose-connector',
    title: 'Braided Stainless Steel Hose Connector',
    category: 'Hose & Valve',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/Braided-Stainless-Steel-Hose-Connector.jpg.webp',
    keywords: 'braided stainless steel metal hose connector flexible',
  },
  {
    id: 'fabric-rectangular',
    title: 'Fabric Rectangular Expansion Joint',
    category: 'Fabric & Rectangular',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/Fabric-Rectangular.jpg.webp',
    keywords: 'fabric rectangular ducting expansion joint composite belt',
  },
  {
    id: 'high-pressure-gimbal-root-rings',
    title: 'High-Pressure Gimbal with Root Reinforcement Rings',
    category: 'Expansion Joints',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/High-Pressure-Gimbal-with-Root-Reinforcement-Rings.jpg.webp',
    keywords: 'high pressure gimbal root reinforcement rings heavy duty',
  },
  {
    id: 'high-pressure-hinged-root-rings',
    title: 'High-Pressure Hinged with Root Reinforcement Rings',
    category: 'Expansion Joints',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/High-Pressure-Hinged-with-Root-Reinforcement-Rings.jpg.webp',
    keywords: 'high pressure hinged root reinforcement rings heavy duty',
  },
  {
    id: 'rectangular-metal-camera-corner-type',
    title: 'Rectangular Metal Camera Corner Type',
    category: 'Fabric & Rectangular',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/Rectangular-Metal-Camera-Corner-Type.jpg.webp',
    keywords: 'rectangular metal camera corner type mitered duct bellows',
  },
  {
    id: '997-024-0054-b-fabric-bellows',
    title: '997-024-0054-B Fabric Bellows',
    category: 'Fabric & Rectangular',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/997-024-0054-B-Fabric-Bellows.png.webp',
    keywords: '997-024-0054-B fabric bellows custom part number',
  },
  {
    id: '997-024-0055-b-fabric-bellows',
    title: '997-024-0055-B Fabric Bellows',
    category: 'Fabric & Rectangular',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/997-024-0055-B-Fabric-Bellows.png.webp',
    keywords: '997-024-0055-B fabric bellows custom part number',
  },
  {
    id: 'caterpillar-engines',
    title: 'Caterpillar Engines Expansion Joint',
    category: 'Engine & Turbine',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/06/Caterpillar-Engines.jpg',
    keywords: 'caterpillar cat engines exhaust manifold bellows',
  },
  {
    id: 'waukesha-engines',
    title: 'Waukesha Engines Expansion Joint',
    category: 'Engine & Turbine',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/06/Waukesha-Engines.jpg',
    keywords: 'waukesha engines gas engine exhaust expansion joint',
  },
  {
    id: 'waukesha-type-2-engines',
    title: 'Waukesha Type-2 Engines Expansion Joint',
    category: 'Engine & Turbine',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/06/WaukeshaType-2-Engines.jpg',
    keywords: 'waukesha type 2 type-2 engines exhaust bellows',
  },
  {
    id: 'solar-centaur-40-ej',
    title: 'Solar Centaur 40 Expansion Joint',
    category: 'Engine & Turbine',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/07/Solar-Centaur-40-EJ.jpg',
    keywords: 'solar centaur 40 ej gas turbine exhaust joint',
  },
  {
    id: 'squared-flanged-ej',
    title: 'Squared Flanged Expansion Joint',
    category: 'Fabric & Rectangular',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/06/Squared-Flanged-EJ.jpg',
    keywords: 'squared flanged ej rectangular square bolt holes',
  },
  {
    id: 'caterpillar-ej',
    title: 'Caterpillar Expansion Joint',
    category: 'Engine & Turbine',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/06/Caterpillar-EJ.jpg',
    keywords: 'caterpillar ej cat exhaust flexible connector',
  },
  {
    id: 'solar-gas-turbine',
    title: 'Solar Gas Turbine Expansion Joint',
    category: 'Engine & Turbine',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/06/Solar-Gas-Turbine.jpg',
    keywords: 'solar gas turbine exhaust ducting expansion joint',
  },
  {
    id: '6g-825-superior-engine',
    title: '6G-825 Superior Engine Expansion Joint',
    category: 'Engine & Turbine',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/6G-825-Superior-Engine.jpg.webp',
    keywords: '6g-825 6g 825 superior engine exhaust bellows',
  },
  {
    id: '8in-cat-x-150',
    title: '8" CAT x 150 Expansion Joint',
    category: 'Engine & Turbine',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2020/05/8in-CAT-x-150.jpg.webp',
    keywords: '8in 8 inch cat caterpillar x 150 flange exhaust',
  },
];
