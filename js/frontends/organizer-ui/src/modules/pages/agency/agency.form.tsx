import React from 'react'
import { Box, Button, TextField } from '@mui/material'
import { FormErrors } from '../common/form-errors.component'
import { Agency } from '../../api/agency/agency'
import { styles } from '../common/styles'

interface AgencyFormProps {
  agency?: Agency
  errorMessages: string[]
}

export const AgencyForm = ({ agency, errorMessages }: AgencyFormProps): JSX.Element => {
  if (agency === undefined) {
    return <FormErrors errorMessages={errorMessages}/>
  }

  const isError = errorMessages.length > 0

  return <form>
    <Box sx={styles.form}>
      <TextField
        type='number'
        name='id'
        label='id'
        defaultValue={agency.id}
        error={isError}
        sx={styles.formField}
        disabled
      />
      <TextField
        name='name'
        label='name'
        defaultValue={agency.name}
        error={isError}
        sx={styles.formField}
      />
      <TextField
        name='address'
        label='address'
        defaultValue={agency.address}
        error={isError}
        sx={styles.formField}
      />
      <TextField
        name='website'
        label='website'
        defaultValue={agency.website}
        error={isError}
        sx={styles.formField}
      />
      <TextField
        name='approved'
        label='approved'
        defaultValue={agency.approved ? 'true' : 'false'}
        error={isError}
        sx={styles.formField}
        disabled
      />
      <FormErrors errorMessages={errorMessages}/>
      <Box style={{ display: 'flex', gap: 40 }}>
        <Button type='submit' variant='contained' color='success' sx={styles.formButton}>Save</Button>
        <Button type='submit' variant='contained' color='error' sx={styles.formButton}>Delete</Button>
      </Box>
    </Box>
  </form>
}
