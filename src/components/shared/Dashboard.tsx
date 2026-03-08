"use client";

import { useEffect, useState, useRef } from "react";
import { Music, Film, Gamepad2, BookOpen, Sparkles, TrendingUp, Users, Clock, ChevronRight, Heart, Zap, Mail } from "lucide-react";
import FeatureCard from "@/components/shared/FeatureCard";
import AudioPlayer from "@/components/shared/AudioPlayer";
import KidsSilhouette from "@/components/shared/KidsSilhouette";
import { motion, useInView } from "framer-motion";

const features = [
  { icon: Music, title: "Rhymes Engine", description: "AI-generated lyrics in 6+ Indian languages", gradient: "from-pink-400 to-rose-400", href: "/rhymes" },
  { icon: Film, title: "Production Studio", description: "Create videos with cartoon & realistic scenes", gradient: "from-blue-400 to-cyan-400", href: "/studio" },
  { icon: Gamepad2, title: "Educational Games", description: "5 fun learning games for kids", gradient: "from-green-400 to-emerald-400", href: "/games" },
  { icon: BookOpen, title: "My Library", description: "Saved rhymes, videos, and progress", gradient: "from-purple-400 to-violet-400", href: "/library" },
];

const stats = [
  { label: "Languages", value: 7, icon: Users, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20" },
  { label: "Games", value: 5, icon: Gamepad2, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { label: "AI Models", value: 4, icon: TrendingUp, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
  { label: "Rhyme Themes", value: 10, suffix: "+", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
];

const marqueeRhymes = [
  { text: "Twinkle Twinkle Little Star", flag: "EN" },
  { text: "Machli Jal Ki Rani Hai", flag: "HI" },
  { text: "Chanda Mama Door Ke", flag: "HI" },
  { text: "Nila Nila Odi Va", flag: "TA" },
  { text: "Chandamama Raave", flag: "TE" },
  { text: "Koyal Bole Ku Ku Ku", flag: "HI" },
  { text: "Baa Baa Black Sheep", flag: "EN" },
  { text: "Aye Khuku Aye", flag: "BN" },
];

const testimonials = [
  { name: "Priya S.", role: "Parent", text: "My kids love creating rhymes in Telugu! The AI generates such creative and educational content.", avatar: "PS" },
  { name: "Rahul K.", role: "Teacher", text: "Perfect tool for multilingual classrooms. The games keep students engaged while learning.", avatar: "RK" },
  { name: "Anitha M.", role: "Content Creator", text: "The production studio is amazing. I can create professional kids videos in minutes!", avatar: "AM" },
];

const howItWorks = [
  { step: 1, title: "Choose Language", desc: "Select from 7 Indian languages", icon: Users, color: "bg-pink-500" },
  { step: 2, title: "Generate Content", desc: "AI creates rhymes, music & images", icon: Sparkles, color: "bg-blue-500" },
  { step: 3, title: "Edit & Customize", desc: "Fine-tune with our studio tools", icon: Zap, color: "bg-green-500" },
  { step: 4, title: "Share & Export", desc: "Download videos or share online", icon: Heart, color: "bg-purple-500" },
];

const recentActivity = [
  { action: "Created new rhyme", detail: "Twinkle Twinkle in Telugu", time: "2 min ago", color: "bg-pink-400" },
  { action: "Generated music", detail: "Lullaby style - Hindi", time: "15 min ago", color: "bg-blue-400" },
  { action: "Played Alphabet Game", detail: "Score: 85/100", time: "1 hour ago", color: "bg-green-400" },
  { action: "Exported video", detail: "Counting Stars - Tamil", time: "3 hours ago", color: "bg-purple-400" },
];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <div ref={ref} className="font-heading text-3xl font-bold text-gray-800 dark:text-white">{count}{suffix}</div>;
}

export default function Dashboard() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 animated-gradient opacity-90" />
        <div className="relative z-10 px-6 py-12 md:px-12 md:py-16">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 dark:bg-white/10 rounded-full text-sm mb-4 backdrop-blur-sm text-gray-700 dark:text-gray-200"
              >
                <Sparkles className="w-4 h-4 text-yellow-500" /> AI-Powered Kids Content Studio
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-heading text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white"
              >
                Welcome to{" "}
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Kids Rhymes Studio!
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 dark:text-gray-300 max-w-lg text-lg mb-6"
              >
                Create amazing rhymes, music, videos, and educational games in Telugu, Tamil, Hindi, Bengali, Gujarati, Kannada & English.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3 justify-center lg:justify-start"
              >
                <a
                  href="/rhymes"
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Start Creating
                </a>
                <a
                  href="/games"
                  className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all border border-white/50 dark:border-gray-600/50 flex items-center gap-2"
                >
                  <Gamepad2 className="w-4 h-4" /> Play Games
                </a>
              </motion.div>
            </div>

            {/* Floating silhouettes */}
            <div className="hidden lg:flex items-end gap-4 relative">
              <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                <KidsSilhouette pose="dancing" color="#ec4899" size={100} />
              </motion.div>
              <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                <KidsSilhouette pose="singing" color="#8b5cf6" size={90} />
              </motion.div>
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
                <KidsSilhouette pose="jumping" color="#3b82f6" size={95} />
              </motion.div>
              {["\u266A", "\u266B", "\u2669", "\u2605"].map((note, i) => (
                <motion.span
                  key={i}
                  className="absolute text-2xl"
                  style={{ left: `${20 + i * 60}px`, top: `${10 + i * 20}px` }}
                  animate={{ y: [0, -30, 0], opacity: [0.3, 0.7, 0.3], rotate: [0, 360] }}
                  transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                >
                  <span className={i % 2 === 0 ? "text-pink-300" : "text-purple-300"}>{note}</span>
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Marquee/Ticker */}
      <div className="overflow-hidden rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 py-3">
        <div className="marquee-track flex gap-8 whitespace-nowrap">
          {[...marqueeRhymes, ...marqueeRhymes].map((rhyme, i) => (
            <span key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="px-2 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 rounded-full text-xs font-bold">{rhyme.flag}</span>
              <span className="font-medium">{rhyme.text}</span>
              <span className="text-pink-300 dark:text-pink-500">{"\u266A"}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <section>
        <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-heading text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Get Started
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {features.map((f, i) => (
            <FeatureCard key={f.href} {...f} index={i} />
          ))}
        </div>
      </section>

      {/* Stats with Animated Counters */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="glass-card rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all cursor-default"
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section>
        <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-heading text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          How It Works
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {howItWorks.map((step, i) => (
            <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative text-center">
              <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
                <step.icon className="w-8 h-8" />
              </div>
              {i < 3 && <div className="absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-pink-300 to-purple-300 dark:from-pink-700 dark:to-purple-700 hidden md:block" />}
              <h4 className="font-heading text-lg font-bold text-gray-800 dark:text-white mb-1">
                <span className="text-pink-400 mr-1">{step.step}.</span>{step.title}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Activity + Audio Player */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <h3 className="font-heading text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
          <div className="glass-card rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-gray-700">
            {recentActivity.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 p-4 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors">
                <div className={`w-2.5 h-2.5 rounded-full ${item.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.action}</p>
                  <p className="text-xs text-gray-400 truncate">{item.detail}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                  <Clock className="w-3 h-3" />{item.time}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-heading text-xl font-bold text-gray-800 dark:text-white mb-4">Now Playing</h3>
          <AudioPlayer title="Twinkle Twinkle" artist="Telugu" />
          <div className="mt-4 glass-card rounded-2xl p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Tips</h4>
            <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <li className="flex items-start gap-2"><Sparkles className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />Select a language to generate rhymes in regional Indian languages</li>
              <li className="flex items-start gap-2"><Sparkles className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />Use the Studio to combine images, music, and narration into videos</li>
              <li className="flex items-start gap-2"><Sparkles className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />Try educational games to make learning fun for kids</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Testimonials Carousel */}
      <section>
        <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-heading text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          What Parents & Teachers Say
        </motion.h3>
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
            {testimonials.map((t, i) => (
              <div key={i} className="min-w-full px-4">
                <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">{t.avatar}</div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                  <p className="font-bold text-gray-800 dark:text-white">{t.name}</p>
                  <p className="text-sm text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setCurrentTestimonial(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentTestimonial ? "bg-pink-500 w-6" : "bg-gray-300 dark:bg-gray-600"}`} aria-label={`Go to testimonial ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 pt-8 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <KidsSilhouette pose="dancing" color="#ec4899" size={28} />
              <span className="font-heading text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Kids Rhymes Studio</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered platform for creating educational kids content in multiple Indian languages.</p>
          </div>
          <div>
            <h4 className="font-heading font-bold text-gray-800 dark:text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="/rhymes" className="hover:text-pink-500 transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" /> Rhymes Engine</a></li>
              <li><a href="/studio" className="hover:text-pink-500 transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" /> Production Studio</a></li>
              <li><a href="/games" className="hover:text-pink-500 transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" /> Educational Games</a></li>
              <li><a href="/library" className="hover:text-pink-500 transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" /> My Library</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-gray-800 dark:text-white mb-3">Newsletter</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Stay updated with new features and content.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="your@email.com" className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 text-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-300 dark:text-white" aria-label="Email for newsletter" />
              <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all" aria-label="Subscribe to newsletter">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-4">
          <p>Kids Rhymes Studio Pro &copy; {new Date().getFullYear()}. Made with <Heart className="w-3 h-3 inline text-pink-400" /> for kids everywhere.</p>
        </div>
      </footer>
    </div>
  );
}
