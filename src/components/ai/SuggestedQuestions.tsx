"use client";

import { motion } from "framer-motion";
import { suggestedQuestions } from "@/data/suggested-questions";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function SuggestedQuestions({
  onSelect,
  disabled,
}: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestedQuestions.map((q, i) => (
        <motion.button
          key={q.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.2 }}
          onClick={() => onSelect(q.question)}
          disabled={disabled}
          className="px-3 py-1.5 text-xs rounded-full border border-white/10 
                     bg-white/[0.03] text-white/70 hover:bg-white/[0.08] 
                     hover:text-white hover:border-primary/30 
                     transition-colors duration-200 disabled:opacity-40 
                     disabled:cursor-not-allowed"
          aria-label={`Ask: ${q.question}`}
        >
          {q.question}
        </motion.button>
      ))}
    </div>
  );
}
