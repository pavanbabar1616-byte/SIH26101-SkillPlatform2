"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Award, Lightbulb, Search, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAppStore } from "@/stores/appStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  const analysis = useAppStore((s) => s.analysis);
  const [search, setSearch] = useState("");

  if (!analysis) {
    return (
      <div>
        <PageHeader title="Recommended Courses" description="Analyze an employee first" />
        <div className="glass rounded-2xl p-12 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No recommendations yet</h3>
          <p className="text-muted-foreground mb-6">Analyze an employee profile first.</p>
          <Link href="/profile"><Button>Go to Profile</Button></Link>
        </div>
      </div>
    );
  }

  const filtered = analysis.recommended_courses.filter(
    (r) =>
      r.course.title.toLowerCase().includes(search.toLowerCase()) ||
      r.course.provider.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Recommended Courses"
        description={`${filtered.length} iGOT courses for ${analysis.employee.name}`}
      />

      <div className="glass rounded-2xl p-4 mb-6 flex items-center gap-3">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search courses or providers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-0 text-white placeholder:text-muted-foreground focus:outline-none"
          style={{ background: "transparent", border: "none", padding: 0, boxShadow: "none" }}
        />
      </div>

      <div className="space-y-4">
        {filtered.map((rec, i) => (
          <motion.div
            key={rec.course.course_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-6 hover:border-primary/50 transition-all"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{rec.course.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Award className="w-4 h-4" /> {rec.course.provider}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {rec.course.duration_hours}h</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs">
                    {rec.course.level}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold gradient-text">{Math.round(rec.relevance_score * 100)}%</div>
                <p className="text-xs text-muted-foreground">Relevance</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{rec.course.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {rec.course.skills_covered.map((s) => (
                <span key={s} className="px-2 py-1 rounded-md bg-accent text-xs">{s}</span>
              ))}
            </div>

            <div className="flex items-start gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20 mb-4">
              <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{rec.why_recommended}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() =>
                window.open(`https://igot.gov.in/`, "_blank")
              }
            >
              View on iGOT <ExternalLink className="w-3 h-3" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}