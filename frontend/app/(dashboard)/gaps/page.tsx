"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Target, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAppStore } from "@/stores/appStore";
import { exportAnalysisPDF } from "@/lib/pdf";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";

export default function GapsPage() {
  const analysis = useAppStore((s) => s.analysis);

  if (!analysis) {
    return (
      <div>
        <PageHeader title="Skill Gap Analysis" description="Analyze an employee first" />
        <div className="glass rounded-2xl p-12 text-center">
          <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No analysis yet</h3>
          <p className="text-muted-foreground mb-6">Analyze an employee profile first.</p>
          <Link href="/profile"><Button>Go to Profile</Button></Link>
        </div>
      </div>
    );
  }

  const { summary, skill_gaps, skill_assessments, employee } = analysis;
  const strengths = skill_assessments.filter((a) => !a.has_gap);

  const levelMap: Record<string, number> = { None: 0, Beginner: 1, Intermediate: 2, Advanced: 3 };
  const radarData = skill_assessments.map((s) => ({
    skill: s.skill.length > 12 ? s.skill.slice(0, 12) + "..." : s.skill,
    current: levelMap[s.current_level] || 0,
    required: levelMap[s.required_level] || 0,
  }));

  return (
    <div>
      <PageHeader
        title={`Analysis for ${employee.name}`}
        description={`${employee.designation} · ${employee.department}`}
      >
        <Button variant="outline" className="gap-2" onClick={() => exportAnalysisPDF(analysis)}>
          <Download className="w-4 h-4" /> Export PDF
        </Button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { v: summary.total_skills_assessed, l: "Skills Assessed", c: "gradient-text" },
          { v: summary.total_gaps, l: "Gaps Found", c: "text-orange-400" },
          { v: summary.high_priority_gaps, l: "High Priority", c: "text-red-400" },
        ].map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 text-center"
          >
            <div className={`text-3xl font-bold ${s.c}`}>{s.v}</div>
            <p className="text-sm text-muted-foreground mt-1">{s.l}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-bold mb-4">Skill Radar</h2>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 3]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <Radar name="Current" dataKey="current" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
            <Radar name="Required" dataKey="required" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#6366f1]" />Current</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ec4899]" />Required</div>
        </div>
      </motion.div>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-400" /> Skill Gaps
      </h2>
      <div className="space-y-3 mb-8">
        {skill_gaps.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-emerald-400">🎉 No skill gaps found!</div>
        ) : (
          skill_gaps.map((gap, i) => {
            const colors: Record<string, string> = {
              High: "border-red-500/50 bg-red-500/10",
              Medium: "border-orange-500/50 bg-orange-500/10",
              Low: "border-yellow-500/50 bg-yellow-500/10",
            };
            return (
              <motion.div
                key={gap.skill}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl p-5 border-l-4 ${colors[gap.priority] || colors.Low}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{gap.skill}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Current: {gap.current_level} → Required: {gap.required_level}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                    {gap.priority}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Strengths
      </h2>
      <div className="space-y-3 mb-8">
        {strengths.map((s, i) => (
          <motion.div
            key={s.skill}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl p-5 border-l-4 border-blue-500/50 bg-blue-500/10"
          >
            <h3 className="font-semibold">{s.skill}</h3>
            <p className="text-sm text-muted-foreground mt-1">Level: {s.current_level}</p>
          </motion.div>
        ))}
      </div>

      <Link href="/courses">
        <Button size="lg">View Recommended Courses</Button>
      </Link>
    </div>
  );
}