import React, { FormEvent } from 'react'
import { Box, Button, TextField } from '@mui/material'
import { FormErrors } from '../../common/form-errors.component'
import { Agency } from './agency'
import { styles } from '../../common/styles'
import { DeleteForever, Save } from '@mui/icons-material'

interface AgencyFormProps {
  agency?: Agency
  handleUpdate: (e: FormEvent<HTMLFormElement>) => void
  handleRemove: () => void
  errorMessages: string[]
}

export const AgencyForm = ({
  agency,
  handleUpdate,
  handleRemove,
  errorMessages
}: AgencyFormProps): JSX.Element => {
  if (agency === undefined) {
    return <FormErrors errorMessages={errorMessages}/>
  }

  const isError = errorMessages.length > 0

  return <form onSubmit={handleUpdate}>
    <Box sx={styles.form}>
      <TextField
        type='number'
        name='id'
        label='id'
        defaultValue={agency.id}
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
        sx={styles.formField}
        disabled
      />
      <FormErrors errorMessages={errorMessages}/>
      <Box style={{
        display: 'flex',
        gap: 40
      }}>
        <Button type='submit' variant='contained' color='success' sx={styles.buttonGroupElement} startIcon={<Save/>}>
          Save
        </Button>
        <Button type='button' onClick={handleRemove} variant='contained' color='error' sx={styles.buttonGroupElement}
          startIcon={<DeleteForever/>}>
          Delete
        </Button>
      </Box>
    </Box>
  </form>
}
