// User settings/preferences
export interface UserSettings {
  userId: string;
  theme?: string;
  notifications?: boolean;
  [key: string]: any;
}

// Global tags
export interface GlobalTag {
  name: string;
  createdBy: string;
  createdAt: string;
}

// Activity logs
export interface ActivityLog {
  userId: string;
  action: string;
  timestamp: string;
  details?: Record<string, any>;
}

// Attachments
export interface Attachment {
  userId: string;
  noteId?: string;
  filename: string;
  url: string;
  uploadedAt: string;
}

// Shared notes/collaboration
export interface SharedNote {
  noteId: string;
  ownerId: string;
  sharedWith: string[];
  permissions: Record<string, 'read' | 'write' | 'admin'>;
  createdAt: string;
}

// User profiles
export interface UserProfile {
  userId: string;
  avatarUrl?: string;
  bio?: string;
  displayName?: string;
}

// Reminders
export interface Reminder {
  userId: string;
  noteId?: string;
  message: string;
  remindAt: string;
  createdAt: string;
}

// Calendar events
export interface CalendarEvent {
  userId: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  relatedNoteId?: string;
  createdAt: string;
} 