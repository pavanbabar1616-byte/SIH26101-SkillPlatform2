"use client";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { Brain, Target, BookOpen, Sparkles } from "lucide-react";

const features = [
  { icon: Brain, title: "AI Competency Mapping", desc: "Sentence Transformers assess skills against role requirements" },
  { icon: Target, title: "Skill Gap Analysis", desc: "Identifies exact gaps with priority levels" },
  { icon: BookOpen, title: "Course Recommendations", desc: "iGOT courses with explainable relevance scores" },
  { icon: Sparkles, title: "AI Quiz Generator", desc: "Ollama + Mistral generates MCQs from any document" },
];

export default function AboutPage() {
  return (
    <div>
      <PageHeader title="About This Project" description="SIH26101 · Skill Intelligence Platform" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 mb-6"
      >
        <h2 className="text-xl font-bold mb-4">Problem Statement</h2>
        <p className="text-muted-foreground mb-6">
          Develop an AI-enabled learning platform that identifies competency gaps, recommends
          personalized training through integration with the iGOT Karmayogi ecosystem, and
          generates quizzes/MCQs from uploaded learning materials.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">Ministry</p>
            <p className="font-semibold">MoSPI</p>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">Theme</p>
            <p className="font-semibold">Blockchain &amp; Cybersecurity</p>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-8"
      >
        <h2 className="text-xl font-bold mb-4">Tech Stack</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div><p className="text-sm text-muted-foreground">Frontend</p><p className="font-medium">Next.js 16, React 19, Tailwind</p></div>
          <div><p className="text-sm text-muted-foreground">Backend</p><p className="font-medium">FastAPI, Python 3.12</p></div>
          <div><p className="text-sm text-muted-foreground">AI/ML</p><p className="font-medium">Sentence Transformers, Ollama (Mistral)</p></div>
          <div><p className="text-sm text-muted-foreground">UI</p><p className="font-medium">shadcn/ui, Framer Motion, Recharts</p></div>
        </div>
      </motion.div>
    </div>
  );
}