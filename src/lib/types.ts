export interface Delegate {
  delegateId: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  age: number;
  entity: string;
  role?: string;
  foodPreference: string;
  delegatePack: boolean;
  checkedIn: boolean;
  checkedInAt?: string;
  contactNumber?: string;
  
  // Add-ons
  merchPack?: { purchased: boolean; size?: string; quantity: number };
  crewNeck?: { purchased: boolean; size?: string; quantity: number };
  drawstringBag?: { purchased: boolean; quantity: number };
  pouch?: { purchased: boolean; quantity: number };
  radiumWristBand?: { purchased: boolean; quantity: number };
  totalItems?: number;
}

export interface CheckInResult {
  success: boolean;
  delegate: Delegate;
  alreadyCheckedIn: boolean;
  message: string;
}

export interface DelegateStats {
  total: number;
  checkedIn: number;
  remaining: number;
  percentage: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
