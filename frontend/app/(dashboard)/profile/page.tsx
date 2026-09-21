"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles, User as UserIcon, Briefcase, GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/shared/Skeleton";
import { useEmployees } from "@/hooks/useEmployees";
import { useAnalyze } from "@/hooks/useAnalysis";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [selectedId, setSelectedId] = useState("");
  const { data: employees, isLoading, error } = useEmployees();
  const analyze = useAnalyze();
  const router = useRouter();

  const selected = employees?.find((e) => e.employee_id === selectedId);

  const handleAnalyze = async () => {
    if (!selected) return;
    try {
      await analyze.mutateAsync(selected.employee_id);
      toast.success("Analysis complete!");
      router.push("/gaps");
    } catch {
      toast.error("Analysis failed. Is the backend running?");
    }
  };

  return (
    <div>
      <PageHeader title="Employee Profile" description="Select an employee to analyze their competencies" />

      <div className="glass rounded-2xl p-6 mb-6">
        <label className="text-sm font-semibold mb-3 block text-foreground">Select Employee</label>

        {isLoading ? (
          <SkeletonCard />
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
            Failed to load employees. Make sure backend is running at http://localhost:8000
          </div>
        ) : (
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="">-- Choose an employee --</option>
            {employees?.map((emp) => (
              <option key={emp.employee_id} value={emp.employee_id}>
                {emp.name} · {emp.designation}
              </option>
            ))}
          </select>
        )}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass rounded-2xl p-8"
        >
          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {selected.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{selected.name}</h2>
              <p className="text-muted-foreground mt-1">{selected.designation} · {selected.department}</p>
              <p className="text-sm text-muted-foreground mt-1">{selected.employee_id}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Education</p>
                <p className="font-semibold">{selected.education}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-semibold">{selected.experience_years} years</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-primary" /> Current Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {selected.current_skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/40 text-indigo-200 text-sm font-medium">
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            className="w-full gap-2 h-12 text-base font-semibold"
            onClick={handleAnalyze}
            disabled={analyze.isPending}
          >
            {analyze.isPending ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing with AI...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Analyze Skills</>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}