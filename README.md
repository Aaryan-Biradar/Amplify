<p align="center">
  <img src="client/public/amplify-logo.png" alt="Amplify Logo" width="120" />
</p>

<h1 align="center">Amplify</h1>

<p align="center">
  <strong>🧠 AI-Powered Behavioral Intelligence for Shopify</strong>
</p>

<p align="center">
  <em>Watch. Profile. Adapt. Convert.</em>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#demo">Demo</a> •
  <a href="#team">Team</a>
</p>

---

## 🎯 The Problem

E-commerce stores show the same experience to everyone. A hesitant researcher browsing for 20 minutes gets the same UI as a decisive buyer ready to checkout in 30 seconds. This one-size-fits-all approach leaves conversions on the table.

**Traditional solutions fail because:**
- A/B tests are slow and static
- Customer segments are based on historical data, not real-time behavior
- Personalization requires expensive integrations

## 💡 Our Solution

**Amplify** is a behavioral AI layer that sits on top of Shopify stores. It watches shopper behavior in real-time, builds a psychological profile, and dynamically adapts the UI to maximize conversion.

Think of it as a **"Behavioral Detective"** 🕵️ that reasons through each action:

```
[Observation] → [Deduction] → [Profile Impact]
```

---

## ✨ Features

### 🔍 Real-Time Behavioral Profiling
- Tracks product views, cart actions, checkout behavior, and hesitation signals
- Updates shopper profile with every interaction
- Scores across 5 behavioral dimensions

### 🧠 AI-Powered Reasoning
- OpenAI GPT-4o-mini analyzes each action
- "Thinks out loud" with live narration explaining its deductions
- Identifies shopper archetypes with confidence scoring

### 📊 Live Radar Visualization
- Animated radar chart showing behavioral traits
- Real-time updates as shopper behavior evolves
- Cumulative scoring (confidence only increases)

### ⚡ Dynamic UI Optimization
When the AI reaches **80% confidence** on a shopper archetype, it triggers targeted UI changes:

| Archetype | Trigger | UI Optimization |
|-----------|---------|-----------------|
| Hesitant Researcher | High research + slow checkout | Free Shipping Threshold |
| Surgical Buyer | Fast, decisive actions | Bundle/Combo Deals |
| Price Sensitive | Low cart value + hesitation | Scarcity Alerts |

### 🎙️ Live Narration Feed
The AI explains its reasoning in real-time:
> *"[06:45:23 PM EST] User exited checkout after 12s. **Hesitation detected.** Research pattern emerging — 3 products viewed, 0 purchased. Increasing hesitancy score to 45%."*

---

## 🛠️ How It Works

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Shopify Store  │────▶│  Event Stream    │────▶│  AI Detective   │
│  (Amplitude)    │     │  (liveEventBus)  │     │  (OpenAI)       │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                        ┌──────────────────┐              │
                        │  Profile Update  │◀─────────────┘
                        │  (Radar + UI)    │
                        └──────────────────┘
```

1. **Observe**: Amplitude captures user events (page views, clicks, cart actions)
2. **Analyze**: Events stream to our AI agent via the live event bus
3. **Profile**: AI builds a psychological profile with trait scores
4. **Adapt**: When confidence hits 80%, UI optimizations are triggered

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React, TypeScript |
| **Styling** | Tailwind CSS, Framer Motion |
| **AI** | OpenAI GPT-4o-mini |
| **Analytics** | Amplitude |
| **State** | React Context, Custom Event Bus |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/clam433/githappens.git
cd adaptiv/githappens/client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# .env.local
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_AMPLITUDE_API_KEY=your_amplitude_key
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront and [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the profiler dashboard.

---

## 🎬 Demo

<!-- Add your demo video/gif here -->
<!-- ![Amplify Demo](./demo.gif) -->

### Testing the AI

1. Open the **Storefront** (`/`) in one tab
2. Open the **Dashboard** (`/dashboard`) in another tab
3. Browse products, add to cart, visit checkout
4. Watch the AI narration and radar chart update in real-time
5. Trigger enough actions to reach 80% confidence and see UI adapt

---

## 📁 Project Structure

```
client/
├── app/
│   ├── api/ai/narrate/       # AI reasoning endpoint
│   ├── dashboard/            # Profiler dashboard
│   └── page.tsx              # Storefront
├── components/
│   ├── dashboard/
│   │   └── profile-scan/
│   │       ├── live-shopper-profiler.tsx   # Main radar visualization
│   │       ├── live-events-narration.tsx   # AI narration feed
│   │       └── copilot-chat.tsx            # AI chat interface
│   └── shop/                 # Storefront components
├── context/
│   └── UIOptimizationContext.tsx   # Dynamic UI state
└── lib/
    └── liveEventBus.ts       # Real-time event streaming
```

---

## 🏆 Built At

**UofTHacks 13** — January 2026


---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Made with ❤️ and ☕ at UofTHacks 13</strong>
</p>