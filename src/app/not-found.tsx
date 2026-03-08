"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import KidsSilhouette from "@/components/shared/KidsSilhouette";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* Animated character */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6 flex justify-center gap-4"
        >
          <KidsSilhouette pose="jumping" color="#ec4899" size={80} />
          <motion.span
            className="text-6xl"
            animate={{ rotate: [0, 20, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {"\uD83C\uDFB5"}
          </motion.span>
          <KidsSilhouette pose="dancing" color="#8b5cf6" size={80} />
        </motion.div>

        <motion.h1
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="font-heading text-8xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-heading text-2xl font-bold text-gray-800 dark:text-white mb-4"
        >
          Oops! This page went off-key!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 dark:text-gray-400 mb-8"
        >
          The page you are looking for does not exist or has been moved. Let&apos;s get you back to the studio!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
          >
            Go Home
          </Link>
          <Link
            href="/games"
            className="px-6 py-3 border-2 border-pink-200 dark:border-pink-700 text-pink-600 dark:text-pink-400 rounded-xl font-bold hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all"
          >
            Play Games
          </Link>
        </motion.div>

        {/* Floating notes */}
        <div className="relative mt-8 h-16" aria-hidden="true">
          {["\u266A", "\u266B", "\u2669", "\u2605", "\u2764"].map((note, i) => (
            <motion.span
              key={i}
              className="absolute text-xl"
              style={{ left: `${15 + i * 18}%` }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 2.5 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            >
              <span className={i % 2 === 0 ? "text-pink-300" : "text-purple-300"}>{note}</span>
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
