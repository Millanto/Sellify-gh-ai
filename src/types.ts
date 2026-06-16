/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SellingPackage {
  product_title: string;
  description: string;
  price_range: {
    low: number;
    high: number;
    currency: "GHS";
  };
  target_audience: string;
  top_keywords: string[];
  whatsapp_message: string;
  social_caption: string;
  buyer_objections: string[];
  objection_responses: string[];
  upsell_suggestion: string;
  urgency_line: string;
  auto_reply: string;
  category: string;
  demand_score: number | string;
  trend_insight: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  data: SellingPackage;
}
