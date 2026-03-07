"use client";

import { Music, Film, Gamepad2, BookOpen, Sparkles, TrendingUp, Users, Clock } from "lucide-react";
import FeatureCard from "@/components/shared/FeatureCard";
import AudioPlayer from "@/components/shared/AudioPlayer";
import KidsSilhouette from "@/components/shared/KidsSilhouette";
import { motion } from "framer-motion";

const features = [
  { icon: Music, title: "Rhymes Engine", description: "AI-generated lyrics in 6+ Indian languages", gradient: "from-pink-400 to-rose-400", href: "/rhymes" },
  { icon: Film, title: "Production Studio", description: "Create videos with cartoon & realistic scenes", gradient: "from-blue-400 to-cyan-400", href: "/studio" },
  { icon: Gamepad2, title: "Educational Games", description: "5 fun learning games for kids", gradient: "from-green-400 to-emerald-400", href: "/games" },
  { icon: BookOpen, title: "My Library", description: "Saved rhymes, videos, and progress", gradient: "from-purple-400 to-violet-400", href: "/library" },
];

const stats = [
  { label: "Languages", value: "7", icon: Users, color: "text-pink-500" },
  { label: "Games", value: "5", icon: Gamepad2, color: "text-blue-500" },
  { label: "AI Models", value: "4", icon: TrendingUp, color: "text-green-500" },
  { label: "Rhyme Themes", value: "10+", icon: Sparkles, color: "text-purple-500" },
];

const recentActivity = [
  { action: "Created new rhyme", detail: "Twinkle Twinkle in Telugu", time: "2 min ago", color: "bg-pink-400" },
  { action: "Generated music", detail: "Lullaby style - Hindi", time: "15 min ago", color: "bg-blue-400" },
  { action: "Played Alphabet Game", detail: "Score: 85/100", time: "1 hour ago", color: "bg-green-400" },
  { action: "Exported video", detail: "Counting Stars - Tamil", time: "3 hours ago", color: "bg-purple-400" },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-2xl p-6 md:p-8 text-white"
      >
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm mb-3 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" /> AI-Powered Kids Content Studio
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">
            Welcome to Kids Rhymes Studio!
          </h2>
          <p className="text-white/80 max-w-lg">
            Create amazing rhymes, music, videos, and educational games in Telugu, Tamil, Hindi, Bengali, Gujarati, Kannada & English.
          </p>
        </div>
        <div className="absolute right-4 bottom-0 hidden md:flex items-end gap-2 opacity-30">
          <KidsSilhouette pose="dancing" color="white" size={80} />
          <KidsSilhouette pose="singing" color="white" size={70} />
          <KidsSilhouette pose="jumping" color="white" size={75} />
        </div>
      </motion.div>

      {/* Feature Cards */}
      <section>
        <h3 className="font-heading text-lg font-bold text-gray-700 mb-4">Get Started</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {features.map((f, i) => (
            <FeatureCard key={f.href} {...f} index={i} />
          ))}
        </div>
      </section>

      {/* Stats Row */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center"
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className="font-heading text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Activity + Audio Player */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <h3 className="font-heading text-lg font-bold text-gray-700 mb-4">Recent Activity</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {recentActivity.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-4 p-4"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${item.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{item.action}</p>
                  <p className="text-xs text-gray-400 truncate">{item.detail}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-heading text-lg font-bold text-gray-700 mb-4">Now Playing</h3>
          <AudioPlayer title="Twinkle Twinkle" artist="Telugu" />
          <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Tips</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="flex items-start gap-2">
                <Sparkles className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                Select a language to generate rhymes in regional Indian languages
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                Use the Studio to combine images, music, and narration into videos
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                Try educational games to make learning fun for kids
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
