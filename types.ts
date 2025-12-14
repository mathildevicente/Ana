export interface UserData {
  name: string;
  pronouns: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ana';
  text: string;
  isTyping?: boolean;
}

export enum AppState {
  ONBOARDING = 'ONBOARDING',
  CHATTING = 'CHATTING',
  ERROR = 'ERROR'
}
