export type PhotoCategory =
  | 'Metallic Bellows'
  | 'Expansion Joints'
  | 'Exhaust & Piping'
  | 'Fabric & Custom'
  | 'Valve & Aerospace';

export interface ProductPhoto {
  id: string;
  title: string;
  category: PhotoCategory;
  url: string;
  keywords: string;
}

export const PRODUCT_PHOTOS: ProductPhoto[] = [
  {
    id: '2-inch-ss-metal-bellow',
    title: '2-Inch SS Metal Bellow',
    category: 'Metallic Bellows',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/2-Inch-SS-Metal-bellow.png',
    keywords: '2 inch 2-inch ss stainless steel metal bellow bellows',
  },
  {
    id: '3-inch-copper-bellows',
    title: '3-Inch Copper Bellows',
    category: 'Metallic Bellows',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/3-Inch-Copper-Bellows.png',
    keywords: '3 inch 3-inch copper bellows metal flexible',
  },
  {
    id: '3-inch-metal-bellows',
    title: '3-Inch Metal Bellows',
    category: 'Metallic Bellows',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/3-Inch-Metal-Bellows.png',
    keywords: '3 inch 3-inch metal bellows stainless steel',
  },
  {
    id: '30-inch-fabric-expansion-joint',
    title: '30-Inch Fabric Expansion Joint',
    category: 'Fabric & Custom',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/30-Inch-Fabric-Expansion-Joint.png',
    keywords: '30 inch 30-inch fabric expansion joint large diameter duct',
  },
  {
    id: 'actuator-bellows',
    title: 'Actuator Bellows',
    category: 'Valve & Aerospace',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/Actuator-Bellows.png',
    keywords: 'actuator bellows precision seal metal flexible',
  },
  {
    id: 'aerospace-exhaust-bellows',
    title: 'Aerospace Exhaust Bellows',
    category: 'Valve & Aerospace',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/Aerospace-Exhaust-Bellows.png',
    keywords: 'aerospace exhaust bellows high temperature aviation',
  },
  {
    id: 'copper-bellows',
    title: 'Copper Bellows',
    category: 'Metallic Bellows',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/Copper-Bellows.png',
    keywords: 'copper bellows corrugated thermal conductive',
  },
  {
    id: 'corrugated-metal-bellow',
    title: 'Corrugated Metal Bellow',
    category: 'Metallic Bellows',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/Corrugated-Metal-Bellow.png',
    keywords: 'corrugated metal bellow bellows stainless convolution',
  },
  {
    id: 'custom-fabricated-conical-transition-spool',
    title: 'Custom Fabricated Conical Transition Spool',
    category: 'Fabric & Custom',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/custom-fabricated-conical-transition-spool.png',
    keywords: 'custom fabricated conical transition spool reducer flange pipe',
  },
  {
    id: 'double-ply-metal-expansion-joint',
    title: 'Double-Ply Metal Expansion Joint',
    category: 'Expansion Joints',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/Double-Ply-Metal-Expansion-Joint.png',
    keywords: 'double ply double-ply 2-ply metal expansion joint',
  },
  {
    id: 'exhaust-bellow',
    title: 'Exhaust Bellow',
    category: 'Exhaust & Piping',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/Exhaust-Bellow.png',
    keywords: 'exhaust bellow bellows flexible connector engine',
  },
  {
    id: 'exhaust-manifold',
    title: 'Exhaust Manifold',
    category: 'Exhaust & Piping',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/Exhaust-Manifold.png',
    keywords: 'exhaust manifold stainless steel assembly piping',
  },
  {
    id: 'exhaust-pipes',
    title: 'Exhaust Pipes',
    category: 'Exhaust & Piping',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/Exhaust-Pipes.png',
    keywords: 'exhaust pipes tubing stainless steel industrial',
  },
  {
    id: 'exhaust-system',
    title: 'Exhaust System',
    category: 'Exhaust & Piping',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/Exhaust-System.png',
    keywords: 'exhaust system custom fabricated assembly bellows',
  },
  {
    id: 'fabric-expansion-joint',
    title: 'Fabric Expansion Joint',
    category: 'Fabric & Custom',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/Fabric-Expansion-Joint.png',
    keywords: 'fabric expansion joint ducting composite belt',
  },
  {
    id: 'flowserve-valve',
    title: 'Flowserve Valve',
    category: 'Valve & Aerospace',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/Flowserve-Valve.png',
    keywords: 'flowserve valve bellows seal industrial flow control',
  },
  {
    id: 'inconel-exhaust-pipes',
    title: 'Inconel Exhaust Pipes',
    category: 'Exhaust & Piping',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/Inconel-Exhaust-Pipes.png',
    keywords: 'inconel exhaust pipes high temperature alloy tubing',
  },
  {
    id: 'inconel-expansion-joint',
    title: 'Inconel Expansion Joint',
    category: 'Expansion Joints',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/Inconel-Expansion-Joint.png',
    keywords: 'inconel expansion joint superalloy high temperature bellows',
  },
  {
    id: 'metal-expansion-joint',
    title: 'Metal Expansion Joint',
    category: 'Expansion Joints',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/Metal-Expansion-Joint.png',
    keywords: 'metal expansion joint flanged metallic bellows',
  },
  {
    id: 'single-ply-expansion-joint',
    title: 'Single-Ply Expansion Joint',
    category: 'Expansion Joints',
    url: 'https://www.bellows-systems.com/wp-content/uploads/2026/11/Single-Ply-Expansion-Joint.png',
    keywords: 'single ply single-ply expansion joint metal bellows',
  },
];
