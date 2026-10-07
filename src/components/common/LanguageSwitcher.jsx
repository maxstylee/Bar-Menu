import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Globe, ChevronDown, Check } from "lucide-react";

export function LanguageSwitcher({ variant = "inline", className = "" }) {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeLang =
    supportedLanguages.find((l) => l.code === language) ||
    supportedLanguages[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Inline Style: EN | DE | TR | RU (matching desktop design)
  if (variant === "inline") {
    return (
      <div className={`flex items-center text-xs font-bold tracking-wider select-none ${className}`}>
        {supportedLanguages.map((lang, idx) => {
          const isActive = language === lang.code;
          return (
            <React.Fragment key={lang.code}>
              {idx > 0 && <span className="mx-1.5 text-slate-600 font-light">|</span>}
              <button
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`transition-colors duration-150 ${
                  isActive
                    ? "text-white font-extrabold"
                    : "text-slate-400 hover:text-slate-200 font-medium"
                }`}
              >
                {lang.label}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // 2. Pills Style
  if (variant === "pills") {
    return (
      <div className={`flex items-center gap-1 bg-[#101827]/80 p-1 rounded-xl border border-slate-700/60 ${className}`}>
        {supportedLanguages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              language === lang.code
                ? "bg-sky-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    );
  }

  // 3. Dropdown Style
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#101827]/90 hover:bg-[#16233b] border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 transition-all focus:outline-none"
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-sky-400" />
        <span className="font-bold tracking-wide">{activeLang.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-[#0e1624] border border-slate-700/90 rounded-2xl shadow-2xl py-1.5 z-50 backdrop-blur-xl">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                language === lang.code
                  ? "bg-sky-500/20 text-sky-300 font-bold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <span>{lang.name}</span>
              {language === lang.code && <Check className="w-3.5 h-3.5 text-sky-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
