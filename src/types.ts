export type IntentType = 'book' | 'reschedule' | 'cancel' | 'query' | 'general';
export type CalendarProvider = 'google_calendar' | 'calendly' | 'mock';

export interface AppointmentEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24-hour)
  durationMinutes: number;
  startDateTime: string; // ISO String
  endDateTime: string; // ISO String
  purpose: string;
  attendeeName?: string;
  attendeeEmail?: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  provider: CalendarProvider;
  location?: string;
  notes?: string;
  calendarLink?: string;
  createdAt: string;
}

export interface ExtractionResult {
  intent: IntentType;
  purpose: string | null;
  date: string | null; // YYYY-MM-DD
  time: string | null; // HH:mm
  durationMinutes: number;
  attendeeName: string | null;
  attendeeEmail: string | null;
  isComplete: boolean;
  missingFields: ('date' | 'time' | 'purpose')[];
  botReply: string;
  hasConflict?: boolean;
  conflictingEventTitle?: string;
  suggestedSlots?: string[];
}

export interface ActionButton {
  label: string;
  action: 'confirm' | 'cancel' | 'select_slot' | 'fill_missing';
  payload?: any;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface TelegramMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  extractedDetails?: ExtractionResult;
  actionButtons?: ActionButton[];
  isPending?: boolean;
}

export interface BotSettings {
  botToken: string;
  webhookUrl: string;
  provider: CalendarProvider;
  calendarId: string;
  calendlyApiKey: string;
  autoConfirm: boolean;
  isBotActive: boolean;
  isTelegramConnected: boolean;
}

export interface DemoStep {
  sender: 'user' | 'bot';
  text: string;
  delayMs: number;
  extractedData?: Partial<ExtractionResult>;
  annotation?: string;
}

export interface DemoScenario {
  id: string;
  title: string;
  badge: string;
  description: string;
  steps: DemoStep[];
}
