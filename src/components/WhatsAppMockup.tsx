/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Check, Copy, MoreHorizontal, Phone, Smile, User, Video } from "lucide-react";

interface WhatsAppMockupProps {
  message: string;
}

export default function WhatsAppMockup({ message }: WhatsAppMockupProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#111111] border border-[#C9A84C]/25 rounded-[20px] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.8)] relative">
      {/* Inner subtle glow line */}
      <div className="absolute inset-0 border border-white/5 rounded-[20px] pointer-events-none z-20" />

      {/* Mock Phone Notch & Header */}
      <div className="bg-[#1A1A1A] border-b border-[#C9A84C]/10 text-[#F5F5F5] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#222222] flex items-center justify-center border border-[#C9A84C]/20">
            <User className="h-4.5 w-4.5 text-[#C9A84C]" />
          </div>
          <div>
            <div className="font-serif font-bold text-sm tracking-wide text-[#F5F5F5]">Ghanaian Customer</div>
            <div className="text-[9px] text-[#C9A84C] font-mono tracking-wider flex items-center mt-0.5">
              <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full inline-block mr-1.5 animate-pulse"></span>
              SECURE LINK ACTIVE
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-[#888888]">
          <Video className="h-4 w-4 cursor-pointer hover:text-[#C9A84C] transition-colors" />
          <Phone className="h-4 w-4 cursor-pointer hover:text-[#C9A84C] transition-colors" />
          <MoreHorizontal className="h-4 w-4 cursor-pointer hover:text-[#C9A84C] transition-colors" />
        </div>
      </div>

      {/* Chat Conversation Body */}
      <div 
        className="flex-1 p-5 relative overflow-y-auto space-y-4 min-h-[220px] bg-[#0A0A0A]"
        style={{
          backgroundImage: `radial-gradient(rgba(201,168,76,0.03) 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      >
        {/* Timestamp */}
        <div className="flex justify-center">
          <span className="text-[9px] bg-[#1A1A1A] text-[#888888] py-1 px-3 rounded-full border border-white/5 uppercase tracking-[0.12em] font-mono font-medium">
            PERSUASIVE PITCH
          </span>
        </div>

        {/* Sender name Ghanaian Customer in small gold text above */}
        <div className="flex flex-col items-end space-y-1 pl-8">
          <span className="text-[9px] text-[#C9A84C] tracking-[0.15em] font-sans font-bold uppercase mr-1">
            Ghanaian Customer
          </span>
          
          <div className="relative bg-[#1F4A2E] text-[#F5F5F5] rounded-2xl rounded-tr-none p-4 shadow-[0_2px_15px_rgba(0,0,0,0.4)] text-xs leading-[1.6]">
            {/* Bubble Tail */}
            <div className="absolute top-0 right-[-5px] w-[8px] h-[10px] bg-[#1F4A2E] clip-whatsapp-tail" />
            
            <p className="whitespace-pre-wrap leading-[1.6] font-sans">{message}</p>
            
            <div className="flex items-center justify-end space-x-1.5 mt-2.5 text-[9px] text-[#888888] font-mono">
              <span>Verified GHS Script</span>
              <span className="text-[#C9A84C] flex font-normal">✓✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Action Bar */}
      <div className="bg-[#111111] p-3 flex items-center space-x-2 border-t border-[#C9A84C]/10">
        <Smile className="h-5.5 w-5.5 text-[#888888] cursor-pointer hover:text-[#C9A84C] shrink-0 transition-colors" />
        <div className="flex-1 bg-[#0A0A0A] text-[#888888] text-xs py-2 px-4 rounded-full border border-[#C9A84C]/10 truncate font-mono">
          Ready to transmit...
        </div>
        <button
          onClick={handleCopy}
          className={`h-9 px-4 rounded-full flex items-center space-x-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 ${
            copied
              ? "bg-[#C9A84C] text-black shadow-[0_0_15px_rgba(201,168,76,0.3)]"
              : "bg-[#222222] hover:bg-[#333333] text-[#F5F5F5] border border-white/5"
          }`}
          title="Copy Message"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Stats footer */}
      <div className="bg-[#161616] px-5 py-2.5 border-t border-[#C9A84C]/10 flex justify-between items-center text-[9px] text-[#888888] font-mono tracking-wider">
        <span>LENGTH: {message.length} CHARS</span>
        <span className={message.length <= 160 ? "text-[#C9A84C] font-semibold" : "text-[#888888]"}>
          {message.length <= 160 ? "OPTIMAL PACK PACE" : "EXTENDED CAMPAIGN"}
        </span>
      </div>
    </div>
  );
}
