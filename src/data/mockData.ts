import { AppointmentEvent, BotSettings, DemoScenario } from '../types';

export const INITIAL_APPOINTMENTS: AppointmentEvent[] = [
  {
    id: 'evt-101',
    title: 'Dental Cleaning & Checkup',
    date: '2026-08-07',
    time: '10:00',
    durationMinutes: 45,
    startDateTime: '2026-08-07T10:00:00.000Z',
    endDateTime: '2026-08-07T10:45:00.000Z',
    purpose: 'Dental Cleaning',
    attendeeName: 'Alex Rivera',
    attendeeEmail: 'alex.rivera@example.com',
    status: 'confirmed',
    provider: 'google_calendar',
    location: 'BrightSmile Dental Clinic, Suite 300',
    notes: 'Booked via Telegram AI Agent',
    calendarLink: 'https://calendar.google.com/calendar/r/eventedit?text=Dental+Cleaning',
    createdAt: '2026-08-05T14:20:00.000Z'
  },
  {
    id: 'evt-102',
    title: 'Product Strategy Sync',
    date: '2026-08-07',
    time: '14:00',
    durationMinutes: 30,
    startDateTime: '2026-08-07T14:00:00.000Z',
    endDateTime: '2026-08-07T14:30:00.000Z',
    purpose: 'Product Strategy Review',
    attendeeName: 'Elena Rostova',
    attendeeEmail: 'elena@techcorp.io',
    status: 'confirmed',
    provider: 'google_calendar',
    location: 'Google Meet (meet.google.com/abc-defg-hij)',
    notes: 'Q3 Product Roadmap & Telegram Agent Launch',
    calendarLink: 'https://calendar.google.com/calendar/r/eventedit?text=Product+Strategy',
    createdAt: '2026-08-06T08:15:00.000Z'
  },
  {
    id: 'evt-103',
    title: 'Client Onboarding Consultation',
    date: '2026-08-08',
    time: '11:30',
    durationMinutes: 60,
    startDateTime: '2026-08-08T11:30:00.000Z',
    endDateTime: '2026-08-08T12:30:00.000Z',
    purpose: 'Onboarding Consultation',
    attendeeName: 'Marcus Vance',
    attendeeEmail: 'marcus@vancecapital.com',
    status: 'confirmed',
    provider: 'calendly',
    location: 'Calendly Video Room',
    notes: 'Integrations setup',
    calendarLink: 'https://calendly.com/events/103',
    createdAt: '2026-08-06T09:00:00.000Z'
  }
];

