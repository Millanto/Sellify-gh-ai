/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent, MouseEvent } from "react";
import {
  Sparkles,
  TrendingUp,
  Users,
  Key,
  MessageSquare,
  Instagram,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  FileText,
  BadgeAlert,
  ArrowUpRight,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SellingPackage, SearchHistoryItem } from "./types";
import WhatsAppMockup from "./components/WhatsAppMockup";
import SocialMockup from "./components/SocialMockup";
import { Analytics } from "@vercel/analytics/react";

const PRESETS = [
  {
    name: "Handmade Kente Cloth",
    input: "Premium hand-woven Kente muffler from Kumasi for graduation and weddings. High quality.",
    type: "Physical Product",
  },
  {
    name: "Accra Airport VIP Transfer",
    input: "Professional chauffeur service routing from Kotoka Airport (KIA) across Accra and East Legon. Luxury sedan, high security.",
    type: "Service",
  },
  {
    name: "Special Ginger Sobolo Juice",
    input: "Freshly brewed Sobolo (hibiscus tea) with strong Ghanaian ginger, clove spices, and honey sweetener. Organic production, 500ml bottles.",
    type: "Food & Drink",
  },
  {
    name: "Tech Career eBook (PDF)",
    input: "Digital guide for university graduates showing how to land remote software engineering roles from Ghana. Practical roadmap and CV templates.",
    type: "Digital Product",
  },
];

const LOADING_STEPS = [
  "Firing up Sellify GH commerce engine...",
  "Running retail value luxury indexing...",
  "Validating GHS price ranges for prestige margins...",
  "Calibrating premium demographic buying drivers...",
  "Structuring social media copy and hashtags...",
  "Formulating rapid WhatsApp selling dialogues...",
  "Polishing your Sellify Selling Package...",
];

function cleanNewlines(text: string): string {
  if (typeof text !== "string") return text;
  // Replace literal string patterns of '\n' or '\\n' with genuine carriage returns / newlines
  return text.replaceAll("\\n", "\n").replaceAll("\\\\n", "\n");
}

function sanitizePackage(pkg: SellingPackage): SellingPackage {
  if (!pkg) return pkg;
  return {
    ...pkg,
    product_title: cleanNewlines(pkg.product_title),
    description: cleanNewlines(pkg.description),
    target_audience: cleanNewlines(pkg.target_audience),
    top_keywords: pkg.top_keywords ? pkg.top_keywords.map(cleanNewlines) : [],
    whatsapp_message: cleanNewlines(pkg.whatsapp_message),
    social_caption: cleanNewlines(pkg.social_caption),
    buyer_objections: pkg.buyer_objections ? pkg.buyer_objections.map(cleanNewlines) : [],
    objection_responses: pkg.objection_responses ? pkg.objection_responses.map(cleanNewlines) : [],
    upsell_suggestion: cleanNewlines(pkg.upsell_suggestion),
    urgency_line: cleanNewlines(pkg.urgency_line),
    auto_reply: cleanNewlines(pkg.auto_reply),
    category: cleanNewlines(pkg.category),
    trend_insight: cleanNewlines(pkg.trend_insight),
  };
}

