# SIH26101 · Skill Intelligence Platform

AI-Enabled Skill Intelligence and Learning Platform for India's Official Statistical System.

![Status](https://img.shields.io/badge/status-active-success)
![SIH](https://img.shields.io/badge/SIH-2026-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Problem Statement

**PS Code:** SIH26101
**Ministry:** Ministry of Statistics and Programme Implementation (MoSPI)
**Theme:** Blockchain & Cybersecurity

Develop an AI-enabled learning platform that identifies competency gaps, recommends personalized training through integration with the iGOT Karmayogi ecosystem, and generates quizzes/MCQs from uploaded learning materials.

## ✨ Features

- 🧠 **AI Competency Mapping** — Sentence Transformers assess skills against role requirements
- 🎯 **Skill Gap Analysis** — Visual radar chart showing current vs required levels
- 📚 **iGOT Course Recommendations** — Personalized with explainable relevance scores
- 🤖 **AI Quiz Generator** — Ollama + Mistral generates MCQs from PDFs or text
- 📄 **PDF Export** — Download complete analysis reports
- 🔐 **Secure Auth** — JWT-based sign up / sign in
- 🎨 **Modern UI** — Next.js 16, shadcn/ui, Framer Motion animations

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| UI | shadcn/ui, Framer Motion, Recharts, Lucide |
| Backend | FastAPI, Python 3.12 |
| AI/ML | Sentence Transformers, Ollama (Mistral 7B) |
| Auth | JWT (client-side with Zustand + localStorage) |

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- Node.js 20+
- pnpm
- Ollama with Mistral

### 1. Install Ollama

```bash
# Download from https://ollama.com
ollama pull mistral