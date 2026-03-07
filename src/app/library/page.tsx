"use client";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BookOpen } from "lucide-react";

const items = [
  { type: "Rhyme", title: "Twinkle Twinkle Little Star", lang: "Telugu", color: "bg-pink-100 text-pink-600" },
  { type: "Video", title: "Colors of India", lang: "Hindi", color: "bg-blue-100 text-blue-600" },
  { type: "Rhyme", title: "Baa Baa Black Sheep", lang: "English", color: "bg-pink-100 text-pink-600" },
  { type: "Game", title: "Alphabet Tracing - Level 5", lang: "Tamil", color: "bg-green-100 text-green-600" },
];

export default function LibraryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs />
      <h1 className="font-heading text-3xl font-bold text-gray-800 mb-8">My Library</h1>
      {items.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400">No items in your library yet. Start creating!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.color}`}>{item.type}</span>
                <h3 className="text-lg font-bold mt-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.lang}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
