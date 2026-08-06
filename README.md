# 🤖 AI Telegram Appointment Booking Agent & Automation Hub

> An intelligent, conversational AI Telegram Bot that automatically parses natural language appointment requests, detects calendar conflicts, and books events directly into **Google Calendar** and **Calendly**. Powered by **Google Gemini 3.6 Flash** and built with Express, React, and Tailwind CSS.

---

## 🌟 Key Features

* **🧠 Natural Language Intent & Field Extraction**:
  * Automatically extracts essential meeting parameters: `Purpose/Title`, `Date` (including relative dates like *"tomorrow"*, *"next Friday"*), `Time` (24h/12h formats), and `Duration`.
  * Powered by **Gemini 3.6 Flash** with strict structured JSON output schema validation.

* **💬 Multi-Turn AI Clarification Flow**:
  * Intelligently detects missing parameters (e.g. user specifies purpose but leaves out date/time).
  * Prompts the user specifically for missing fields before finalizing the booking.

* **⚠️ Intelligent Calendar Conflict Resolution**:
  * Cross-checks requested time slots against existing appointments in Google Calendar.
  * In case of overlap, notifies the user and dynamically suggests alternative available slots.

* **📅 Multi-Provider Support**:
  * Seamlessly connects to **Google Calendar API** and **Calendly API**.

* **⚙️ Complete n8n Workflow Automation Engine**:
  * Exportable `n8n-workflow.json` blueprint included to deploy serverless low-code workflows on n8n.

* **📄 Prompt.md Documentation**:
  * Contains system prompts, structured extraction JSON schemas, conflict prompts, and Telegram Markdown output templates.

* **🎬 Interactive Simulator & Walkthrough**:
  * Embedded live Telegram phone simulator and scenario walkthrough engine for testing single-step, multi-turn, and conflict flows.

---

## 📂 Deliverables Included in this Repository

| Deliverable | Location | Description |
| :--- | :--- | :--- |
| **Source Code** | `/src`, `/server.ts` | Full-stack Express backend & React frontend |
| **n8n Workflow Export** | [`/n8n-workflow.json`](./n8n-workflow.json) | Complete importable n8n workflow JSON with Telegram trigger & Google Calendar nodes |
| **System Prompts & Schemas** | [`/Prompt.md`](./Prompt.md) | Structured prompts, JSON response schemas, and multi-turn logic |
| **Environment Template** | [`/.env.example`](./.env.example) | Pre-configured environment variable keys for deployment |
| **GitHub CI Workflow** | [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) | GitHub Actions CI build & lint verification pipeline |

---

## 🏗️ Architecture & Technology Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Framer Motion
* **Backend**: Node.js, Express, ESBuild, TSX
* **AI Model**: Google Gemini 3.6 Flash (`@google/genai` SDK with Structured JSON Outputs)
* **Integrations**: Google Calendar API, Calendly API, Telegram Bot Webhook API
* **Workflow Automation**: n8n Workflow Engine

---

## 🚀 Quick Start Guide

### Prerequisites
* Node.js v18+ or v20+
* npm or pnpm
* Google Gemini API Key ([Get Key from Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/telegram-ai-appointment-booking-agent.git
cd telegram-ai-appointment-booking-agent
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your API credentials:
```bash
cp .env.example .env
```

Edit `.env`:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Google Gemini API Key (Required)
GEMINI_API_KEY="your-gemini-api-key"

# Optional: Real Telegram Bot API Token
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"

# Optional: Calendly API Key
CALENDLY_API_KEY="your-calendly-api-key"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the interactive application.

---

## 🤖 Setting Up Telegram Webhook Integration

To connect a live Telegram Bot:

1. Open Telegram and search for `@BotFather`.
2. Send `/newbot` and follow instructions to create your bot. Copy the generated **HTTP API Token**.
3. In the application UI, click **Bot & Calendar API Settings** and paste your token.
4. Set up your Telegram Webhook by executing:
```bash
curl -F "url=https://YOUR_APP_URL/api/telegram/webhook" https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/setWebhook
```

---

## 🔄 Importing into n8n Automation

To run this booking pipeline on an **n8n** instance:

1. Download or copy [`n8n-workflow.json`](./n8n-workflow.json).
2. Open your n8n Dashboard.
3. Click **Workflows** → **Import from File / JSON**.
4. Select `n8n-workflow.json`.
5. Attach your **Telegram Bot API Credential** and **Google Calendar OAuth2 Credential**.
6. Activate the workflow!

---

## 📑 Project Directory Structure

```
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI build check
├── src/
│   ├── components/
│   │   ├── Header.tsx            # Navigation header & tab bar
│   │   ├── TelegramSimulator.tsx # Live interactive Telegram phone chat
│   │   ├── CalendarView.tsx      # Agenda list & appointment manager
│   │   ├── N8nWorkflowView.tsx   # Interactive n8n visual diagram
│   │   ├── PromptsView.tsx       # Prompt.md viewer & copy tools
│   │   ├── DemoVideoView.tsx     # Step-by-step video scenario simulator
│   │   └── SettingsModal.tsx     # Bot token & webhook configuration modal
│   ├── data/
│   │   ├── mockData.ts           # Demo scenarios & initial appointments
│   │   └── n8nWorkflowData.ts    # Visual n8n diagram node definitions
│   ├── types.ts                  # Shared TypeScript interfaces & types
│   ├── App.tsx                   # Main React entry component
│   └── main.tsx                  # Vite React mounting point
├── server.ts                     # Express server & Gemini AI API pipeline
├── Prompt.md                     # System instructions & JSON output schemas
├── n8n-workflow.json             # Exportable n8n workflow blueprint
├── package.json                  # Scripts & npm dependencies
├── .env.example                  # Environment variables template
├── .gitignore                    # GitHub repository exclusion rules
└── LICENSE                       # MIT License
```

---

## 🧪 Verification & Build

To test and compile the production bundle:

```bash
# Run TypeScript compilation check
npm run lint

# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 📜 License

This project is open-source and available under the [MIT License](./LICENSE).
