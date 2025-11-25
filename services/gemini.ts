
import { GoogleGenAI } from "@google/genai";
import { HealthData, ForecastPoint } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key missing");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateHealthInsight = async (data: HealthData): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Act as a proactive health coach (Aura).
      User Vitals:
      - HR: ${data.heartRate.value}
      - Stress: ${data.stressLevel.value}
      - Hydration: ${data.hydration.value}

      Write a very short, punchy daily briefing (max 15 words).
      If stats are good: Be motivational (e.g. "Great rhythm today, Alex! Keep hydrating.").
      If stats are bad: Be a gentle nudge (e.g. "Energy looks low. Try a glass of water.").
      Do not be clinical. Be a companion.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Your body rhythm is stable.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Monitoring active. Connection to AI limited.";
  }
};

// New feature: Predictive Analysis
export const generateForecast = async (data: HealthData): Promise<ForecastPoint[]> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Based on the current health data (Heart Rate: ${data.heartRate.value}, Stress: ${data.stressLevel.value}, Hydration: ${data.hydration.value}), 
      predict the user's "Energy Level" (0-100) and "Stress Level" (0-100) for the next 4 hours in 1-hour increments.
      
      Assume:
      - If hydration is low (<50), energy drops fast.
      - If stress is high (>70), energy drops fast.
      
      Return ONLY a JSON array of 4 objects: [{ "time": "+1h", "energy": 80, "stress": 20 }, ...]. 
      Do not include markdown formatting.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text?.replace(/```json|```/g, '').trim();
    if (!text) return [];
    
    return JSON.parse(text);
  } catch (error) {
    // Fallback mock forecast if AI fails
    return [
      { time: '+1h', energy: data.energyLevel - 5, stress: data.stressLevel.value + 2 },
      { time: '+2h', energy: data.energyLevel - 15, stress: data.stressLevel.value + 5 },
      { time: '+3h', energy: data.energyLevel - 25, stress: data.stressLevel.value + 10 },
      { time: '+4h', energy: data.energyLevel - 40, stress: data.stressLevel.value + 15 },
    ];
  }
};

export const chatWithHealthAssistant = async (
  message: string, 
  currentContext: HealthData,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  try {
    const ai = getAiClient();
    
    const systemInstruction = `
      You are Aura, a predictive health simulator.
      Current Vitals: HR ${currentContext.heartRate.value}, BP ${currentContext.bloodPressureSys.value}/${currentContext.bloodPressureDia.value}, Hydration ${currentContext.hydration.value}%.
      
      The user is asking questions about their health or running "what if" scenarios.
      Be encouraging, calm, and use metaphors (e.g., "body battery", "engine heat").
      Keep responses short and conversational.
    `;

    const recentHistory = history.slice(-6).map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction },
      history: recentHistory
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    return "I'm having trouble connecting to the cloud. Please try again.";
  }
};
