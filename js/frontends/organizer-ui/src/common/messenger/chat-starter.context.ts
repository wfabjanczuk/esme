import React, { Dispatch, SetStateAction } from 'react'

export class ChatStarter {
  constructor (
    public isWaitingForNewChat: boolean,
    public setIsWaitingForNewChat: Dispatch<SetStateAction<boolean>>
  ) {
  }
}

export const ChatStarterContext = React.createContext<ChatStarter>(new ChatStarter(false, () => {}))
