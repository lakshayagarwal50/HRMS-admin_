import { type LucideIcon } from 'lucide-react';

export interface SummaryCardData {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  value: string;
}

export interface Notification {
  id: number;
  name: string;
  requestedBy: string;
  time: string;
  status: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
}

export interface PayrollEntry {
  month: string;
  status: 'Draft' | 'Closed';
  totalGross: number;
  totalNet: number;
}

export interface StatutoryEntry {
  month: string;
  employeePF: number;
  employerPF: number;
  pt: number;
}