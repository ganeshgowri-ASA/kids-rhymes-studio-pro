export type TTSProvider = 'browser' | 'indicf5' | 'coqui' | 'google';
export interface TTSRequest { text: string; language: string; voiceId?: string; speed?: number; }
export async function synthesizeSpeech(req: TTSRequest): Promise<Blob | null> {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(req.text);
      utterance.lang = req.language === 'hi' ? 'hi-IN' : req.language === 'te' ? 'te-IN' : 'en-US';
      utterance.rate = req.speed || 1;
      window.speechSynthesis.speak(utterance);
      resolve(null);
    });
  }
  return null;
}
