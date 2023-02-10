export interface Chat {
  id: string
  agencyId: number
  eventId: number
  organizerId: number
  participantId: number
  ended: 0
  latStart: number
  lngStart: number
  timeStart: Date
  timeEnd: Date
}
