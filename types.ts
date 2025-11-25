
export interface VitalSign {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
  history: number[];
}

export interface HealthData {
  heartRate: VitalSign;
  bloodPressureSys: VitalSign;
  bloodPressureDia: VitalSign;
  oxygenLevel: VitalSign;
  temperature: VitalSign;
  stressLevel: VitalSign;
  hydration: VitalSign;
  energyLevel: number; // New metric for "Body Battery"
}

export interface ForecastPoint {
  time: string;
  energy: number;
  stress: number;
}

export interface SimulationAction {
  id: string;
  label: string;
  icon: any; // Lucide icon component
  color: string;
  effect: Partial<HealthData>; // What changes if this action is taken
  description: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: Date;
  type: 'Video' | 'In-Person';
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ASSISTANT = 'ASSISTANT',
  SIMULATION = 'SIMULATION'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
