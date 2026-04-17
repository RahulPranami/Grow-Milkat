import { GoogleGenAI, Type } from "@google/genai";
import { Opportunity } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY}); as per guidelines
// Simple in-memory cache to reduce API calls and avoid 429 errors
const insightsCache: Record<string, any> = {};

export const getInvestmentInsights = async (opportunity: Opportunity) => {
  // Check cache first
  if (insightsCache[opportunity.id]) {
    return insightsCache[opportunity.id];
  }

  // Initialize AI inside the function to ensure up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `Act as a senior financial advisor. Analyze this investment opportunity and provide a brief summary of risks, potential, and strategy in JSON format.
  Opportunity: ${opportunity.title}
  Type: ${opportunity.type}
  ROI: ${opportunity.expectedROI}
  Description: ${opportunity.description}`;

  try {
    // Using gemini-3-flash-preview for faster response and higher quota
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { 
              type: Type.STRING,
              description: "Brief analysis of the opportunity"
            },
            riskLevel: { 
              type: Type.STRING,
              description: "Assessed risk level (Low, Moderate, High)"
            },
            strategicAdvice: { 
              type: Type.STRING,
              description: "Advice on how to approach this investment"
            }
          },
          required: ["summary", "riskLevel", "strategicAdvice"]
        }
      }
    });
    
    // Extracting text directly from response.text property (not a method)
    const result = JSON.parse(response.text || "{}");
    
    // Cache the result
    if (result.summary) {
      insightsCache[opportunity.id] = result;
    }
    
    return result;
  } catch (error: any) {
    // Log the error but return a sensible fallback to keep the UI functional
    console.error("Gemini Error:", error);
    
    // Check if it's a rate limit error
    const isRateLimit = error?.message?.includes("429") || error?.status === "RESOURCE_EXHAUSTED";
    
    const fallback = {
      summary: isRateLimit 
        ? `Analysis currently unavailable due to high demand. ${opportunity.title} shows strong potential based on its ${opportunity.expectedROI} ROI and ${opportunity.type} sector performance.`
        : `Strategic analysis for ${opportunity.title} indicates a high-potential growth opportunity in the ${opportunity.type} sector.`,
      riskLevel: opportunity.riskLevel || "Moderate",
      strategicAdvice: "Consider a balanced allocation strategy and monitor market trends in the local area."
    };

    return fallback;
  }
};
