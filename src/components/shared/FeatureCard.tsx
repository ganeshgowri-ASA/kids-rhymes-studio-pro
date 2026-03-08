"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  href: string;
  index?: number;
}

export default function FeatureCard({ icon: Icon, title, description, gradient, href, index = 0 }: FeatureCardProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="group relative glass-card rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${gradient} rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-500 group-hover:scale-150`} />

      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="font-heading text-xl font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
      <div className="mt-4 flex items-center text-sm font-medium text-pink-500 dark:text-pink-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
        Explore <span className="ml-1">&rarr;</span>
      </div>
    </motion.a>
  );
}
