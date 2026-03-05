export interface Delegate {
  delegateId: string;
  name: string;
  email: string;
  age: number;
  entity: string;
  foodPreference: string;
  delegatePack: boolean;
  checkedIn: boolean;
  checkedInAt?: string;
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
