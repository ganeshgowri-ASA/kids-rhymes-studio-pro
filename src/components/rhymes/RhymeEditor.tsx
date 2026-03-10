'use client';

import { useRef, useMemo } from 'react';

interface RhymeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export default function RhymeEditor({ value, onChange, readOnly = false }: RhymeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lineCount = useMemo(() => {
    const lines = value.split('\n');
    return Math.max(lines.length, 8);
  }, [value]);

  return (
    <div className="rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="flex bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-100 dark:border-gray-700">
        <span className="text-xs font-medium text-gray-500">
          {value.split('\n').filter(Boolean).length} lines
        </span>
        <span className="text-xs text-gray-400 ml-auto">
          {value.length} characters
        </span>
      </div>
      {/* Debug: show text in a div to verify rendering */}
      {value && (
        <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200 text-sm" style={{ color: 'black', fontFamily: 'Noto Sans Telugu, Noto Sans Devanagari, Inter, sans-serif' }}>
          <strong>Preview:</strong> {value}
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        placeholder="Your rhyme will appear here..."
        className="w-full py-4 px-4 text-base leading-6 resize-none outline-none min-h-[200px] bg-white dark:bg-gray-900"
        style={{ color: 'black', fontFamily: 'Noto Sans Telugu, Noto Sans Devanagari, Inter, sans-serif' }}
        rows={lineCount}
        spellCheck={false}
      />
    </div>
  );
}
