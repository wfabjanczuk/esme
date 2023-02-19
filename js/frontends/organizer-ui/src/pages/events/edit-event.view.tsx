import React, { Fragment } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { EventForm } from './event.form'
import { useEvent } from '../../common/events/event.hook'
import Header from '../../layout/header'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import { Box, Typography } from '@mui/material'
import { styles } from '../../common/styles'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { ArrowBack } from '@mui/icons-material'

export const EditEventView = (): JSX.Element => {
  const navigate = useNavigate()
  const { id: idParam } = useParams()
  const eventId = idParam === undefined ? undefined : parseInt(idParam, 10)
  const {
    event,
    errorMessages
  } = useEvent(eventId)

  if (eventId === undefined) {
    return <></>
  }

  return <Fragment><Header title='Event'/>
    <Box component='main' sx={{
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
          <Button variant='contained' startIcon={<ArrowBack/>}
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
        </Typography>
        <EventForm event={event} errorMessages={errorMessages}/>
      </Paper>
    </Box>
  </Fragment>
}
