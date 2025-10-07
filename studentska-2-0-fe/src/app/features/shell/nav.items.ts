export type Role = 'student' | 'admin';

export interface NavItem {
  label: string;
  path: string; 
  icon?: string;
  roles?: Role[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Welcome', path: 'welcome', icon: 'home' },
  { label: 'Prijava ispita', path: 'prijava-ispita', icon: 'event', roles: ['student'] },
  { label: 'Uzimanje potvrde', path: 'uzimanje-potvrde', icon: 'assignment', roles: ['student'] },
  { label: 'Predmeti', path: 'predmeti-admin', icon: 'edit', roles: ['admin'] },
  { label: 'Kontakt', path: 'kontakt', icon: 'contact_mail' },
];
