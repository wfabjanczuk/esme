import { NavLink } from 'react-router-dom'
import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box, Typography } from '@mui/material'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import Paper from '@mui/material/Paper'
import { styles } from '../../common/styles'
import Button from '@mui/material/Button'
import { ArrowBack } from '@mui/icons-material'
import { CreateEventForm } from './create-event.form'

export const CreateEventView = (): JSX.Element => {
  return <Fragment>
    <Header title='Event'/>
    <Box component='main' sx={{
      flex: 1,
      py: 2,
      px: 4,
      backgroundColor: '#eaeff1'
    }}>
      <CreateEventCard/>
    </Box>
  </Fragment>
}

const linkStyle = {
  color: 'inherit',
  textDecoration: 'inherit'
}

const CreateEventCard = (): JSX.Element => {
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
        Add event
        <NavLink to={'/events/'} style={linkStyle}>
          <Button variant='contained' color='primary' startIcon={<ArrowBack/>}>
            Go to events list
          </Button>
        </NavLink>
      </Typography>
      <CreateEventForm/>
    </Paper>
  </Box>
}
