import React, { FormEvent, useContext, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { styles } from '../../common/styles'
import Paper from '@mui/material/Paper'
import { SignUpForm } from './sign-up.form'
import axios from 'axios'
import { Agency } from '../agency/agency'
import { config } from '../../app/config'
import { parseErrorMessage } from '../../common/utils'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { AlertStore, AlertStoreContext } from '../../common/alert-bar/alert-store.context'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'

const signUpUrl = `${config.apiUrl}/agency`

export const SignUpView = (): JSX.Element => {
  const alertStore = useContext(AlertStoreContext)
  const navigate = useNavigate()
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    void handleSubmitAsync(e, navigate, setErrorMessages, alertStore)
  }

  return <Box sx={styles.root}>
    <Box component='main' sx={styles.background}>
      <AlertBar maxWidth='960px'/>
      <Paper sx={{ ...styles.card, maxWidth: '960px' }}>
        <Typography variant='h4' component='h1' sx={styles.header}>Register event agency</Typography>
        <SignUpForm handleSubmit={handleSubmit} errorMessages={errorMessages}/>
      </Paper>
    </Box>
  </Box>
}

const handleSubmitAsync = async (
  e: FormEvent<HTMLFormElement>,
  navigate: NavigateFunction,
  setErrorMessages: (errorMessages: string[]) => void,
  alertStore: AlertStore
): Promise<void> => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  const payload = {
    owner: recordFromFields(formData,
      ['email', 'password', 'confirmPassword', 'firstName', 'lastName', 'phoneNumber']
    ),
    agency: recordFromFields(formData,
      ['name', 'address', 'website']
    )
  }

  await axios.post<Agency>(signUpUrl, payload)
    .then(() => {
      navigate('/')
      alertStore.add('success', 'Agency successfully created')
    })
    .catch(e => setErrorMessages(parseErrorMessage(e?.response?.data?.message)))
}

const recordFromFields = (formData: FormData, fields: string[]): Record<string, any> => {
  return fields.reduce<Record<string, any>>((o, f) => {
    o[f] = formData.get(f)
    return o
  }, {})
}
