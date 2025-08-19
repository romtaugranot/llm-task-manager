export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'fitness' | 'nutrition' | 'wellness' | 'personal' | 'work';
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
}

export interface UserProfile {
  name: string;
  workHours: {
    start: string;
    end: string;
  };
  priorities: string[];
  productivityTime: 'morning' | 'afternoon' | 'evening';
  goals: string[];
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark';
    weekStart: 'sunday' | 'monday';
  };
}