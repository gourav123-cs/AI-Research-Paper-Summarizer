# 📄 PaperMind AI

> Drop a research paper PDF and get an instant structured summary powered by Llama 3.3

![Built with React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logo=groq&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## ✨ What it does

PaperMind AI lets you upload any research paper PDF and instantly get a clean, structured summary — no reading through 40 pages of dense academic text.

- 📥 Upload a PDF research paper
- 🤖 AI extracts and summarises key sections (abstract, methodology, results, conclusions)
- ⚡ Powered by Llama 3.3 via Groq — blazing fast inference
- 🔑 Works in demo mode out of the box — no setup needed for visitors

---

## 🚀 Live Demo

🔗 [papermind.vercel.app](https://papermind.vercel.app)

> Try it instantly — no account or API key required in demo mode.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS |
| AI Model | Llama 3.3 via Groq API |
| Backend Proxy | Vercel Serverless Functions |
| Deployment | Vercel |

---

## 🔐 Security Architecture

This app uses a **BYOK (Bring Your Own Key)** + **proxy** hybrid:

- **Demo mode** — requests route through a Vercel serverless function (`/api/groq`) where the API key lives in Vercel's environment variables, never in the browser
- **Power user mode** — users can optionally add their own free Groq key in Settings for unlimited usage
- No API keys are ever committed to this repository

---

## 🧑‍💻 Run Locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Install dependencies
npm install

# Create your local env file
cp .env.example .env.local
# Add your Groq API key to .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080)

---

## 🌍 Deploy Your Own

1. Fork this repo
2. Import into [Vercel](https://vercel.com)
3. Add `GROQ_API_KEY` in Vercel → Settings → Environment Variables
4. Redeploy — done!

Get a free Groq API key at [console.groq.com](https://console.groq.com)

---

## 📁 Project Structure

```
├── api/
│   └── groq.js          # Vercel serverless proxy (key never hits browser)
├── public/
│   └── favicon.png
├── src/
│   ├── components/      # UI components
│   ├── pages/           # App pages
│   └── main.tsx         # Entry point
├── .env.example         # Template for required env vars
└── index.html
```

---

## 📄 License

MIT — free to use, fork, and build on.

---

Built by [Gourav](https://github.com/YOUR_USERNAME)
