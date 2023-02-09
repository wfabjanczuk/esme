import React from 'react'

const emptySetState = (): void => {
}

export class Messenger {
  constructor (
    private readonly setState: (messenger: Messenger) => void = emptySetState
  ) {
  }

  isInitialized (): boolean {
    return this.setState !== emptySetState
  }

  private update (): void {
    this.setState(new Messenger(this.setState))
  }
}

export const MessengerContext = React.createContext<Messenger>(new Messenger())
