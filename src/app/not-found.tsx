import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🎵</div>
        <h1 className="font-heading text-6xl font-bold text-pink-400 mb-2">404</h1>
        <h2 className="font-heading text-2xl font-bold text-gray-800 mb-4">
          Oops! This page went off-key!
        </h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist or has been moved. Let&apos;s get you back to the studio!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Go Home
          </Link>
          <Link
            href="/games"
            className="px-6 py-3 border-2 border-pink-200 text-pink-600 rounded-xl font-bold hover:bg-pink-50 transition-all"
          >
            Play Games
          </Link>
        </div>
      </div>
    </div>
  );
}
