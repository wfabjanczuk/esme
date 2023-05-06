import { Chat, Message } from '../../../common/messenger/structures'
import React, { Dispatch, SetStateAction } from 'react'
import { AlertStore } from '../../../common/alert-bar/alert-store.context'
import { Authenticator } from '../../../common/authenticator/authenticator.context'
import axios from 'axios'
import { getLastLocationFromMessages } from '../../../common/utils'
import { config } from '../../../app/config'

const chatsBaseUrl = `${config.messengerApiUrl}/agency/chats`

const emptySetState = (): void => {
}

export class Archives {
  constructor (
    public chats: { [chatId: string]: Chat },
    public messages: { [chatId: string]: Message[] },
    private readonly authenticator: Authenticator = undefined as unknown as Authenticator,
    private readonly alertStore: AlertStore = undefined as unknown as AlertStore,
    private readonly setState: Dispatch<SetStateAction<Archives>> = emptySetState
  ) {
  }

  hasState (): boolean {
    return this.setState !== emptySetState
  }

  fetchChats (): void {
    void axios.get<Chat[]>(chatsBaseUrl, { headers: { Authorization: this.authenticator.authorizationHeader } })
      .then(({ data: chats }) => {
        this.chats = {}
        for (const chat of chats) {
          this.chats[chat.id] = chat

          if (chat.latStart != null && chat.lngStart != null) {
            this.chats[chat.id].location = {
              lat: chat.latStart,
              lng: chat.lngStart
            }
          }
        }
        this.refreshState()
      })
      .catch(() => this.alertStore.add('error', 'Could not fetch chats'))
  }

  fetchChatMessages (chatId: string): void {
    const url = `${chatsBaseUrl}/${chatId}/messages`

    void axios.get<Message[]>(url, { headers: { Authorization: this.authenticator.authorizationHeader } })
      .then(({ data: messages }) => {
        const location = getLastLocationFromMessages(messages)

        let chats = this.chats
        if (location !== undefined) {
          chats[chatId] = {
            ...this.chats[chatId],
            location
          }
          chats = { ...this.chats }
        }

        this.chats = chats
        this.messages = {
          ...this.messages,
          [chatId]: messages
        }
        this.refreshState()
      })
      .catch(() => this.alertStore.add('error', 'Could not fetch chat messages'))
  }

  private refreshState (): void {
    this.setState(new Archives(this.chats, this.messages, this.authenticator, this.alertStore, this.setState))
  }
}

export const ArchivesContext = React.createContext<Archives>(new Archives({}, {}, undefined, undefined, emptySetState))
