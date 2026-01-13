
export type ServiceType = 'Electrician' | 'Plumber' | 'Cleaner' | 'AC Repair' | 'Carpenter';

export interface Location {
  x: number; 
  y: number; 
  address: string;
}

export interface Worker {
  id: string;
  name: string;
  serviceType: ServiceType;
  rating: number;
  onDuty: boolean;
  hiddenLocation: string; // Stored as "x,y" string in DB
  avatar: string;
}

export enum RequestStatus {
  SEARCHING = 'SEARCHING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  COMPLETED = 'COMPLETED'
}

export interface ServiceRequest {
  id: string;
  service_type: ServiceType;
  user_location_display: string;
  hidden_user_area: string; // Stored as "x,y"
  status: RequestStatus;
  assigned_worker_id: string | null;
  eta_minutes: number | null;
  created_at: string;
}
