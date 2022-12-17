import React, { FormEvent } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { Form } from 'react-router-dom'
import { Config } from '../config/config'
import axios from 'axios'

const styles = {
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    overflow: 'auto'
  },
  card: {
    boxSizing: 'border-box',
    width: '300px',
    textAlign: 'center',
    my: 4
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  element: {
    my: 2
  }
}

export const SigninView = (): JSX.Element => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = Object.fromEntries(formData)
    void axios.post(`${Config.apiUrl}/users/signin`, payload, { withCredentials: true }).then(r => console.log(r))
  }

  return <Box sx={styles.root}>
    <Box sx={styles.card}>
      <Typography variant='h2' component='h1' sx={styles.element}>Organizer</Typography>
      <Form onSubmit={handleSubmit}>
        <Box sx={styles.form}>
          <TextField name='email' label='email' sx={styles.element}/>
          <Button type='submit' variant='outlined' sx={styles.element}>Sign in</Button>
        </Box>
      </Form>
    </Box>
  </Box>
}
