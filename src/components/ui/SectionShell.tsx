// Centered, fade-in section wrapper shared by every step. Exports SectionShell.
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionShell({
  children,
  wide = false,
  full = false,
}: {
  children: ReactNode;
  wide?: boolean;
  full?: boolean; // grid content vs. reading-width text
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`mx-auto flex min-h-screen w-full flex-col items-center justify-center px-6 py-24 text-center ${
        full ? "max-w-6xl" : wide ? "max-w-3xl" : "max-w-xl"
      }`}
    >
      {children}
    </motion.section>
  );
}
