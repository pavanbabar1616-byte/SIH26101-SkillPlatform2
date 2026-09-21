import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { AnalysisResult } from "./api";

export function exportAnalysisPDF(analysis: AnalysisResult) {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setTextColor(99, 102, 241);
  doc.text("Skill Analysis Report", 14, 22);

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("Employee Details", 14, 44);

  autoTable(doc, {
    startY: 50,
    head: [["Field", "Value"]],
    body: [
      ["Name", analysis.employee.name],
      ["Employee ID", analysis.employee.employee_id],
      ["Designation", analysis.employee.designation],
      ["Department", analysis.employee.department],
      ["Education", analysis.employee.education],
      ["Experience", `${analysis.employee.experience_years} years`],
    ],
    theme: "striped",
    headStyles: { fillColor: [99, 102, 241] },
  });

  const afterEmployee = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(14);
  doc.text("Summary", 14, afterEmployee);

  autoTable(doc, {
    startY: afterEmployee + 6,
    head: [["Metric", "Value"]],
    body: [
      ["Skills Assessed", analysis.summary.total_skills_assessed],
      ["Skill Gaps Found", analysis.summary.total_gaps],
      ["High Priority Gaps", analysis.summary.high_priority_gaps],
    ],
    theme: "striped",
    headStyles: { fillColor: [99, 102, 241] },
  });

  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(239, 68, 68);
  doc.text("Skill Gaps", 14, 20);

  autoTable(doc, {
    startY: 26,
    head: [["Skill", "Current", "Required", "Priority"]],
    body: analysis.skill_gaps.map((g) => [
      g.skill,
      g.current_level,
      g.required_level,
      g.priority,
    ]),
    theme: "striped",
    headStyles: { fillColor: [239, 68, 68] },
  });

  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(34, 197, 94);
  doc.text("Recommended Courses", 14, 20);

  autoTable(doc, {
    startY: 26,
    head: [["Course", "Provider", "Hours", "Relevance"]],
    body: analysis.recommended_courses.map((r) => [
      r.course.title,
      r.course.provider,
      `${r.course.duration_hours}h`,
      `${Math.round(r.relevance_score * 100)}%`,
    ]),
    theme: "striped",
    headStyles: { fillColor: [34, 197, 94] },
  });

  doc.save(`skill-report-${analysis.employee.name.replace(/\s/g, "-")}.pdf`);
}