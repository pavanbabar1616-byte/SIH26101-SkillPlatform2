const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Employee {
  employee_id: string;
  name: string;
  designation: string;
  department: string;
  education: string;
  experience_years: number;
  current_skills: string[];
}

export interface SkillAssessment {
  skill: string;
  required_level: string;
  current_level: string;
  has_gap: boolean;
  priority: string;
  similarity_score: number;
}

export interface Course {
  course_id: string;
  title: string;
  provider: string;
  duration_hours: number;
  skills_covered: string[];
  level: string;
  description: string;
}

export interface RecommendedCourse {
  course: Course;
  skill_gap: string;
  priority: string;
  relevance_score: number;
  why_recommended: string;
}

export interface AnalysisResult {
  employee: Employee;
  skill_assessments: SkillAssessment[];
  skill_gaps: SkillAssessment[];
  recommended_courses: RecommendedCourse[];
  summary: {
    total_skills_assessed: number;
    total_gaps: number;
    high_priority_gaps: number;
  };
}

export interface QuizQuestion {
  question: string;
  options: Record<string, string>;
  correct_answer: string;
  explanation: string;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!response.ok) throw new Error(`API error: ${response.statusText}`);
  return response.json();
}

export const api = {
  getHealth: () => request<{ status: string; ollama: any }>("/health"),
  getEmployees: () => request<Employee[]>("/api/v1/employees"),
  getEmployee: (id: string) => request<Employee>(`/api/v1/employees/${id}`),
  getCourses: () => request<Course[]>("/api/v1/courses"),
  analyzeProfile: (employeeId: string) =>
    request<AnalysisResult>("/api/v1/analyze", {
      method: "POST",
      body: JSON.stringify({ employee_id: employeeId }),
    }),
  generateQuizFromText: (text: string, numQuestions: number = 5) =>
    request<{ quiz: QuizQuestion[] }>("/api/v1/quiz/generate-text", {
      method: "POST",
      body: JSON.stringify({ text, num_questions: numQuestions }),
    }),
  generateQuizFromFile: async (file: File, numQuestions: number = 5) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(
      `${API_URL}/api/v1/quiz/generate?num_questions=${numQuestions}`,
      { method: "POST", body: formData }
    );
    if (!response.ok) throw new Error("Quiz generation failed");
    return response.json();
  },
  getOllamaStatus: () =>
    request<{ running: boolean; models: string[] }>("/api/v1/quiz/status"),
};