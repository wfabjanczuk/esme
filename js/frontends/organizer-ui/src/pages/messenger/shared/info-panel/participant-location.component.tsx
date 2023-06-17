import React from 'react'

interface Location {
  lat: number
  lng: number
}

interface ParticipantLocationProps {
  location?: Location
}

export const ParticipantLocation = ({ location }: ParticipantLocationProps): JSX.Element => {
  if (location === undefined) {
    return <></>
  }
  const coords = `${location.lat.toFixed(5)},${location.lng.toFixed(5)}`

  return <iframe
    key={coords}
    width='100%'
    height='300'
    style={{ border: 0 }}
    loading='lazy'
    allowFullScreen
    referrerPolicy='no-referrer-when-downgrade'
    src={`https://www.google.com/maps/embed/v1/place?zoom=12&q=${coords}&key=AIzaSyDYaFFSCHZEK4oqWcbjDchoZy9UaLLX0o0`}>
  </iframe>
}
