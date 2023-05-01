export enum ActionType {
  info = 'info',
  error = 'error',
  newChat = 'new_chat',
  chats = 'chats',
  chatHistory = 'chat_history',
  userMessage = 'user_message'
}

export interface InfoAction {
  type: ActionType.info
  payload: {
    message: string
  }
}

export interface ErrorAction {
  type: ActionType.error
  payload: {
    message: string
  }
}

export interface NewChatAction {
  type: ActionType.newChat
  payload: Chat
}

export interface ChatsAction {
  type: ActionType.chats
  payload: {
    chats: Chat[]
  }
}

export interface ChatHistoryAction {
  type: ActionType.chatHistory
  payload: {
    chatId: string
    messages: Message[]
  }
}

export interface UserMessageAction {
  type: ActionType.userMessage
  payload: Message
}

export type Action = InfoAction | ErrorAction | NewChatAction | ChatsAction | ChatHistoryAction | UserMessageAction

export interface Chat {
  id: string
  agencyId: number
  eventId: number
  organizerId: number
  participantId: number
  ended: 0
  latStart: number
  lngStart: number
  timeStart: string
  timeEnd: string
}

export interface Message {
  id: string
  chatId: string
  authorId: number
  fromOrganizer: number
  content: string
  timeSent: string
}
