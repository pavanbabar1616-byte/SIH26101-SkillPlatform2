"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Target, BookOpen, Sparkles, GraduationCap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Brain, title: "AI Competency Mapping", description: "Intelligent assessment of skills against role requirements" },
  { icon: Target, title: "Skill Gap Analysis", description: "Pinpoint exactly what skills need development" },
  { icon: BookOpen, title: "iGOT Course Recommendations", description: "Personalized learning paths with explanations" },
  { icon: Sparkles, title: "AI Quiz Generator", description: "Instantly generate MCQs from any document" },
  { icon: Shield, title: "Explainable AI", description: "Transparent recommendations you can trust" },
  { icon: GraduationCap, title: "Career Progression", description: "Prepare for your next role with upskilling" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-3xl animate-float" />
      </div>

      <header className="relative z-10 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold leading-tight">SkillIntel</h2>
            <p className="text-xs text-muted-foreground">SIH26101</p>
          </div>
        </div>
        <Link href="/dashboard">
          <Button className="gap-2">
            Enter Dashboard <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </header>

      <section className="relative z-10 px-8 pt-20 pb-32 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-8"
        >
          <Sparkles className="w-4 h-4" /> Built for Smart India Hackathon 2026
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="gradient-text">Skill Intelligence</span>
          <br />
          <span>for India&apos;s Statistical System</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12"
        >
          AI-powered personalized learning for government officials. Assess competencies,
          identify gaps, recommend iGOT courses, and generate quizzes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 h-12 px-8">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <section className="relative z-10 px-8 pb-32 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Everything you need to upskill
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl p-6 hover:border-primary/50 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 px-8 pb-32 max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-8 text-center">
          {[
            { v: "6", l: "Skill Domains" },
            { v: "15+", l: "iGOT Courses" },
            { v: "AI", l: "Powered" },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold gradient-text">{s.v}</div>
              <p className="text-sm text-muted-foreground mt-2">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-border px-8 py-8 text-center text-sm text-muted-foreground">
        <p>SIH26101 · Skill Intelligence Platform · Dy Patil School of Engineering, Pune</p>
      </footer>
    </div>
  );
}