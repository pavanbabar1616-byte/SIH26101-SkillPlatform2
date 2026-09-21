"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { User, BarChart3, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const stats = [
  { value: "6", label: "Skill Domains", desc: "Statistical, Technical, Digital" },
  { value: "15+", label: "iGOT Courses", desc: "Personalized recommendations" },
  { value: "AI", label: "Quiz Generation", desc: "From any document" },
];

const quickActions = [
  { href: "/profile", icon: User, title: "Employee Profile", description: "Select and analyze an employee", color: "from-blue-500 to-cyan-500" },
  { href: "/gaps", icon: BarChart3, title: "Skill Gaps", description: "View identified competency gaps", color: "from-red-500 to-orange-500" },
  { href: "/courses", icon: BookOpen, title: "Courses", description: "Personalized iGOT recommendations", color: "from-purple-500 to-pink-500" },
  { href: "/quiz", icon: Sparkles, title: "Quiz Generator", description: "AI-powered MCQ generation", color: "from-emerald-500 to-teal-500" },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Welcome to SkillIntel" description="Your AI-powered learning companion" />

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass rounded-2xl p-6 hover:border-primary/50 transition-all"
          >
            <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
            <p className="font-medium text-sm">{stat.label}</p>
            <p className="text-xs text-muted-foreground">{stat.desc}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <Link href={action.href}>
                <div className="glass rounded-2xl p-6 hover:border-primary/50 transition-all group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}