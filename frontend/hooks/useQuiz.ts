import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useGenerateQuizFromText() {
  return useMutation({
    mutationFn: ({ text, numQuestions }: { text: string; numQuestions: number }) =>
      api.generateQuizFromText(text, numQuestions),
  });
}

export function useGenerateQuizFromFile() {
  return useMutation({
    mutationFn: ({ file, numQuestions }: { file: File; numQuestions: number }) =>
      api.generateQuizFromFile(file, numQuestions),
  });
}