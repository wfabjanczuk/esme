import React, { Fragment } from 'react'
import Header from '../layout/header'

interface Props {
  text: string
}

export const PlaceholderView = ({ text }: Props): JSX.Element => {
  if (text === 'Error') {
    throw new Error('Oh dang!')
  }

  return <Fragment>
    <Header title={text}/>
  </Fragment>
}
