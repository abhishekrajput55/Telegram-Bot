export const N8N_WORKFLOW_NODES = [
  {
    id: 'node-1',
    name: 'Telegram Trigger',
    type: 'n8n-nodes-base.telegramTrigger',
    typeLabel: 'Telegram Bot Trigger',
    icon: 'Send',
    color: 'bg-sky-500',
    description: 'Triggers workflow when a user sends a text message to Telegram Bot.',
    parameters: {
      updates: ['message'],
      parseMode: 'Markdown'
    },
    credentialsNeeded: 'Telegram Bot API Token'
  },
  {
    id: 'node-2',
    name: 'Gemini AI NLP Extractor',
    type: 'n8n-nodes-base.googleGemini',
    typeLabel: 'Google Gemini 3.6 Flash',
    icon: 'Sparkles',
    color: 'bg-indigo-600',
    description: 'Parses natural language text into structured JSON (Date, Time, Purpose, Completeness).',
    parameters: {
      model: 'gemini-3.6-flash',
      responseMimeType: 'application/json',
      systemInstruction: 'Extract appointment parameters (date, time, purpose) and check if complete.'
    },
    credentialsNeeded: 'Google Gemini API Key'
  },
  {
    id: 'node-3',
    name: 'Completeness Check',
    type: 'n8n-nodes-base.if',
    typeLabel: 'IF Condition',
    icon: 'GitBranch',
    color: 'bg-amber-500',
    description: 'Evaluates if request has all required fields (date, time, purpose).',
    parameters: {
      conditions: 'isComplete === true'
    }
  },
  {
    id: 'node-4',
    name: 'Ask Missing Details',
    type: 'n8n-nodes-base.telegram',
    typeLabel: 'Telegram Reply',
    icon: 'HelpCircle',
    color: 'bg-rose-500',
    description: 'Sends telegram message asking user for missing date, time, or purpose.',
    parameters: {
      text: '={{ $json.botReply }}'
    }
  },
  {
    id: 'node-5',
    name: 'Google Calendar / Calendly API',
    type: 'n8n-nodes-base.googleCalendar',
    typeLabel: 'Google Calendar Event Create',
    icon: 'Calendar',
    color: 'bg-emerald-600',
    description: 'Verifies slot availability and creates event in Google Calendar or Calendly.',
    parameters: {
      calendarId: 'primary',
      summary: '={{ $json.purpose }}',
      start: '={{ $json.startDateTime }}',
      end: '={{ $json.endDateTime }}'
    },
    credentialsNeeded: 'Google OAuth2 / Calendly API Key'
  },
  {
    id: 'node-6',
    name: 'Send Telegram Confirmation',
    type: 'n8n-nodes-base.telegram',
    typeLabel: 'Telegram Bot Confirmation',
    icon: 'CheckCircle2',
    color: 'bg-sky-600',
    description: 'Sends confirmation message with scheduled event details and calendar link.',
    parameters: {
      text: '✅ Appointment Scheduled! 📅 {{ $json.date }} ⏰ {{ $json.time }}'
    }
  }
];