export const DEFAULT_BOT_SETTINGS: BotSettings = {
  botToken: '7891234567:AAH_TgBotSampleToken_XyZ9012345',
  webhookUrl: 'https://ais-dev-gfitrrmmiltzj3eapgb6u7-374207942249.asia-southeast1.run.app/api/telegram/webhook',
  provider: 'google_calendar',
  calendarId: 'primary',
  calendlyApiKey: '',
  autoConfirm: true,
  isBotActive: true,
  isTelegramConnected: true
};

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'scen-1',
    title: 'Complete Request (Single Step)',
    badge: 'Standard Flow',
    description: 'User provides date, time, and purpose in one natural language prompt.',
    steps: [
      {
        sender: 'user',
        text: 'Hi! Can you schedule a Team Sync meeting for tomorrow at 3 PM?',
        delayMs: 800,
        annotation: 'User provides Date ("tomorrow"), Time ("3 PM"), and Purpose ("Team Sync")'
      },
      {
        sender: 'bot',
        text: '✅ *Appointment Scheduled!*\n\n📅 *Date:* Tomorrow (Aug 7)\n⏰ *Time:* 3:00 PM (30 mins)\n📝 *Purpose:* Team Sync\n\nEvent added to Google Calendar! I sent you a calendar invite.',
        delayMs: 1200,
        extractedData: {
          intent: 'book',
          purpose: 'Team Sync',
          date: '2026-08-07',
          time: '15:00',
          durationMinutes: 30,
          isComplete: true,
          missingFields: []
        },
        annotation: 'Gemini parses request, checks calendar, and creates event automatically.'
      }
    ]
  },
  {
    id: 'scen-2',
    title: 'Missing Date & Time Handling',
    badge: 'Multi-turn AI Clarification',
    description: 'User specifies purpose but leaves out time. AI asks targeted questions until request is complete.',
    steps: [
      {
        sender: 'user',
        text: 'I need to book a Dentist checkup appointment please.',
        delayMs: 800,
        annotation: 'User gives Purpose ("Dentist checkup"), but no Date or Time.'
      },
      {
        sender: 'bot',
        text: 'I would be happy to help you book a *Dentist checkup*! 🦷\n\nWhich date and time would you prefer for your appointment?',
        delayMs: 1100,
        extractedData: {
          intent: 'book',
          purpose: 'Dentist checkup',
          date: null,
          time: null,
          durationMinutes: 30,
          isComplete: false,
          missingFields: ['date', 'time']
        },
        annotation: 'AI identifies missing fields (`date`, `time`) and prompts user specifically.'
      },
      {
        sender: 'user',
        text: 'How about Friday at 11 AM?',
        delayMs: 900,
        annotation: 'User provides missing Date ("Friday") and Time ("11 AM").'
      },
      {
        sender: 'bot',
        text: '✅ *Appointment Scheduled!*\n\n📅 *Date:* Friday (Aug 8)\n⏰ *Time:* 11:00 AM (30 mins)\n📝 *Purpose:* Dentist checkup\n\nYour event is verified and locked into Google Calendar!',
        delayMs: 1200,
        extractedData: {
          intent: 'book',
          purpose: 'Dentist checkup',
          date: '2026-08-08',
          time: '11:00',
          durationMinutes: 30,
          isComplete: true,
          missingFields: []
        },
        annotation: 'All fields resolved. Event successfully created.'
      }
    ]
  },
  {
    id: 'scen-3',
    title: 'Calendar Conflict Detection & Alternatives',
    badge: 'Conflict Intelligence',
    description: 'Requested slot is busy on Google Calendar. AI detects conflict and suggests alternative slots.',
    steps: [
      {
        sender: 'user',
        text: 'Book a Product Strategy review on Friday at 11:30 AM',
        delayMs: 800,
        annotation: 'Requested slot (Friday 11:30 AM) overlaps with Client Onboarding Consultation!'
      },
      {
        sender: 'bot',
        text: '⚠️ *Slot Unavailable*\n\nYou already have "*Client Onboarding Consultation*" scheduled at 11:30 AM on Friday.\n\nHere are available slots nearby:\n• 🕒 *10:00 AM* (Friday)\n• 🕒 *2:00 PM* (Friday)\n\nWhich slot works better for you?',
        delayMs: 1300,
        extractedData: {
          intent: 'book',
          purpose: 'Product Strategy review',
          date: '2026-08-08',
          time: '11:30',
          isComplete: true,
          missingFields: [],
          hasConflict: true,
          conflictingEventTitle: 'Client Onboarding Consultation',
          suggestedSlots: ['10:00 AM', '2:00 PM']
        },
        annotation: 'Conflict engine triggers, protecting user calendar from double-booking.'
      },
      {
        sender: 'user',
        text: 'Let\'s do 2:00 PM instead',
        delayMs: 700,
        annotation: 'User selects 2:00 PM alternative.'
      },
      {
        sender: 'bot',
        text: '✅ *Appointment Scheduled!*\n\n📅 *Date:* Friday (Aug 8)\n⏰ *Time:* 2:00 PM (30 mins)\n📝 *Purpose:* Product Strategy review\n\nGoogle Calendar updated successfully!',
        delayMs: 1100,
        extractedData: {
          intent: 'book',
          purpose: 'Product Strategy review',
          date: '2026-08-08',
          time: '14:00',
          durationMinutes: 30,
          isComplete: true,
          missingFields: []
        },
        annotation: 'Appointment resolved without overlap.'
      }
    ]
  }
];
