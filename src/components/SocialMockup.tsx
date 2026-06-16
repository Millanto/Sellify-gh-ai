/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Bookmark, Heart, MessageCircle, Send, MoreHorizontal, Check, Copy } from "lucide-react";

interface SocialMockupProps {
  title: string;
  category: string;
  priceLow: number;
  priceHigh: number;
  demandScore: string | number;
  caption: string;
}

export default function SocialMockup({
  title,
  category,
  priceLow,
  priceHigh,
  demandScore,
  caption,
}: SocialMockupProps) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col bg-[#111111] border border-[#C9A84C]/25 rounded-[20px] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.8)] relative">
      {/* Inner subtle glow line */}
      <div className="absolute inset-0 border border-white/5 rounded-[20px] pointer-events-none z-20" />

      {/* Instagram Post Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#C9A84C]/10 bg-[#151515]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C9A84C] to-[#E8C96D] p-[1.5px]">
            <div className="w-full h-full rounded-full bg-[#111111] flex items-center justify-center text-[10px] font-bold text-[#C9A84C] font-mono">
              S
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-[#F5F5F5] font-sans">sellify.gh</div>
            <div className="text-[9px] text-[#888888] font-mono tracking-wider">Accra, Ghana</div>
          </div>
        </div>
        <MoreHorizontal className="h-4 w-4 text-[#888888] cursor-pointer hover:text-[#C9A84C] transition-colors" />
      </div>

      {/* Main Promotional Visual Block */}
      <div className="relative aspect-square w-full bg-[#0A0A0A] flex flex-col justify-between p-5 overflow-hidden select-none border-b border-[#C9A84C]/10">
        {/* Luxury Background Ambient Glow Paths */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(232,201,109,0.03),transparent_60%)]" />

        {/* Top bar on image */}
        <div className="flex justify-between items-center z-10">
          <span className="text-[10px] uppercase font-bold tracking-[0.15em] bg-[#111111]/85 backdrop-blur-md text-[#C9A84C] py-1 px-3 rounded-full border border-[#C9A84C]/20 shadow-sm font-sans">
            {category || "Ghana Prime"}
          </span>
          <div className="flex items-center space-x-1.5 bg-[#111111]/80 backdrop-blur-md py-1 px-3 rounded-full border border-[#C9A84C]/25 shadow-sm">
            <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-pulse"></span>
            <span className="text-[9px] font-mono font-bold text-[#C9A84C] tracking-widest uppercase">
              SCORE: {demandScore}/10
            </span>
          </div>
        </div>

        {/* Central visual statement: Product Title in large cursive / playfair Display, gold */}
        <div className="my-auto z-10 text-center px-4">
          <h3 className="text-xl sm:text-2xl font-serif text-[#C9A84C] font-bold select-text leading-[1.4] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {title}
          </h3>
          <div className="w-10 h-[1.5px] bg-[#C9A84C] mx-auto mt-4 rounded-full shadow-[0_0_10px_rgba(201,168,76,0.5)]" />
        </div>

        {/* Bottom bar with price on image */}
        <div className="flex justify-between items-end z-10 mt-auto">
          {/* Price badge bottom left: gold background black text */}
          <div className="bg-[#C9A84C] p-2 px-3.5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
            <div className="text-[8px] uppercase tracking-[0.12em] text-black/75 font-mono font-bold">ACCRA RANGE</div>
            <div className="text-sm font-black text-black leading-tight">
              GH₵{priceLow} - GH₵{priceHigh}
            </div>
          </div>
          
          {/* Outlined gold Score / Branding */}
          <div className="border border-[#C9A84C]/40 bg-black/60 backdrop-blur-sm text-[#C9A84C] font-mono text-[9px] p-1.5 px-3 rounded-lg tracking-[0.15em] uppercase font-bold">
            GHS PRICED
          </div>
        </div>
      </div>

      {/* Interaction Icons Bar */}
      <div className="flex items-center justify-between p-4 text-[#888888] bg-[#111111]">
        <div className="flex items-center space-x-4">
          <Heart
            className={`h-5 w-5 cursor-pointer transition-transform active:scale-125 ${
              liked ? "text-rose-500 fill-rose-500" : "hover:text-[#C9A84C]"
            }`}
            onClick={() => setLiked(!liked)}
          />
          <MessageCircle className="h-5 w-5 cursor-pointer hover:text-[#C9A84C] transition-colors" />
          <Send className="h-5 w-5 cursor-pointer hover:text-[#C9A84C] transition-colors" />
        </div>
        <Bookmark className="h-5 w-5 cursor-pointer hover:text-[#C9A84C] transition-colors" />
      </div>

      {/* Likes Indicator */}
      <div className="px-4 pb-1 text-[11px] font-bold text-[#F5F5F5] bg-[#111111]">
        {liked ? "1,248" : "1,247"} likes
      </div>

      {/* Caption Content Area */}
      <div className="px-4 pb-4 text-xs bg-[#111111] leading-[1.6]">
        <div className="max-h-[140px] overflow-y-auto pr-1 space-y-1">
          <span className="font-bold text-[#F5F5F5] mr-2">sellify.gh</span>
          <span className="text-[#888888] whitespace-pre-wrap select-text leading-[1.6]">{caption}</span>
        </div>
      </div>

      {/* Copy Caption Action Footer with SELLIFY GH sales system watermark */}
      <div className="bg-[#151515] p-3.5 border-t border-[#C9A84C]/10 flex items-center justify-between">
        <span className="text-[9px] text-[#C9A84C]/55 font-mono tracking-[0.12em] uppercase font-bold">
          SELLIFY GH SYSTEM
        </span>
        
        <button
          onClick={handleCopy}
          className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 ${
            copied
              ? "bg-[#C9A84C] text-black shadow-[0_0_15px_rgba(201,168,76,0.3)]"
              : "bg-[#222222] hover:bg-[#333333] text-[#F5F5F5] border border-white/5"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              <span>Copied Caption</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy Caption</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
