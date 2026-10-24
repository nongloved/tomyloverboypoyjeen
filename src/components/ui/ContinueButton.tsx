// Shared "continue →" step button. Exports ContinueButton.
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function ContinueButton({
  onClick,
  children,
  className = "",
  "aria-label": ariaLabel,
}: {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={ariaLabel}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`mt-10 inline-flex items-center gap-2 rounded-full border border-rose-deep/30 bg-paper px-6 py-3 font-sans text-sm text-rose-deep shadow-sm transition-colors duration-300 hover:bg-rose-deep hover:text-paper ${className}`}
    >
      {children}
    </motion.button>
  );
}
