import React, { Fragment } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { EventForm } from './event.form'
import Header from '../../layout/header'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import { Box, Typography } from '@mui/material'
import { styles } from '../../common/styles'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { ArrowBack } from '@mui/icons-material'
import { useEvent } from './event.hook'

const linkStyle = {
  color: 'inherit',
  textDecoration: 'inherit'
}

interface EditEventCardProps {
  id: number
}

const EditEventCard = ({ id }: EditEventCardProps): JSX.Element => {
  const {
    errorMessages,
    entity: event
  } = useEvent(id)

  return <Box component='main' sx={{
    flex: 1,
    py: 2,
    px: 4,
    backgroundColor: '#eaeff1'
  }}>
    <AlertBar maxWidth='936px'/>
    <Paper sx={{
      maxWidth: '936px',
      margin: 'auto',
      px: 4,
      py: 2
    }}>
      <Typography component='h2' variant='h5' sx={{
        ...styles.header,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        Edit event
        <NavLink to={'/events/'} style={linkStyle}>
          <Button variant='contained' color='primary' startIcon={<ArrowBack/>}>
            Go to events list
          </Button>
        </NavLink>
      </Typography>
      <EventForm event={event} errorMessages={errorMessages}/>
    </Paper>
  </Box>
}

export const EditEventView = (): JSX.Element => {
  const { id: idFromRoute } = useParams()
  const id = idFromRoute === undefined ? undefined : parseInt(idFromRoute, 10)

  return <Fragment>
    <Header title='Event'/>
    <Box component='main' sx={{
      flex: 1,
      py: 2,
      px: 4,
      backgroundColor: '#eaeff1'
    }}>
      {id !== undefined
        ? <EditEventCard id={id}/>
        : <></>
      }
    </Box>
  </Fragment>
}
