
export interface Employee {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  members: Employee[];
  icebreaker?: string;
}

export type AppTab = 'names' | 'draw' | 'groups';
