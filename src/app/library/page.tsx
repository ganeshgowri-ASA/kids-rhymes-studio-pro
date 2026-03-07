import Link from "next/link";

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-8">
      <Link href="/" className="text-purple-600 hover:underline mb-4 inline-block">Back to Dashboard</Link>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">My Library</h1>
      <div className="grid gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-pink-100 text-pink-600">Rhyme</span>
          <h3 className="text-lg font-bold mt-2">Twinkle Twinkle Little Star</h3>
          <p className="text-sm text-gray-500">Telugu</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-600">Video</span>
          <h3 className="text-lg font-bold mt-2">Colors of India</h3>
          <p className="text-sm text-gray-500">Hindi</p>
        </div>
      </div>
    </div>
  );
}
