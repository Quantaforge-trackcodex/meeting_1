
import { GoogleGenAI, Type } from "@google/genai";

// Always use the API key directly from process.env.API_KEY as required by the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const forgeAIService = {
  async getCodeRefactorSuggestion(code: string, fileName: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze the following code from ${fileName} and suggest a specific optimization or refactor using modern patterns. Provide the explanation and a diff-like snippet.\n\nCODE:\n${code}`,
      config: {
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });
    return response.text;
  },

  async getSecurityFix(vulnerability: string, codeSnippet: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `As a security expert, fix this vulnerability: ${vulnerability}.\n\nSnippet:\n${codeSnippet}\n\nProvide the explanation and the corrected code.`,
      config: {
        thinkingConfig: { thinkingBudget: 4096 }
      }
    });
    return response.text;
  },

  async summarizeRepoActivity(commits: string[]) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following repository activities in a brief, professional paragraph for a dashboard:\n\n${commits.join('\n')}`,
    });
    return response.text;
  },

  async getLiveChatResponse(message: string, sessionContext: string, participants: string[]) {
    // Fixed: When using maxOutputTokens, a thinkingBudget must be set to reserve tokens for output.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are ForgeAI, an advanced engineering co-pilot integrated into a live developer collaboration session. 
      
      SESSION CONTEXT: ${sessionContext}
      ACTIVE PARTICIPANTS: ${participants.join(', ')}

      USER MESSAGE: "${message}"

      INSTRUCTIONS:
      - Respond as a high-level Senior Software Architect.
      - Be concise, technical, and helpful.
      - If the user asks a technical question, provide a sharp, accurate answer.
      - If the message is social, be brief and professional.
      - Reference active participants if relevant.
      - Keep responses under 3 sentences unless a technical explanation is required.`,
      config: {
        temperature: 0.75,
        maxOutputTokens: 250,
        thinkingConfig: { thinkingBudget: 100 }
      }
    });
    return response.text;
  }
};
