export interface FabricDetails {
  dimA: string;
  dimB: string;
  dimC: string;
  clampBarWidth: string;
  overallBeltWidth: string;
  cornerRadius: string;
}

export interface DuctInfo {
  dimD: string;
  dimW: string;
  widthBetweenClamps: string;
  flange: string;
  ductThickness: string;
  ductMaterial: string;
}

export interface DesignInfo {
  pressure: string;
  temperature: string;
}

export interface Movements {
  axialCompression: string;
  axialExpansion: string;
  lateral: string;
}

export interface SpecFormData {
  selectedStyle: string;
  shape: 'circular' | 'rectangular';
  fabricDetails: FabricDetails;
  ductInfo: DuctInfo;
  design: DesignInfo;
  movements: Movements;
  quantity: string;
  applicationNotes: string;
  optionalFeatures: {
    accumulationPillow: boolean;
    linerBolted: boolean;
    linerWelded: boolean;
  };
}

export interface JointType {
  id: string;
  name: string;
  description: string;
  image?: string;
  technicalImage?: string;
}
