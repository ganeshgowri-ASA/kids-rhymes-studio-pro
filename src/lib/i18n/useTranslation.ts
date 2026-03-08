"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store/app-store";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import te from "@/messages/te.json";
import ta from "@/messages/ta.json";
import bn from "@/messages/bn.json";
import gu from "@/messages/gu.json";
import kn from "@/messages/kn.json";

const messages: Record<string, typeof en> = { en, hi, te, ta, bn, gu, kn };

export function useTranslation() {
  const language = useAppStore((s) => s.language);
  const t = useMemo(() => {
    const msgs = messages[language] || messages.en;
    function translate(key: string): string {
      const keys = key.split(".");
      let val: unknown = msgs;
      for (const k of keys) {
        if (val && typeof val === "object" && k in (val as Record<string, unknown>)) {
          val = (val as Record<string, unknown>)[k];
        } else {
          // fallback to English
          let fallback: unknown = messages.en;
          for (const fk of keys) {
            if (fallback && typeof fallback === "object" && fk in (fallback as Record<string, unknown>)) {
              fallback = (fallback as Record<string, unknown>)[fk];
            } else {
              return key;
            }
          }
          return typeof fallback === "string" ? fallback : key;
        }
      }
      return typeof val === "string" ? val : key;
    }
    return translate;
  }, [language]);
  return { t, language };
}
