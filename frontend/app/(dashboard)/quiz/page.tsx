"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { api, type QuizQuestion } from "@/lib/api";
import { toast } from "sonner";

export default function QuizPage() {
  const [tab, setTab] = useState<"text" | "file">("text");
  const [text, setText] = useState("");
  const [numQ, setNumQ] = useState(5);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setLoading(true);
      try {
        const result = await api.generateQuizFromFile(file, numQ);
        setQuiz(result.quiz);
        toast.success(`Generated ${result.quiz.length} questions!`);
      } catch {
        toast.error("Quiz generation failed");
      } finally {
        setLoading(false);
      }
    },
    [numQ]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"] },
    multiple: false,
  });

  const generateFromText = async () => {
    if (text.length < 50) {
      toast.error("Please paste at least 50 characters");
      return;
    }
    setLoading(true);
    try {
      const result = await api.generateQuizFromText(text, numQ);
      setQuiz(result.quiz);
      toast.success(`Generated ${result.quiz.length} questions!`);
    } catch {
      toast.error("Quiz generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="AI Quiz Generator" description="Upload a PDF or paste text" />

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("text")}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            tab === "text"
              ? "bg-gradient-to-r from-primary to-purple-600 text-white"
              : "bg-accent text-muted-foreground"
          }`}
        >
          Paste Text
        </button>
        <button
          onClick={() => setTab("file")}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            tab === "file"
              ? "bg-gradient-to-r from-primary to-purple-600 text-white"
              : "bg-accent text-muted-foreground"
          }`}
        >
          Upload File
        </button>
      </div>

      <div className="glass rounded-2xl p-6 mb-6">
        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block">
            Number of questions: <span className="text-primary font-bold">{numQ}</span>
          </label>
          <input
            type="range"
            min={3}
            max={10}
            value={numQ}
            onChange={(e) => setNumQ(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {tab === "text" ? (
          <>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your learning material here..."
              rows={8}
              className="w-full bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button size="lg" className="w-full gap-2" onClick={generateFromText} disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate Quiz</>
              )}
            </Button>
          </>
        ) : (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-medium mb-1">
              {isDragActive ? "Drop the file here" : "Drag & drop a PDF or click"}
            </p>
            <p className="text-sm text-muted-foreground">PDF or TXT up to 10MB</p>
          </div>
        )}
      </div>

      {loading && (
        <div className="glass rounded-2xl p-12 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">AI is generating questions...</p>
        </div>
      )}

      {quiz.length > 0 && !loading && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Generated Quiz
          </h2>
          <div className="space-y-4">
            {quiz.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-semibold mb-4">Q{i + 1}. {q.question}</h3>
                <div className="space-y-2 mb-4">
                  {Object.entries(q.options).map(([key, value]) => (
                    <div
                      key={key}
                      className={`px-4 py-3 rounded-xl border ${
                        key === q.correct_answer
                          ? "border-emerald-500/50 bg-emerald-500/10"
                          : "border-border bg-accent/30"
                      }`}
                    >
                      <span className="font-medium mr-2">{key})</span>{value}
                    </div>
                  ))}
                </div>
                <details className="text-sm text-muted-foreground">
                  <summary className="cursor-pointer font-medium text-primary">
                    Show Explanation
                  </summary>
                  <p className="mt-2">{q.explanation}</p>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}