function formatErrorMessage(errorText: string): string {
  if (!errorText) return "An unexpected error occurred with the Sellify GH synthesis core. Please retry.";
  
  if (errorText === "404_API_NOT_FOUND") {
    return "The Sellify GH server endpoint was not found (404). If you are deploying on Vercel, please make sure your project contains 'vercel.json' in the root directory, and that you have redeployed the full package (not just local static build logs).";
  }

  if (errorText === "504_SERVER_TIMEOUT") {
    return "The commerce server timed out (504/502 Gateway Timeout). Free-tier hosting (like Vercel) limits function execution to 10 seconds. On initial run/cold starts, the AI takes a moment longer to compile your Ghanaian marketing package. Please click 'Retry Gen' again in a second—it usually passes instantly on the second try!";
  }

  if (errorText === "RESPONSE_NOT_JSON") {
    return "Your hosted deployment returned a raw HTML template instead of clean JSON data. This almost always means the server crashed during launch. Please log into your Vercel Project Settings -> Environment Variables, add GEMINI_API_KEY with your premium sovereign key, and trigger a fresh redeploy to activate it.";
  }

  try {
    const trimmed = errorText.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      const parsed = JSON.parse(trimmed);
      if (parsed.error) {
        if (typeof parsed.error === "string") return parsed.error;
        if (parsed.error.message) return parsed.error.message;
      }
      if (parsed.message) return parsed.message;
    }
  } catch (e) {
    // Continue
  }

  const lower = errorText.toLowerCase();
  if (
    lower.includes("experiencing high demand") || 
    lower.includes("503") || 
    lower.includes("unavailable") || 
    lower.includes("overloaded") || 
    lower.includes("capacity") ||
    lower.includes("spikes in demand") ||
    lower.includes("temporary busy") ||
    lower.includes("temporarily busy")
  ) {
    return "The retail AI compiler is experiencing a momentary capacity surge from extremely high merchant demand across Accra & Kumasi. We attempted automatic self-healing retries, but servers are still temporarily busy. Please try executing again in a few seconds.";
  }

  if (
    lower.includes("api_key") || 
    lower.includes("api key") || 
    lower.includes("unauthorized") || 
    lower.includes("invalid key") ||
    lower.includes("is not defined")
  ) {
    return "Sovereign key authentication failed. Please configure GEMINI_API_KEY in your hosting Environment Variables (e.g., inside your Vercel Project Dashboard), and trigger a new redeployment.";
  }

  return errorText;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentPackage, setCurrentPackage] = useState<SellingPackage | null>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"assets" | "audience" | "channels" | "closing">("assets");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);

  // Paywall states
  const [usesCount, setUsesCount] = useState<number>(0);
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);
  const [showCodeInput, setShowCodeInput] = useState<boolean>(false);
  const [enteredCode, setEnteredCode] = useState<string>("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("🎉 Welcome to Sellify AI! You're now unlimited.");
  const [copiedNumber, setCopiedNumber] = useState<boolean>(false);

  // Load history & paywall states on mount
  useEffect(() => {
    try {
      let initialHistoryLength = 0;
      const saved = localStorage.getItem("sellify_commerce_history") || localStorage.getItem("elite_commerce_history");
      if (saved) {
        const parsed: SearchHistoryItem[] = JSON.parse(saved);
        const cleaned = parsed.map((item) => ({
          ...item,
          data: sanitizePackage(item.data),
        }));
        setHistory(cleaned);
        initialHistoryLength = cleaned.length;
      }

      const uses = localStorage.getItem("sellify_uses");
      const isUnlocked = localStorage.getItem("sellify_unlocked") === "true";
      
      // Fallback to history length if "sellify_uses" is not set at all!
      const parsedUses = uses !== null ? parseInt(uses, 10) : initialHistoryLength;
      
      setUsesCount(parsedUses);
      setUnlocked(isUnlocked);
      
      // Auto-save the fallback uses count to keep in sync
      if (uses === null) {
        localStorage.setItem("sellify_uses", String(parsedUses));
      }
      
      if (!isUnlocked && parsedUses >= 3) {
        setShowPaywallModal(true);
      }
    } catch (e) {
      console.error("Failed to load initial data:", e);
    }
  }, []);

  const saveHistory = (newHistory: SearchHistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem("sellify_commerce_history", JSON.stringify(newHistory));
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  };

  // Cycling loading steps
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 1600);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleCopyText = (text: string, fieldIdentifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldIdentifier);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAll = () => {
    if (!currentPackage) return;
    const hashtags = currentPackage.top_keywords
      .map((k) => `#${k.replace(/\s+/g, "")}`)
      .join(" ");

    const fullContent = `🏆 SELLIFY GH PREMIUM SELLING PACKAGE: ${currentPackage.product_title.toUpperCase()}
======================================================
📊 CATEGORY: ${currentPackage.category || "Physical Commerce"}
💰 PRESCRIBED PRICE: GH₵${currentPackage.price_range.low} - GH₵${currentPackage.price_range.high} GHS
📈 DEMAND MOMENTUM INDEX: ${currentPackage.demand_score}/10

✨ CORE VALUATION COPY:
${currentPackage.description}

🔴 CONVERSION URGENCY TRIGGERS:
"${currentPackage.urgency_line}"

📲 MESSENGER WHATSAPP DIALOGUE:
${currentPackage.whatsapp_message}

💬 AUTOMATED RESPONDER FLOW:
${currentPackage.auto_reply}

💸 UPSALE MATRIX:
${currentPackage.upsell_suggestion}

🎯 LUXURY DEMOGRAPHIC INSIGHT:
${currentPackage.target_audience}

🔑 INDEXED HASHTAGS:
${hashtags}`;

    navigator.clipboard.writeText(fullContent);
    setCopiedField("copy_all");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleConfirmUnlockCode = () => {
    const sanitized = enteredCode.toUpperCase().trim();
    if (sanitized === "SELLIFY2024") {
      try {
        localStorage.setItem("sellify_unlocked", "true");
        setUnlocked(true);
        setShowPaywallModal(false);
        setToastMessage("🎉 Welcome to Sellify AI! You're now unlimited.");
        setShowSuccessToast(true);
        setEnteredCode("");
        setCodeError(null);
        setTimeout(() => {
          setShowSuccessToast(false);
        }, 3000);
      } catch (e) {
        console.error("Unlock failed to write to disk:", e);
      }
    } else {
      setIsShaking(true);
      setCodeError("Invalid code. Check your WhatsApp for the correct code.");
      setTimeout(() => {
        setIsShaking(false);
      }, 400);
    }
  };

  const resetTesterParameters = () => {
    try {
      localStorage.removeItem("sellify_uses");
      localStorage.removeItem("sellify_unlocked");
      setUsesCount(0);
      setUnlocked(false);
      setShowPaywallModal(false);
      setShowCodeInput(false);
      setToastMessage("🔄 Tester reset: 3 free runs restored!");
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
    } catch (e) {
      console.error("Storage write error during reset:", e);
    }
  };

  const handlePresetClick = (presetInput: string) => {
    setQuery(presetInput);
  };

  const clearHistory = () => {
    saveHistory([]);
    setConfirmWipe(false);
  };

  const deleteHistoryItem = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    saveHistory(history.filter((item) => item.id !== id));
  };

  const loadHistoryItem = (item: SearchHistoryItem) => {
    const cleanData = sanitizePackage(item.data);
    setCurrentPackage(cleanData);
    setQuery(item.query);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    // Direct synchronous check from disk for extreme reliability
    const diskUnlocked = localStorage.getItem("sellify_unlocked") === "true";
    const diskUsesStr = localStorage.getItem("sellify_uses");
    const diskUses = diskUsesStr !== null ? parseInt(diskUsesStr, 10) : usesCount;

    // Apply real-time synchronization
    if (diskUnlocked !== unlocked) setUnlocked(diskUnlocked);
    if (diskUses !== usesCount) setUsesCount(diskUses);

    if (!diskUnlocked && diskUses >= 3) {
      setShowPaywallModal(true);
      return;
    }

    // Increment generations count under free tier
    if (!diskUnlocked) {
      const nextLimit = diskUses + 1;
      setUsesCount(nextLimit);
      try {
        localStorage.setItem("sellify_uses", String(nextLimit));
      } catch (err) {
        console.error("Storage write error for limits:", err);
      }
    }

    const trimmedQuery = query.trim();
    // Cache lookup: If we already have a generated package for this exact query in memory/history,
    // we bypass the API call, saving rate limit quota and returning it instantly.
    const cachedItem = history.find(
      (h) => h.query.toLowerCase() === trimmedQuery.toLowerCase()
    );

    setLoading(true);
    setError(null);

    if (cachedItem) {
      try {
        // High-fidelity progressive loading illusion to feel natural and premium
        await new Promise((resolve) => setTimeout(resolve, 800));
        const cleanData = sanitizePackage(cachedItem.data);
        setCurrentPackage(cleanData);
        
        // Put it at the top of history logs
        const updatedHistory = [
          {
            ...cachedItem,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
          ...history.filter((h) => h.id !== cachedItem.id),
        ].slice(0, 15);
        saveHistory(updatedHistory);
        setLoading(false);
        return;
      } catch (err) {
        // Fallback to calling API if something failed
      }
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      // Catch Vercel/serverless timeouts and routing mismatch states early
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("404_API_NOT_FOUND");
        }
        if (response.status === 504 || response.status === 502) {
          throw new Error("504_SERVER_TIMEOUT");
        }
      }

      let data: any;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error("RESPONSE_NOT_JSON");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate seller package.");
      }

      const cleanData = sanitizePackage(data);
      setCurrentPackage(cleanData);

      const newItem: SearchHistoryItem = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        query: query.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        data: cleanData,
      };

      const updatedHistory = [
        newItem,
        ...history.filter((h) => h.query.toLowerCase() !== query.trim().toLowerCase()),
      ].slice(0, 15);
      saveHistory(updatedHistory);
    } catch (err: any) {
      console.error(err);
      setError(formatErrorMessage(err.message || "An error occurred with the synthesis core."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex flex-col font-sans select-none selection:bg-[#C9A84C]/30 relative overflow-x-hidden leading-[1.6]">
      
      {/* Decorative ambient premium background light paths */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#C9A84C]/[0.024] rounded-full blur-[140px] pointer-events-none glow-ambient-1" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#E8C96D]/[0.015] rounded-full blur-[130px] pointer-events-none glow-ambient-2" />

      {/* Primary Luxe Top Header */}
      <header className="sticky top-0 z-50 w-full h-[60px] md:h-[70px] bg-[#0A0A0A] border-b border-[#C9A84C]/20 px-5 flex items-center shadow-lg">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          
          {/* Custom logo mark on the left side */}
          <div className="flex items-center space-x-3.5">
            {/* Handcrafted Vector Gold Logo Mark (as seen in image) */}
            <svg className="w-[36px] h-[36px] md:w-[42px] md:h-[42px] shrink-0 select-none drop-shadow-[0_0_8px_rgba(201,168,76,0.2)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C9A84C" />
                  <stop offset="100%" stopColor="#E8C96D" />
                </linearGradient>
              </defs>
              
              {/* Outer orbital gold circle with top-right gap */}
              <path d="M 82 28 A 40 40 0 1 0 76 80" stroke="url(#gold-grad)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              
              {/* Orbital left indicator golden dot */}
              <circle cx="18" cy="58" r="3" fill="url(#gold-grad)" />

              {/* Styled S curve */}
              <path d="M 40 38 C 40 24, 60 24, 60 34 C 60 44, 40 46, 40 56 C 40 66, 60 66, 60 58" stroke="url(#gold-grad)" strokeWidth="7.5" strokeLinecap="round" fill="none" />
              
              {/* Stylized delivery/shopping cart */}
              <path d="M 40 66 H 64 L 60 77 H 45 Z" fill="url(#gold-grad)" opacity="0.95" />
              
              {/* Speed lines */}
              <line x1="26" y1="69" x2="35" y2="69" stroke="url(#gold-grad)" strokeWidth="2" strokeLinecap="round" />
              <line x1="24" y1="74" x2="33" y2="74" stroke="url(#gold-grad)" strokeWidth="2" strokeLinecap="round" />
              <line x1="28" y1="79" x2="34" y2="79" stroke="url(#gold-grad)" strokeWidth="2" strokeLinecap="round" />

              {/* Cart wheels */}
              <circle cx="48" cy="83" r="2" fill="url(#gold-grad)" />
              <circle cx="58" cy="83" r="2" fill="url(#gold-grad)" />

              {/* GH Badge in upper right */}
              <rect x="68" y="14" width="22" height="15" rx="3.5" fill="#0A0A0A" stroke="url(#gold-grad)" strokeWidth="2" />
              <text x="79" y="24.5" fill="url(#gold-grad)" fontSize="8.5" fontWeight="950" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0">GH</text>
            </svg>
            
            {/* Wordmark (no stack, responsive layout) */}
            <div className="flex items-center leading-none">
              <span className="font-serif font-black text-[#C9A84C] tracking-[0.06em] uppercase text-base md:text-lg whitespace-nowrap">
                SELLIFY<span className="hidden sm:inline"> GH</span>
              </span>
              {/* Inline GH Box for narrow mobile view screens */}
              <div className="sm:hidden border border-[#C9A84C] rounded px-1.5 py-0.5 bg-[#0A0A0A] shrink-0 leading-none ml-2">
                <span className="text-[8px] font-sans font-black text-[#C9A84C] tracking-wide select-none">
                  GH
                </span>
              </div>
              <span className="font-sans font-light text-[10px] md:text-xs text-white tracking-[0.3em] uppercase ml-2 md:ml-3">
                AI
              </span>
            </div>
          </div>

          {/* GHS Mode Badge on the right */}
          <div className="border border-[#C9A84C] rounded-full px-[10px] py-[4px] flex flex-col items-center justify-center shrink-0 leading-none select-none">
            <span className="text-[9px] md:text-[10px] font-sans font-bold text-[#C9A84C] tracking-[0.15em] uppercase">
              GHS
            </span>
            <span className="text-[6px] md:text-[7px] font-sans font-semibold text-[#888888] tracking-[0.15em] uppercase mt-0.5">
              MODE
            </span>
          </div>

        </div>
      </header>

      {/* Main Grid View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-5 pb-32 lg:pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-15">
        
        {/* LEFT SECTION: INPUT & PRESETS & HISTORY */}
        <section className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* Inputs Section */}
          <div className="bg-[#111111] border border-[#C9A84C]/25 rounded-[20px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex flex-col space-y-5 relative">
            <div className="absolute top-0 right-0 h-1.5 w-12 bg-gradient-to-r from-[#C9A84C] to-[#E8C96D] rounded-bl-lg rounded-tr-[20px]" />
            
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2.5">
                <div className="h-2 w-2 rounded-full bg-[#C9A84C] shadow-[0_0_8px_#C9A84C]" />
                <h2 className="text-[10px] tracking-[0.15em] font-bold text-[#C9A84C] uppercase font-sans">
                  What are you selling?
                </h2>
              </div>
              {unlocked ? (
                <span className="text-[8px] font-mono bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/25 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider select-none">
                  UNLIMITED ACTIVE
                </span>
              ) : (
                <span className="text-[8px] font-mono bg-white/5 text-gray-400 border border-white/5 px-2 py-0.5 rounded uppercase tracking-wider select-none font-semibold">
                  Free runs used: {usesCount}/3
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <div className="relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe your offering (e.g. Traditional high-quality Kente fabrics, special organic garlic Sobolo juice made in East Legon...)"
                  className="w-full h-36 rounded-[16px] bg-[#0A0A0A] border border-[#C9A84C]/15 focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/25 p-4.5 text-xs text-[#F5F5F5] placeholder-[#888888]/60 placeholder:italic focus:outline-none transition-all duration-300 resize-none leading-[1.6] caret-[#C9A84C] shadow-inner select-text"
                  maxLength={600}
                />
                <div className="absolute bottom-3 right-3.5 text-[9px] font-mono text-[#888888]">
                  {query.length}/600 chars
                </div>
              </div>

              {/* GENERATE BUTTON Container for responsive mobile bottom fix */}
              <div className="fixed lg:static bottom-0 left-0 right-0 z-40 p-5 lg:p-0 bg-[#0A0A0A]/95 lg:bg-transparent border-t border-[#C9A84C]/10 lg:border-t-0 shadow-[0_-10px_25px_rgba(0,0,0,0.8)] lg:shadow-none">
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className={`w-full py-4 text-black font-sans font-bold tracking-[0.15em] uppercase text-xs rounded-xl flex items-center justify-center space-x-2.5 transition-all duration-300 transform active:scale-[0.98] cursor-pointer ${
                    loading
                      ? "bg-[#222222] text-[#888888] border border-white/5 cursor-not-allowed"
                      : !query.trim()
                      ? "bg-gradient-to-r from-[#C9A84C]/20 to-[#E8C96D]/15 text-black/40 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#C9A84C] to-[#E8C96D] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(201,168,76,0.25)] text-black"
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Synthesizing Markets...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Selling Package</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="w-full border-t border-white/5 my-1" />

            {/* Presets */}
            <div className="space-y-3">
              <h3 className="text-[9px] tracking-[0.15em] font-sans font-bold text-[#888888] uppercase flex items-center space-x-2">
                <span>Select & Autofill Ghanaian Presets</span>
                <span className="h-1 w-1 rounded-full bg-[#C9A84C]"></span>
              </h3>
              
              <div className="grid grid-cols-2 gap-2.5">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetClick(preset.input)}
                    className="p-3 text-left bg-[#0A0A0A] hover:bg-[#C9A84C] border border-[#C9A84C]/25 hover:border-transparent rounded-xl transition-all duration-200 flex flex-col justify-between group active:scale-[0.97]"
                  >
                    <span className="text-[8px] text-[#C9A84C] group-hover:text-black/75 font-mono tracking-wider uppercase leading-none mb-1.5 transition-colors">
                      {preset.type}
                    </span>
                    <span className="text-[11px] font-bold text-[#F5F5F5] group-hover:text-black font-serif transition-colors truncate w-full">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sales History */}
          <div className="bg-[#111111] border border-[#C9A84C]/25 rounded-[20px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex-1 flex flex-col min-h-[220px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <span className="text-[9px] font-mono font-bold text-[#C9A84C] bg-[#C9A84C]/10 py-1 px-2.5 rounded border border-[#C9A84C]/15 uppercase tracking-[0.12em]">
                  MEMORY CORES
                </span>
                <h2 className="text-[10px] tracking-[0.15em] font-bold text-[#888888] uppercase font-sans">
                  Historic Logs
                </h2>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={resetTesterParameters}
                  className="text-[9px] font-mono tracking-wider text-[#C9A84C]/60 hover:text-[#C9A84C] transition-colors uppercase cursor-pointer mr-1"
                  title="Reset code uses back to 0 & lock the app for testing the paywall"
                >
                  [ RESET LIMITS ]
                </button>
                
                {history.length > 0 && (
                  <div className="flex items-center space-x-2">
                    {confirmWipe ? (
                      <>
                        <span className="text-[9px] font-mono text-red-400 font-semibold uppercase animate-pulse">
                          Sure?
                        </span>
                        <button
                          type="button"
                          onClick={clearHistory}
                          className="text-[9px] font-mono tracking-wider font-bold text-red-500 hover:text-red-400 transition-colors py-0.5 px-2 bg-red-950/40 border border-red-500/30 rounded uppercase cursor-pointer"
                        >
                          Wipe Clean
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmWipe(false)}
                          className="text-[9px] font-mono tracking-wider text-gray-400 hover:text-gray-300 transition-colors py-0.5 px-1.5 uppercase cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmWipe(true)}
                        className="text-[9px] font-mono tracking-wider font-bold text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1 uppercase cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Wipe Logs</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/5 rounded-xl bg-[#0A0A0A]">
                <FileText className="h-7 w-7 text-white/5 mb-2.5" />
                <p className="text-[10px] font-medium text-[#888888] max-w-[200px]">
                  No past selling packages generated yet. Executive collections persist here.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[300px]" style={{ direction: "rtl" }}>
                <div style={{ direction: "ltr" }} className="space-y-2">
                  {history.map((item) => {
                    const isSelected = currentPackage?.product_title === item.data.product_title;
                    return (
                      <div
                        key={item.id}
                        onClick={() => loadHistoryItem(item)}
                        className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between group relative select-text ${
                          isSelected
                            ? "bg-[#C9A84C]/10 border-[#C9A84C] pl-5 shadow-[0_4px_15px_rgba(201,168,76,0.1)]"
                            : "bg-[#0A0A0A] hover:bg-[#151515] border-[#C9A84C]/15 hover:border-[#C9A84C]/40"
                        }`}
                      >
                        {/* Smooth left golden indicator on hover / selection */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-[3px] bg-[#C9A84C] transition-all duration-300 rounded-l-xl ${
                            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        />

                        <div className="flex flex-col space-y-1.5 min-w-0 pr-2 pl-1.5">
                          <span className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#C9A84C] font-serif transition-colors leading-[1.4] truncate">
                            {item.data.product_title}
                          </span>
                          <div className="flex items-center space-x-2 text-[9px] text-[#888888] font-mono uppercase tracking-wider">
                            <span className="bg-[#111111] border border-white/5 px-1.5 py-0.2 rounded text-[#C9A84C]">
                              {item.data.category || "GENERAL"}
                            </span>
                            <span>{item.timestamp}</span>
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={(e) => deleteHistoryItem(item.id, e)}
                          className="text-[#888888] hover:text-red-400 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                          title="Purge log item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT SECTION: RESULTS PRESENTATION MODULE */}
        <section className="lg:col-span-7 flex flex-col min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* Loading sequence */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#111111] border border-[#C9A84C]/25 rounded-[20px] min-h-[450px]"
              >
                <div className="relative flex items-center justify-center h-24 w-24 mb-6">
                  {/* Glowing custom backdrop ring */}
                  <div className="absolute inset-0 bg-[#C9A84C]/10 rounded-full blur-xl animate-pulse" />
                  <div className="absolute h-18 w-18 border border-dashed border-[#C9A84C] rounded-full animate-spin" />
                  <div className="absolute h-10 w-10 bg-[#0A0A0A] text-[#C9A84C] rounded-xl border border-[#C9A84C]/30 flex items-center justify-center shadow-[0_0_15px_rgba(201,168,76,0.3)]">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                </div>

                <h3 className="text-xs font-mono tracking-[0.18em] text-[#C9A84C] uppercase mb-2 animate-pulse font-bold">
                  Assembling Selling Assets
                </h3>
                
                {/* Micro-copy cyclic messages */}
                <div className="h-8 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-[#F5F5F5] bg-[#0A0A0A] border border-[#C9A84C]/20 px-3.5 py-1 rounded-full uppercase tracking-widest font-bold">
                    {LOADING_STEPS[loadingStep]}
                  </span>
                </div>

                <p className="text-[11px] text-[#888888] mt-5 max-w-[280px] leading-[1.6]">
                  Calibrating retail target buying thresholds & designing optimized cross-channel promotional structures.
                </p>
              </motion.div>
            )}

            {/* Error handling view */}
            {error && !loading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#0d0d0d] border border-[#C9A84C]/30 rounded-[20px] min-h-[450px] relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.7)]"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/5 rounded-full blur-[75px] pointer-events-none" />

                <div className="h-16 w-16 bg-[#0A0A0A] text-[#C9A84C] border border-[#C9A84C]/35 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(201,168,76,0.15)] animate-pulse">
                  <svg className="h-6 w-6 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>

                <h3 className="text-sm font-serif font-black text-[#C9A84C] tracking-[0.08em] uppercase select-none">
                  AI Node Temporarily Busy
                </h3>

                <p className="text-xs text-[#b1b1b1] mt-4 max-w-md leading-[1.7] px-4 select-text">
                  {error}
                </p>

                <div className="mt-5 text-[9px] font-mono text-[#666666] uppercase tracking-[0.14em] select-none">
                  Sellify GH Automatic Multi-try Failover Active
                </div>

                <button
                  onClick={handleSubmit}
                  className="mt-8 px-6 py-3 bg-gradient-to-tr from-[#C9A84C] to-[#E8C96D] hover:scale-[1.02] active:scale-[0.98] text-black font-sans font-bold rounded-xl text-xs tracking-widest uppercase transition-all duration-200 shadow-[0_4px_20px_rgba(201,168,76,0.2)] hover:shadow-[0_4px_25px_rgba(201,168,76,0.35)]"
                >
                  Retry Execution
                </button>
              </motion.div>
            )}

            {/* Empty view (Welcome screen) */}
            {!currentPackage && !loading && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#111111] border border-[#C9A84C]/25 rounded-[20px] min-h-[450px] relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#C9A84C]/5 rounded-full blur-[75px] pointer-events-none" />

                <div className="h-16 w-16 bg-[#0A0A0A] text-[#C9A84C] border border-[#C9A84C]/30 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <svg className="w-8 h-8 shrink-0 text-[#C9A84C]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 40 38 C 40 24, 60 24, 60 34 C 60 44, 40 46, 40 56 C 40 66, 60 66, 60 58" stroke="url(#gold-grad-welcome)" strokeWidth="7.5" strokeLinecap="round" fill="none" />
                    <defs>
                      <linearGradient id="gold-grad-welcome" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C9A84C" />
                        <stop offset="100%" stopColor="#E8C96D" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="max-w-md">
                  <h3 className="text-base font-serif font-bold text-[#F5F5F5] tracking-[0.05em] uppercase">
                    Sellify GH Premium Suite
                  </h3>
                  <p className="text-xs text-[#888888] mt-3 leading-[1.6]">
                    Construct premium high-converting campaigns calibrated against the retail landscape of Ghana. Enter details regarding your target items or service assets to trigger multi-channel copy.
                  </p>
                  <div className="mt-8 flex flex-col items-center justify-center space-y-2 text-[9px] font-mono text-[#888888] uppercase tracking-[0.14em]">
                    <span className="text-[#C9A84C] font-bold">Comprehensive Outputs</span>
                    <span>Realistic GHS Pricing • WhatsApp Conversational Hook</span>
                    <span>Instagram Cap Closers • OBJ responses • Upsell Vectors</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Displaying Current Package Content */}
            {currentPackage && !loading && !error && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col space-y-6 h-full"
              >
                
                {/* Executive Outline Header Card */}
                <div className="bg-[#111111] border border-[#C9A84C]/25 rounded-[20px] p-6 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#C9A84C]/[0.015] to-transparent pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 text-[9px] font-mono bg-[#0A0A0A] text-[#C9A84C] w-fit px-2.5 py-1 rounded border border-[#C9A84C]/15 uppercase tracking-[0.12em] mb-3">
                        <span>Category: {currentPackage.category || "GENERAL"}</span>
                      </div>
                      
                      {/* Product Title in Large bold Gold serif Playfair Display */}
                      <h2 className="text-2xl sm:text-3.5xl font-serif font-black text-[#C9A84C] select-text leading-[1.3] tracking-normal">
                        {currentPackage.product_title}
                      </h2>
                      
                      {/* Trend insight indicator with left gold border */}
                      <div className="flex items-center space-x-2 mt-4 text-[#888888] border-l-2 border-[#C9A84C] pl-3.5">
                        <span className="text-xs italic select-text leading-[1.6]">
                          &ldquo;{currentPackage.trend_insight}&rdquo;
                        </span>
                      </div>
                    </div>

                    {/* Circular Demand Badge Outlined in Gold */}
                    <div className="flex items-center space-x-3.5 shrink-0 bg-[#0A0A0A] border border-[#C9A84C]/15 rounded-2xl p-3.5">
                      <div className="text-right">
                        <p className="text-[8px] uppercase tracking-[0.15em] text-[#888888] font-mono leading-none">DEMAND INDEX</p>
                        <p className="text-lg font-black text-[#C9A84C] leading-none mt-1">{currentPackage.demand_score}/10</p>
                      </div>
                      <div className="w-9 h-9 rounded-full border border-[#C9A84C] flex items-center justify-center font-mono text-[11px] font-bold text-[#C9A84C] bg-[#C9A84C]/5">
                        {currentPackage.demand_score}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Tabbed Area */}
                <div className="bg-[#111111] border border-[#C9A84C]/25 rounded-[20px] p-6 shadow-xl flex-1 flex flex-col space-y-6">
                  
                  {/* Navigator: Minimal, scroll fallback, gold text/underline styling */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-1 overflow-x-auto gap-3">
                    <nav className="flex space-x-1.5 text-xs font-bold leading-none shrink-0 overflow-x-auto scrollbar-none pb-2">
                      {[
                        { id: "assets", label: "Core Blueprint" },
                        { id: "audience", label: "Audience & SEO" },
                        { id: "channels", label: "Interactive Channels" },
                        { id: "closing", label: "Sales Crushing" },
                      ].map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-3 py-3 font-sans text-[10px] tracking-[0.12em] uppercase transition-all duration-200 border-b-2 relative shrink-0 focus:outline-none cursor-pointer ${
                              isActive
                                ? "text-[#C9A84C] border-[#C9A84C] font-extrabold"
                                : "text-[#888888] hover:text-[#F5F5F5] border-transparent"
                            }`}
                          >
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </nav>

                    {/* Copy All Button in Action header bar */}
                    <button
                      type="button"
                      onClick={handleCopyAll}
                      className="px-3.5 py-2 hover:bg-[#C9A84C] hover:text-black hover:border-transparent text-[#C9A84C] border border-[#C9A84C]/45 rounded-lg text-[9px] font-mono tracking-[0.12em] uppercase font-bold flex items-center space-x-1.5 shrink-0 transition-all duration-200 cursor-pointer active:scale-95"
                      title="Copy Entire Package Contents"
                    >
                      {copiedField === "copy_all" ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Copied All</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-2.5 w-2.5" />
                          <span>Copy All</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Tab Body Contents */}
                  <div className="flex-1 overflow-y-auto pr-1">
                    
                    {/* TAB 1: CORE BLUEPRINT */}
                    {activeTab === "assets" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-5"
                      >
                        {/* Golden Formula block */}
                        <div className="bg-[#0A0A0A] rounded-xl border border-[#C9A84C]/15 p-5 space-y-4 relative">
                          <div className="absolute top-0 right-0 h-1 w-8 bg-[#C9A84C]/40 rounded-bl" />
                          
                          <div className="flex items-center justify-between">
                            <h4 className="text-[9px] tracking-[0.15em] font-sans font-bold text-[#C9A84C] uppercase">
                              The Conversion Sales Discourse (AIDA Engine Copy)
                            </h4>
                            <button
                              type="button"
                              onClick={() => handleCopyText(currentPackage.description, "copy_pitch")}
                              className="text-[#888888] hover:text-[#C9A84C] transition-colors"
                            >
                              {copiedField === "copy_pitch" ? (
                                <Check className="h-3.5 w-3.5 text-[#C9A84C]" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                          
                          {/* Rich legible copy text */}
                          <p className="text-xs text-[#F5F5F5] select-text leading-[1.6]">
                            {currentPackage.description}
                          </p>

                          <div className="w-full border-t border-[#C9A84C]/10 my-1" />

                          <div className="flex flex-col sm:flex-row sm:items-start gap-2.5">
                            <span className="text-[8px] tracking-[0.14em] font-mono bg-red-950/20 text-red-400 border border-red-500/10 py-1 px-2.5 rounded-full uppercase font-bold shrink-0">
                              Urgency Closer
                            </span>
                            <p className="text-xs text-red-200 select-text leading-[1.6] font-bold italic">
                              &ldquo;{currentPackage.urgency_line}&rdquo;
                            </p>
                          </div>
                        </div>

                        {/* Prices & Valuation metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-[#0A0A0A] rounded-xl border border-[#C9A84C]/15 p-5 flex flex-col justify-between">
                            <div>
                              <h4 className="text-[9px] tracking-[0.15em] font-mono font-bold text-[#888888] uppercase mb-2">
                                Prescribed Price Range (GHS)
                              </h4>
                              <p className="text-2xl font-serif font-black text-[#C9A84C] select-text">
                                GH₵{currentPackage.price_range.low} - GH₵{currentPackage.price_range.high}
                              </p>
                            </div>
                            <span className="text-[9px] text-[#888888] font-mono uppercase mt-4">
                              Vetted Retail Metrics
                            </span>
                          </div>

                          <div className="bg-[#0A0A0A] rounded-xl border border-[#C9A84C]/15 p-5 flex flex-col justify-between">
                            <div>
                              <h4 className="text-[9px] tracking-[0.15em] font-mono font-bold text-[#888888] uppercase mb-2">
                                Categorization Engine
                              </h4>
                              <p className="text-sm font-bold text-[#F5F5F5] select-text font-serif">
                                {currentPackage.category || "Physical Commerce"}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1.5 mt-4">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shadow-[0_0_6px_#C9A84C]" />
                              <span className="text-[9px] font-mono text-[#C9A84C] tracking-widest uppercase font-bold">Secure Synthesis</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* TAB 2: AUDIENCE & SEO KEYWORDS */}
                    {activeTab === "audience" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-5"
                      >
                        {/* Target demographic profile split card */}
                        <div className="bg-[#0A0A0A] rounded-xl border border-[#C9A84C]/15 p-5 space-y-3.5">
                          <h4 className="text-[9px] tracking-[0.15em] font-sans font-bold text-[#C9A84C] uppercase flex items-center space-x-2">
                            <Users className="h-4 w-4 text-[#C9A84C]" />
                            <span>Prescribed Buying Demographic Target</span>
                          </h4>
                          <p className="text-xs text-[#F5F5F5] leading-[1.6] select-text">
                            {currentPackage.target_audience}
                          </p>
                        </div>

                        {/* SEO tag cards */}
                        <div className="bg-[#0A0A0A] rounded-xl border border-[#C9A84C]/15 p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[9px] tracking-[0.15em] font-sans font-bold text-[#C9A84C] uppercase flex items-center space-x-2">
                              <Key className="h-4 w-4 text-[#C9A84C]" />
                              <span>Optimal Search Hashtags & Keywords</span>
                            </h4>
                            <span className="text-[8px] text-[#888888] font-mono uppercase tracking-wider">Indexed Metadata</span>
                          </div>

                          <div className="flex flex-wrap gap-2.5">
                            {currentPackage.top_keywords.map((tag, idx) => (
                              <div
                                key={idx}
                                onClick={() => handleCopyText(tag, `tag_${idx}`)}
                                className="px-3.5 py-2 rounded-lg bg-[#111111] hover:bg-[#C9A84C]/10 text-[#C9A84C] font-mono text-xs cursor-pointer border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 transition-all duration-200 flex items-center space-x-2 select-text"
                              >
                                <span>#{tag}</span>
                                {copiedField === `tag_${idx}` ? (
                                  <Check className="h-3 w-3 text-[#C9A84C]" />
                                ) : (
                                  <Copy className="h-2.5 w-2.5 text-[#888888] hover:text-[#C9A84C]" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* TAB 3: CHANNELS & MOCKUPS */}
                    {activeTab === "channels" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        {/* Share Campaign Assets Grid Block */}
                        <div className="bg-[#0A0A0A] border border-[#C9A84C]/25 p-5 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-lg">
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs font-serif font-bold text-[#F5F5F5] uppercase tracking-wide">Secure Social Disperser</span>
                            <span className="text-[9px] text-[#888888] font-mono tracking-widest uppercase">TRANSMIT PACKS AUTOMATICALLY</span>
                          </div>
                          
                          {/* Luxe Pill Shape Buttons, stacked vertically on mobile, horizontal row on desktop */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                            {/* WhatsApp Button */}
                            <button
                              type="button"
                              onClick={() => {
                                handleCopyText(currentPackage.whatsapp_message, "share_whatsapp");
                                const encoded = encodeURIComponent(currentPackage.whatsapp_message);
                                window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
                              }}
                              className="h-10 px-5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center space-x-2 text-xs font-bold shadow-md transition-all shrink-0 active:scale-95 cursor-pointer"
                              title="Transmit to WhatsApp"
                            >
                              <svg
                                className="h-4.5 w-4.5 text-white shrink-0"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12.012 2c-5.506 0-9.988 4.478-9.988 9.982 0 1.761.458 3.477 1.332 4.981L2 22l5.161-1.352c1.458.794 3.102 1.213 4.846 1.216h.004c5.503 0 9.985-4.478 9.99-9.986 0-2.668-1.036-5.176-2.923-7.062C17.195 2.932 14.686 2.003 12.012 2zm6.071 13.98c-.267.753-1.547 1.38-2.128 1.47-.497.077-1.144.137-3.237-.732-2.673-1.111-4.402-3.83-4.536-4.01-.133-.18-1.077-1.428-1.077-2.723 0-1.294.673-1.928.913-2.183.24-.254.522-.317.695-.317.172 0 .345.002.495.009.155.007.362-.058.567.442.212.517.723 1.763.786 1.895.063.132.105.285.017.458-.088.173-.132.28-.263.432-.132.152-.277.34-.395.457-.132.132-.27.276-.117.538.153.262.68 1.117 1.457 1.81.996.889 1.83 1.164 2.088 1.294.258.13.41.11.562-.066.152-.175.666-.777.844-1.04.178-.264.356-.22.601-.13.244.09 1.548.73 1.812.86.264.13.44.195.505.305.065.11.065.636-.202 1.389z" />
                              </svg>
                              <span>WhatsApp</span>
                            </button>

                            {/* Instagram Button */}
                            <button
                              type="button"
                              onClick={() => {
                                handleCopyText(currentPackage.social_caption, "share_instagram");
                                window.open("https://www.instagram.com/", "_blank");
                              }}
                              className="h-10 px-5 bg-gradient-to-r from-[#8134AF] via-[#DD2A7B] to-[#F58529] text-white rounded-full flex items-center justify-center space-x-2 text-xs font-bold shadow-md transition-all shrink-0 active:scale-95 cursor-pointer"
                              title="Go to Instagram & Paste"
                            >
                              <Instagram className="h-4 w-4 text-white shrink-0" />
                              <span>Instagram</span>
                            </button>

                            {/* Facebook Share Button */}
                            <button
                              type="button"
                              onClick={() => {
                                const hashtags = currentPackage.top_keywords
                                  .map((k) => `#${k.replace(/\s+/g, "")}`)
                                  .join(" ");
                                  
                                const fbText = `🔥 ${currentPackage.product_title}\n\n💰 Price: ${currentPackage.price_range.low} - ${currentPackage.price_range.high} GHS\n✨ ${currentPackage.description}\n\n📲 DM me or WhatsApp to order now!\n\n${hashtags}`;
                                
                                const url = encodeURIComponent(window.location.origin);
                                const text = encodeURIComponent(fbText);
                                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, "_blank");
                              }}
                              className="h-10 px-5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-full flex items-center justify-center space-x-2 text-xs font-bold shadow-md transition-all shrink-0 active:scale-95 cursor-pointer"
                              title="Share on Facebook"
                            >
                              <svg className="h-4 w-4 fill-white shrink-0" viewBox="0 0 24 24">
                                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                              </svg>
                              <span>Facebook</span>
                            </button>
                          </div>
                        </div>

                        {/* Device previews stacked or side-by-side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="flex flex-col space-y-2">
                            <span className="text-[9px] tracking-[0.15em] font-sans font-bold text-[#C9A84C] uppercase px-1">
                              WhatsApp Dialogue Preview
                            </span>
                            <WhatsAppMockup message={currentPackage.whatsapp_message} />
                          </div>

                          <div className="flex flex-col space-y-2">
                            <span className="text-[9px] tracking-[0.15em] font-sans font-bold text-[#C9A84C] uppercase px-1">
                              Social Media Post Preview
                            </span>
                            <SocialMockup
                              title={currentPackage.product_title}
                              category={currentPackage.category}
                              priceLow={currentPackage.price_range.low}
                              priceHigh={currentPackage.price_range.high}
                              demandScore={currentPackage.demand_score}
                              caption={currentPackage.social_caption}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* TAB 4: CLOSING PLANS & SCRIPTS */}
                    {activeTab === "closing" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-5"
                      >
                        {/* Objection & Responses List */}
                        <div className="space-y-3.5">
                          <h4 className="text-[9px] tracking-[0.15em] font-sans font-bold text-red-400 uppercase flex items-center space-x-2">
                            <BadgeAlert className="h-4.5 w-4.5 text-red-400" />
                            <span>Defying Purchasing Objections (Local Calibration)</span>
                          </h4>

                          <div className="grid grid-cols-1 gap-3.5">
                            {currentPackage.buyer_objections.map((objection, idx) => (
                              <div
                                key={idx}
                                className="bg-[#1C1113]/40 hover:bg-[#1C1113]/70 rounded-xl border border-red-500/15 p-4.5 space-y-3 transition-colors duration-200"
                              >
                                <div className="flex items-start space-x-2.5">
                                  <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-500/20 uppercase tracking-widest shrink-0">
                                    Objection {idx + 1}
                                  </span>
                                  <p className="text-xs font-bold text-[#F5F5F5] select-text leading-snug pt-0.5">
                                    {objection}
                                  </p>
                                </div>
                                <div className="pl-3.5 border-l border-[#C9A84C]/50 flex flex-col space-y-1">
                                  <span className="text-[8px] tracking-[0.14em] font-mono text-[#C9A84C] uppercase font-bold">
                                    Prescribed Sales Response
                                  </span>
                                  <p className="text-xs text-emerald-200/90 select-text leading-[1.6]">
                                    {currentPackage.objection_responses[idx]}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Auto-replies & upsales split details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-[#0A0A0A] rounded-xl border border-[#C9A84C]/15 p-5 space-y-3 relative">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[9px] tracking-[0.15em] font-sans font-bold text-[#C9A84C] uppercase">
                                Pre-Structured Messenger Response Flow
                              </h4>
                              <button
                                type="button"
                                onClick={() => handleCopyText(currentPackage.auto_reply, "copy_autoreply")}
                                className="text-[#888888] hover:text-[#C9A84C] transition-colors"
                              >
                                {copiedField === "copy_autoreply" ? (
                                  <Check className="h-3.5 w-3.5 text-[#C9A84C]" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                            
                            <p className="text-xs text-[#F5F5F5] select-text leading-[1.6]">
                              {currentPackage.auto_reply}
                            </p>
                          </div>

                          <div className="bg-[#0A0A0A] rounded-xl border border-[#C9A84C]/15 p-5 space-y-3">
                            <h4 className="text-[9px] tracking-[0.15em] font-sans font-bold text-[#C9A84C] uppercase flex items-center space-x-2">
                              <ArrowUpRight className="h-4 w-4 text-[#C9A84C]" />
                              <span>Average Order Value Upsell Strategy</span>
                            </h4>
                            <p className="text-xs text-[#F5F5F5] select-text leading-[1.6] font-bold">
                              {currentPackage.upsell_suggestion}
                            </p>
                            <span className="text-[9px] text-[#888888] uppercase tracking-wider font-mono block mt-4">
                              Present at Pitch Closure
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </section>

      </main>

      {/* Corporate branding watermark footer */}
      <footer className="border-t border-[#C9A84C]/15 bg-[#050505] p-5 text-center text-[9px] text-[#888888] font-mono uppercase tracking-[0.14em] mt-auto">
        <p>© 2026 Sellify GH Commerce Engine. Polished for Sovereign Retail Enterprise Growth.</p>
      </footer>

      {/* SUCCESS TOAST OVERLAY */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-[200] bg-[#C9A84C] text-black px-6 py-4 rounded-xl shadow-[0_12px_40px_rgba(201,168,76,0.35)] flex items-center space-x-3 border border-[#E8C96D]/40 font-sans font-bold text-sm tracking-wide"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAYWALL SYSTEM MODAL */}
      <AnimatePresence>
        {showPaywallModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md select-none overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-[#111111] border border-[#C9A84C] rounded-[20px] p-6 md:p-8 max-w-[420px] w-[90%] md:w-full max-h-[90vh] overflow-y-auto shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col items-center relative text-center select-text transition-all scrollbar-thin"
            >
              {/* Close/Quit top button */}
              <button
                type="button"
                onClick={() => setShowPaywallModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer select-none"
                title="Quit Paywall"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-[#C9A84C] text-3xl md:text-4xl font-bold leading-none mb-3 select-none">◆</div>
              
              <div className="text-[9px] md:text-[10px] tracking-[0.15em] text-[#888888] font-bold uppercase mb-2 text-center">
                YOU'VE USED YOUR 3 FREE GENERATIONS
              </div>
              
              <h2 className="font-serif font-bold text-white text-2xl md:text-[28px] leading-tight mb-2">
                Unlock Sellify AI Forever
              </h2>
              
              <p className="font-sans text-[#888888] text-xs md:text-[14px] leading-relaxed mb-6 px-1">
                Join Ghana sellers closing more sales every single day
              </p>

              {/* Features List */}
              <div className="w-full space-y-3 mb-6 text-left border-b border-white/5 pb-5">
                {[
                  "Unlimited generations forever",
                  "WhatsApp + Instagram + Facebook copy",
                  "GHS pricing for every product",
                  "Demand score and trend insights",
                  "All future updates included",
                  "Pay once. Own it forever."
                ].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-3 text-xs md:text-sm text-[#F5F5F5] font-sans">
                    <span className="text-[#C9A84C] font-extrabold shrink-0 mt-0.5">✓</span>
                    <span className="leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="w-full text-center select-none mb-6">
                <span className="text-[9px] tracking-[0.15em] font-mono font-bold text-[#888888] block mb-1">
                  ONE TIME PAYMENT
                </span>
                <span className="font-serif text-5xl md:text-[56px] font-extrabold text-[#C9A84C] leading-none block select-text">
                  GH₵50
                </span>
                <span className="text-xs text-[#888888] font-sans block mt-1">
                  only — yours forever
                </span>
              </div>

              {/* Divider */}
              <div className="w-full border-t border-[#C9A84C]/20 mb-6" />

              {/* Steps Component */}
              <div className="w-full bg-[#C9A84C]/[0.05] border border-[#C9A84C]/15 rounded-xl p-4 text-left mb-6">
                <span className="text-[9px] tracking-[0.15em] font-mono text-[#C9A84C] font-semibold block mb-4 uppercase">
                  HOW TO UNLOCK
                </span>
                
                <div className="space-y-4 font-sans">
                  {/* Step 1 */}
                  <div className="flex items-start space-x-3">
                    <div className="h-6 w-6 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#F5F5F5] font-medium leading-none">Send GH₵50 to MoMo</p>
                      <div className="flex items-center space-x-2 mt-1.5 flex-wrap gap-1">
                        <span 
                          onClick={() => handleCopyNumber("0241862207")}
                          className="text-base font-mono font-black text-white tracking-wider cursor-pointer hover:text-[#C9A84C] transition-colors select-all"
                          title="Click to copy Mobile Wallet number"
                        >
                          0241862207
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyNumber("0241862207")}
                          className="text-[9px] font-mono bg-[#C9A84C]/10 border border-[#C9A84C]/25 hover:bg-[#C9A84C]/20 text-[#C9A84C] px-1.5 py-0.5 rounded cursor-pointer transition-all active:scale-95"
                        >
                          {copiedNumber ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <p className="text-[10px] text-[#888888] mt-0.5">Mobile Money • Name: Macmillan Adu</p>
                    </div>
                  </div>
                  
                  {/* Step 2 */}
                  <div className="flex items-start space-x-3">
                    <div className="h-6 w-6 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#F5F5F5] font-medium leading-tight">
                        WhatsApp your payment screenshot to
                      </p>
                      <div className="flex items-center space-x-2 mt-1.5 flex-wrap gap-1">
                        <span 
                          onClick={() => handleCopyNumber("0500810910")}
                          className="text-base font-mono font-black text-white tracking-wider cursor-pointer hover:text-[#C9A84C] transition-colors select-all"
                          title="Click to copy WhatsApp destination"
                        >
                          0500810910
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyNumber("0500810910")}
                          className="text-[9px] font-mono bg-[#C9A84C]/10 border border-[#C9A84C]/25 hover:bg-[#C9A84C]/20 text-[#C9A84C] px-1.5 py-0.5 rounded cursor-pointer transition-all active:scale-95"
                        >
                          {copiedNumber ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Step 3 */}
                  <div className="flex items-start space-x-3">
                    <div className="h-6 w-6 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#F5F5F5] font-medium leading-none">Get unlocked within 5 minutes</p>
                      <p className="text-[10px] text-[#888888] mt-1.5">We're available 8am - 10pm daily</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Payment action trigger */}
              {!showCodeInput ? (
                <button
                  type="button"
                  onClick={() => setShowCodeInput(true)}
                  className="w-full h-[52px] rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C96D] text-black font-sans font-extrabold tracking-widest uppercase text-xs flex items-center justify-center space-x-2 transition-transform active:scale-[0.98] shadow-md cursor-pointer mb-2 shrink-0 select-none"
                >
                  <span>I'VE SENT PAYMENT — UNLOCK ME</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <div className={`w-full flex flex-col space-y-3 mb-2 shrink-0 select-text font-sans ${isShaking ? "animate-shake" : ""}`}>
                  <div className="relative">
                    <input
                      type="text"
                      value={enteredCode}
                      onChange={(e) => {
                        setEnteredCode(e.target.value);
                        setCodeError(null);
                      }}
                      placeholder="Enter your unlock code"
                      className="w-full rounded-lg bg-[#0A0A0A] border border-[#C9A84C]/25 focus:border-[#C9A84C] text-[#F5F5F5] font-mono text-center tracking-widest text-xs uppercase p-3 placeholder-gray-600 focus:outline-none transition-all"
                      maxLength={30}
                    />
                  </div>
                  
                  <p className="text-[10px] text-[#888888] text-center leading-normal">
                    We will send your code via WhatsApp after payment confirmation
                  </p>
                  
                  {codeError && (
                    <p className="text-red-400 text-xs font-mono text-center animate-pulse">
                      {codeError}
                    </p>
                  )}
                  
                  <button
                    type="button"
                    onClick={handleConfirmUnlockCode}
                    className="w-full h-[52px] rounded-xl border border-[#C9A84C] hover:bg-[#C9A84C]/10 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center"
                  >
                    CONFIRM CODE
                  </button>
                </div>
              )}

              {/* Footer Badge */}
              <div className="text-[10px] tracking-widest text-[#888888] text-center mt-6 uppercase leading-none select-none animate-pulse">
                🔒 Secure • Instant • Ghana Made 🇬🇭
              </div>

              {/* Keep Browsing / Quit Modal Trigger */}
              <button
                type="button"
                onClick={() => setShowPaywallModal(false)}
                className="w-full mt-4 py-3 bg-[#111111] border border-white/10 hover:border-white/20 text-[#888888] hover:text-white transition-all rounded-xl font-mono text-[9px] uppercase tracking-[0.12em] font-black cursor-pointer select-none active:scale-95"
              >
                Quit modal & browse app
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Analytics />
    </div>
  );
}
