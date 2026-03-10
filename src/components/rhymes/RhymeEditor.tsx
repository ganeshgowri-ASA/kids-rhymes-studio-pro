'use client';

import { useRef, useMemo, useCallback } from 'react';

interface RhymeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export default function RhymeEditor({ value, onChange, readOnly = false }: RhymeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const lineCount = useMemo(() => {
    const lines = value.split('\n');
    return Math.max(lines.length, 8);
  }, [value]);

  const lineNumbers = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => i + 1);
  }, [lineCount]);

  const handleInput = useCallback(() => {
    if (editorRef.current && !readOnly) {
      onChange(editorRef.current.innerText);
    }
  }, [onChange, readOnly]);

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
      <div className="flex">
        <div className="select-none bg-gray-50 dark:bg-gray-800 text-right pr-3 pl-3 py-4 border-r border-gray-100 dark:border-gray-700">
          {lineNumbers.map((num) => (
            <div key={num} className="text-xs text-gray-400 leading-6 font-mono">
              {num}
            </div>
          ))}
        </div>
        <div className="flex-1 relative min-h-[200px] bg-white dark:bg-gray-900">
          {!value && (
            <div className="absolute inset-0 py-4 px-4 text-base leading-6 text-gray-300 pointer-events-none" style={{ fontFamily: "'Noto Sans Telugu', 'Noto Sans Devanagari', 'Noto Sans Tamil', 'Noto Sans Bengali', 'Noto Sans Gujarati', 'Noto Sans Kannada', Inter, sans-serif" }}>
              Your rhyme will appear here...
            </div>
          )}
          <div
            ref={editorRef}
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onInput={handleInput}
            className="py-4 px-4 text-base leading-6 resize-none outline-none min-h-[200px] whitespace-pre-wrap break-words"
            style={{ color: '#1f2937', fontFamily: "'Noto Sans Telugu', 'Noto Sans Devanagari', 'Noto Sans Tamil', 'Noto Sans Bengali', 'Noto Sans Gujarati', 'Noto Sans Kannada', Inter, sans-serif" }}
          >
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}
