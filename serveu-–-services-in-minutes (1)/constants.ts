
import { Worker, ServiceType } from './types';

export const MOCK_WORKERS: Worker[] = [
  {
    id: 'w1',
    name: 'Rahul Sharma',
    serviceType: 'Electrician',
    rating: 4.8,
    onDuty: true,
    // Fix: changed hiddenLocation from object to string to match Worker interface
    hiddenLocation: '10,15',
    avatar: 'https://picsum.photos/seed/rahul/200'
  },
  {
    id: 'w2',
    name: 'Amit Kumar',
    serviceType: 'Plumber',
    rating: 4.9,
    onDuty: true,
    // Fix: changed hiddenLocation from object to string to match Worker interface
    hiddenLocation: '45,60',
    avatar: 'https://picsum.photos/seed/amit/200'
  },
  {
    id: 'w3',
    name: 'Suresh Raina',
    serviceType: 'Cleaner',
    rating: 4.5,
    onDuty: false,
    // Fix: changed hiddenLocation from object to string to match Worker interface
    hiddenLocation: '80,20',
    avatar: 'https://picsum.photos/seed/suresh/200'
  },
  {
    id: 'w4',
    name: 'Vikram Singh',
    serviceType: 'AC Repair',
    rating: 4.7,
    onDuty: true,
    // Fix: changed hiddenLocation from object to string to match Worker interface
    hiddenLocation: '30,30',
    avatar: 'https://picsum.photos/seed/vikram/200'
  },
  {
    id: 'w5',
    name: 'Priya Verma',
    serviceType: 'Electrician',
    rating: 4.9,
    onDuty: true,
    // Fix: changed hiddenLocation from object to string to match Worker interface
    hiddenLocation: '5,5',
    avatar: 'https://picsum.photos/seed/priya/200'
  }
];

export const SERVICE_CATEGORIES: ServiceType[] = [
  'Electrician',
  'Plumber',
  'Cleaner',
  'AC Repair',
  'Carpenter'
];

export const CITY_AVG_SPEED = 20; // Units per minute for simulation
