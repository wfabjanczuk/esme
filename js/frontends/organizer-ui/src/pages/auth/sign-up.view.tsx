import React, { FormEvent, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { styles } from '../common/styles'
import Paper from '@mui/material/Paper'
import { SignUpForm } from './sign-up.form'
import axios from 'axios'
import { Agency } from '../agency/agency'
import { config } from '../../root/config'
import { parseErrorMessage } from '../common/utils'
import { NavigateFunction, useNavigate } from 'react-router-dom'

export const SignUpView = (): JSX.Element => {
  const navigate = useNavigate()
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    void handleSubmitAsync(e, navigate, setErrorMessages)
  }

  return <Box sx={styles.root}>
    <Box component='main' sx={styles.background}>
      <Paper sx={{ ...styles.cardSm, maxWidth: '960px' }}>
        <Typography variant='h4' component='h1' sx={styles.header}>Register event agency</Typography>
        <SignUpForm handleSubmit={handleSubmit} errorMessages={errorMessages}/>
      </Paper>
    </Box>
  </Box>
}

const signUpUrl = `${config.apiUrl}/agency`

const handleSubmitAsync = async (
  e: FormEvent<HTMLFormElement>,
  navigate: NavigateFunction,
  setErrorMessages: (errorMessages: string[]) => void
): Promise<void> => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  const payload = {
    owner: getObjectFromFields(formData, ['email', 'password', 'confirmPassword', 'firstName', 'lastName', 'phoneNumber']),
    agency: getObjectFromFields(formData, ['name', 'address', 'website'])
  }

  await axios.post<Agency>(signUpUrl, payload)
    .then(r => navigate('/'))
    .catch(e => setErrorMessages(parseErrorMessage(e?.response?.data?.message)))
}

const getObjectFromFields = (formData: FormData, fields: string[]): Record<string, any> => {
  return fields.reduce<Record<string, any>>((o, f) => {
    o[f] = formData.get(f)
    return o
  }, {})
}
