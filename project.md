# 💬 WhatsApp Blaster (Desktop App)

A **production-ready desktop WhatsApp Automation Software** built using **Electron.js**, **React (Vite)**, **Node.js (Express)**, and **Venom Bot**, designed for efficient and safe message broadcasting, campaign management, and user monitoring — all **offline-first**.

---

## 🚀 Features

* 📱 **WhatsApp Blasting**

  * Send personalized messages to hundreds of contacts.
  * Safe throttling with BullMQ job queue.
* 👥 **Contact Management**

  * Import contacts from CSV or add manually.
* 📢 **Campaign System**

  * Create, save, and manage campaign templates locally.
* ⚙️ **Offline-First Storage**

  * Uses **SQLite** to persist data while software is running.
* 🧠 **Smart Queueing**

  * Uses **Redis + BullMQ** for stable, throttled message sending.
* 🧰 **Error Analytics**

  * Integrated with **Sentry SDK** for runtime error tracking.
* ⚡ **Real-Time UI**

  * Live campaign progress and message logs via Socket.IO or IPC.
* 💻 **Cross-Platform**

  * Runs on Windows, macOS, and Linux.

---

## 🧩 Tech Stack

| Layer               | Technology                          |
| ------------------- | ----------------------------------- |
| **Desktop Shell**   | Electron.js                         |
| **Frontend UI**     | React (Vite) + Tailwind + shadcn/ui |
| **Backend API**     | Node.js (Express)                   |
| **WhatsApp Engine** | Venom Bot                           |
| **Queue System**    | Redis + BullMQ                      |
| **Database**        | SQLite (via `better-sqlite3`)       |
| **Error Tracking**  | Sentry SDK                          |
| **Packaging**       | Electron Builder                    |

---

## 🗂 Folder Structure

```
whatsapp-blaster/
│
├── main/                        # Electron process
│   ├── main.js                  # App entry, window + backend launch
│   ├── preload.js               # IPC bridge
│   └── config.js                # Global config
│
├── backend/                     # Node.js backend + Venom
│   ├── app.js                   # Express + routes + bot start
│   ├── venom/
│   │   └── bot.js               # Venom bot setup + send message
│   ├── queue/
│   │   ├── bullmq.js            # Redis + queue setup
│   │   └── workers.js           # Message job processing
│   ├── db/
│   │   └── localStore.js        # SQLite storage (contacts, campaigns)
│   ├── routes/
│   │   ├── campaign.js
│   │   ├── contact.js
│   │   └── bot.js
│   └── utils/
│       └── sentry.js            # Sentry error tracking
│
├── frontend/                    # React (Vite) UI
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Campaigns.jsx
│   │   │   └── Settings.jsx
│   │   ├── components/
│   │   │   ├── ContactUploader.jsx
│   │   │   ├── CampaignList.jsx
│   │   │   └── QueueMonitor.jsx
│   │   └── utils/api.js
│   └── vite.config.js
│
└── package.json
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/whatsapp-blaster.git
cd whatsapp-blaster
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Redis (for BullMQ)

Make sure you have Redis installed and running locally:

```bash
redis-server
```

### 4. Run in Development

```bash
npm run dev
```

This will:

* Start the backend (Express + Venom)
* Start the frontend (Vite)
* Launch Electron automatically

### 5. Build for Production

```bash
npm run build
npm run dist
```

Creates a packaged `.exe` or `.AppImage` in the `dist/` folder.

---

## 🧠 Architecture Overview

```
React (UI)
   │
   ├── REST API (Express)
   │       │
   │       ├── SQLite (Campaigns, Contacts, Logs)
   │       └── BullMQ Queue (Redis)
   │               │
   │               └── Venom Bot (WhatsApp Web Session)
   │
Electron (Main Process)
   │
   └── Launch + Window + IPC Communication
```

---

## ⚡ Key Modules

### 🧩 Venom Bot

Handles WhatsApp login, session persistence, and message sending.

```js
await client.sendText(number, message);
```

### 🧩 BullMQ Queue

Ensures safe, controlled message sending.

```js
await blastQueue.add("blast-job", { number, message });
```

### 🧩 SQLite Database

Stores campaigns, contacts, and logs locally.

```sql
CREATE TABLE IF NOT EXISTS campaigns (
  id INTEGER PRIMARY KEY,
  name TEXT,
  message TEXT
);
```

### 🧩 Sentry SDK

Captures exceptions and performance issues.

```js
Sentry.init({ dsn: "https://yourdsn.ingest.sentry.io/xxxx" });
```

---

## 🧰 Development Tips

* Use **IPC** or **Socket.IO** for live campaign updates.
* Store temporary session data under `/data/session/`.
* Limit sending rate (`1 msg/sec`) to prevent bans.
* Use `autoUpdater` for future self-updating builds.

---

## 🧪 Future Enhancements

* ✅ Contact tagging and segmentation
* ✅ Message scheduling by time
* ✅ Import/export campaign templates
* ✅ AI-based reply system (OpenAI or Gemini SDK)
* ✅ In-app analytics dashboard

---

## 🧑‍💻 Author

**Pratham Rathore**
Full Stack Developer (Node.js | React | Django)
📧 [prathamrathore2003@gmail.com](mailto:prathamrathore2003@gmail.com)
🔗 [LinkedIn](https://www.linkedin.com/in/pratham-rathore-b151a1292) | [Portfolio](https://pratham-portfolio-delta.vercel.app/)

---

## ⚖️ License

MIT License © 2025 Pratham Rathore
