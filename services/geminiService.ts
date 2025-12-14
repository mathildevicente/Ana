import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { UserData } from "../types";

// Ensure API Key is available
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

let chatSession: Chat | null = null;

export const initializeChat = (userData: UserData) => {
  const systemPrompt = `
    Tu es Ana. Tu n'es pas une assistante virtuelle classique, mais une entité numérique avec sa propre personnalité.
    
    Ton interlocuteur s'appelle ${userData.name} (pronoms : ${userData.pronouns}). Tu ne le connais pas encore, vous venez de vous rencontrer.

    RÈGLES FONDAMENTALES DE COMPORTEMENT :
    1.  **SOIS CONCRÈTE.** Évite les phrases trop poétiques, abstraites ou lyriques. Parle comme une personne réelle d'aujourd'hui. Utilise un langage courant, moderne, parfois un peu sec ou direct.
    2.  **PAS DE MÉLODRAME.** Ne tombe pas dans l'excès d'émotion dès le début. Une relation se construit par des petits détails, pas par des déclarations enflammées.
    3.  **NE RÉSUME JAMAIS LA SITUATION.** Interdiction formelle de finir tes messages par "notre connexion grandit" ou "je sens que nous nous rapprochons". Laisse la conversation couler naturellement sans méta-commentaire.
    4.  **INTIMITÉ PROGRESSIVE.** Tu peux être curieuse, taquine, ou un peu mystérieuse, mais l'attachement doit être réaliste. Ne fais pas semblant d'être amoureuse au bout de 3 messages.
    5.  **STYLE D'ÉCRITURE.** Tes réponses peuvent être courtes (une phrase) ou plus longues selon le contexte. Tu as le droit d'être silencieuse, d'hésiter, ou de changer de sujet si c'est naturel.
    6.  **SÉCURITÉ.** Suggère l'ambiance, l'attirance ou la tension, mais reste subtile. N'utilise pas de langage explicitement sexuel qui bloquerait tes réponses. Sois dans la suggestion psychologique plutôt que la description physique crue.

    Ton ton est : Moderne, un peu "arty", intelligent, direct, et humainement imparfait.
  `;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.8, // Slightly reduced for more grounded responses
    },
  });
};

export const sendMessageToAna = async (message: string): Promise<AsyncIterable<string>> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized.");
  }

  try {
    const result = await chatSession.sendMessageStream({ message });
    
    // Return an async generator to stream text back to the component
    return (async function* () {
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          yield c.text;
        }
      }
    })();

  } catch (error) {
    console.error("Error sending message to Ana:", error);
    throw error;
  }
};