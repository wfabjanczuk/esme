export interface Event {
  id: number
  name: string
  description: string
  address: string
  lat: number
  lng: number
  timeStart: string
  timeEnd: string
}

export interface UserEvent extends Event {
  isChatRequested: boolean
}
