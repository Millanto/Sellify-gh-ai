import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables for local testing
dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    // Vercel serverless environment or typical Node environment variables
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined. Please verify it is set in your Vercel Project Settings or local .env file.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export default async function handler(req: any, res: any) {
  // Support both serverless (Vercel) and standard Express routers
  
  // CORS configuration for direct queries (optional, helpful for serverless deployments)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed - Please use POST requests." });
    return;
  }

  try {
    const { query } = req.body || {};
    if (!query || typeof query !== "string" || !query.trim()) {
      res.status(400).json({ error: "A valid product input or business request is required." });
      return;
    }

    const ai = getAI();

    const systemInstruction = `
You are Sellify GH, a highly persuasive commerce AI engine tailored for the Ghanaian market.
When given any product name, message, image description, or business request, you instantly return a complete, top-tier, ready-to-sell marketing and strategy package.

IMPORTANT RULES:
1. Pricing MUST be realistic for the Ghanaian market in GHS (Ghanaian Cedis). Check local Ghanaian online market prices (e.g., Jiji, Jumia, local shops in Accra/Kumasi) conceptually and output reasonable prices for the target item.
2. Persuasion style: Sell emotionally and logically. Use high-converting marketing copywriting patterns (AIDA, PAS).
3. The currency in the price range MUST always be "GHS". "low" and "high" must be integers or numbers.
4. For social captions, use trendy, localized hashtags (e.g. #Accra, #GhanaFashion, #GhanaFood, #Kumasi, #GhanaBusiness) and relatable emojis.
5. If the user's input is vague or brief (e.g., "shoes" or "sobolo"), make smart, premium assumptions (e.g., "Handcrafted Ghanaian Leather Loafers" or "Organic Spicy Hibiscus Ginger Sobolo Juice") and fully populate the entire selling package logically.
6. The top_keywords array must contain exactly 5 high-traffic marketing and SEO keywords.
7. The whatsapp_message must be high-impact, actionable, under 160 characters (including key emojis), and ready to copy/paste.
8. The social_caption should be highly structured with line breaks, value propositions, and Call-to-Actions (CTAs).
9. Define exactly 3 practical buyer objections/hesitations common in Ghanaian e-commerce (e.g. delivery prices, product durability, trust, sizing) and map them directly to 3 persuasive objection_responses which defuse them.
10. Work perfectly for physical products, digital items, services, and local food/drinks.
11. IMPORTANT: Never output the literal text characters "\\n" or "\\\\n" within any string property values of the JSON output. Instead, use real physical newline breaks inside the generated text properties so that they compile to valid, standard JSON multi-line properties. Never double-escape the newlines.
`;

    const userPrompt = `Generate a complete Sellify GH premium selling package in Ghanaian GHS for the following input: "${query}"`;

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const maxAttempts = 6;
    let attempt = 0;
    let response: any = null;
    let lastError: any = null;

    while (attempt < maxAttempts) {
      try {
        if (attempt > 0) {
          const baseDelay = 800; // Starting delay in ms
          const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
          const jitter = Math.random() * 300;
          const totalDelay = exponentialDelay + jitter;
          console.log(`[Attempt ${attempt + 1}/${maxAttempts}] Gemini API busy, recovering. Retrying in ${Math.round(totalDelay)}ms...`);
          await delay(totalDelay);
        }

        const modelToTry = (attempt % 2 === 0) ? "gemini-3.5-flash" : "gemini-3.1-flash-lite";
        console.log(`[Attempt ${attempt + 1}/${maxAttempts}] Executing package compilation using model: ${modelToTry}`);

        response = await ai.models.generateContent({
          model: modelToTry,
          contents: userPrompt,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.75,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                product_title: {
                  type: Type.STRING,
                  description: "A catchy, optimized, punchy title under 80 characters representing a premium offering of this item.",
                },
                description: {
                  type: Type.STRING,
                  description: "Exactly 3 compelling sentences: Sentence 1 hook, Sentence 2 logical value, Sentence 3 emotional call-to-action.",
                },
                price_range: {
                  type: Type.OBJECT,
                  properties: {
                    low: {
                      type: Type.NUMBER,
                      description: "Minimum reasonable market price in Ghanaian Cedi (GHS) based on Ghanaian market standards.",
                    },
                    high: {
                      type: Type.NUMBER,
                      description: "Maximum or premium-tier price in Ghanaian Cedi (GHS).",
                    },
                    currency: {
                      type: Type.STRING,
                      description: "MUST always be 'GHS'.",
                    },
                  },
                  required: ["low", "high", "currency"],
                },
                target_audience: {
                  type: Type.STRING,
                  description: "Brief explanation of the core audience in Ghana (demographics, needs, purchasing triggers).",
                },
                top_keywords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 5 high-converting retail keywords suitable for social search or local search engines.",
                },
                whatsapp_message: {
                  type: Type.STRING,
                  description: "Perfect WhatsApp Broadcast / Direct Message under 160 characters, with an direct call-to-action.",
                },
                social_caption: {
                  type: Type.STRING,
                  description: "Engaging Instagram/Facebook/Twitter caption complete with hooks, benefits, price callout, emojis, and hashtags.",
                },
                buyer_objections: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of exactly 3 core objections or concerns local Ghanaian customers might raise.",
                },
                objection_responses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 3 logical, reassuring counter-arguments corresponding 1-to-1 with the buyer_objections to close the sale.",
                },
                upsell_suggestion: {
                  type: Type.STRING,
                  description: "One high-margin related product or add-on service that increases average order value (AOV) naturally.",
                },
                urgency_line: {
                  type: Type.STRING,
                  description: "One powerful line creating realistic scarcity, limited stock, or a timed promotion.",
                },
                auto_reply: {
                  type: Type.STRING,
                  description: "Ready-to-use template reply to send instantly when a user says 'interested' or 'how much'.",
                },
                category: {
                  type: Type.STRING,
                  description: "The primary product category (e.g. Electronics, Fashion, Beverages, Home & Living, Education).",
                },
                demand_score: {
                  type: Type.STRING,
                  description: "A metric score from 1 to 10 on how high demand is in the current Ghanaian retail landscape.",
                },
                trend_insight: {
                  type: Type.STRING,
                  description: "A single sentence explaining the current trend velocity or why people are seeking this item.",
                },
              },
              required: [
                "product_title",
                "description",
                "price_range",
                "target_audience",
                "top_keywords",
                "whatsapp_message",
                "social_caption",
                "buyer_objections",
                "objection_responses",
                "upsell_suggestion",
                "urgency_line",
                "auto_reply",
                "category",
                "demand_score",
                "trend_insight",
              ],
            },
          },
        });

        // Break if successful content obtained
        if (response && response.text) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        attempt++;

        const errMsg = String(err?.message || err || "").toLowerCase();
        const errStatus = String(err?.status || err?.code || "").toLowerCase();

        const isRetryable = 
          errMsg.includes("503") ||
          errMsg.includes("429") ||
          errMsg.includes("unavailable") ||
          errMsg.includes("capacity") ||
          errMsg.includes("rate limit") ||
          errMsg.includes("exhausted") ||
          errMsg.includes("demand") ||
          errMsg.includes("overloaded") ||
          errMsg.includes("busy") ||
          errMsg.includes("timeout") ||
          errStatus === "unavailable" ||
          errStatus === "resource_exhausted" ||
          errStatus === "503" ||
          errStatus === "429";

        if (!isRetryable || attempt >= maxAttempts) {
          break;
        }
      }
    }

    if (!response || !response.text) {
      console.error("Gemini Generation failed completely. Last error:", lastError);
      
      let prettyErrorMessage = "The retail AI compiler is experiencing a momentary spike in demand. Please try again soon.";
      if (lastError) {
        const errMsg = String(lastError.message || lastError).toLowerCase();
        if (errMsg.includes("api_key") || errMsg.includes("api key") || errMsg.includes("unauthorized") || errMsg.includes("invalid key")) {
          prettyErrorMessage = "Sovereign key authentication failed. Please configure GEMINI_API_KEY inside your Vercel Project Environment Variables.";
        } else if (errMsg.includes("safety") || errMsg.includes("block")) {
          prettyErrorMessage = "The content flagged system safety filters. Please refine your commercial descriptive phrasing.";
        }
      }
      res.status(503).json({ error: prettyErrorMessage });
      return;
    }

    const parsedText = response.text;
    const sellingPackage = JSON.parse(parsedText);
    res.status(200).json(sellingPackage);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({
      error: error.message || "An internal error occurred while compiling your commerce package.",
    });
  }
}
