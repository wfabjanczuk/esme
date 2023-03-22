import React from 'react'
import { Box, Button, TextField } from '@mui/material'
import { FormErrors } from '../../common/form-errors.component'
import { styles } from '../../layout/styles'
import { DeleteForever, Save } from '@mui/icons-material'
import { useEditAgency } from './agency.hook'
import { ButtonGroup } from '../../common/button-group.component'

export const AgencyForm = (): JSX.Element => {
  const { errorMessages, agency, update, remove } = useEditAgency()
  const isError = errorMessages.length > 0

  if (agency === undefined) {
    return <FormErrors errorMessages={errorMessages}/>
  }

  return <form onSubmit={update}>
    <Box sx={styles.forms.column}>
      <TextField
        type='number'
        name='id'
        label='id'
        defaultValue={agency.id}
        sx={styles.forms.field}
        disabled
      />
      <TextField
        name='name'
        label='name'
        defaultValue={agency.name}
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='address'
        label='address'
        defaultValue={agency.address}
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='website'
        label='website'
        defaultValue={agency.website}
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='approved'
        label='approved'
        defaultValue={agency.approved ? 'true' : 'false'}
        sx={styles.forms.field}
        disabled
      />
      <FormErrors errorMessages={errorMessages}/>
      <ButtonGroup>
        <Button type='submit' variant='contained' color='success' sx={styles.buttons.groupElement} startIcon={<Save/>}>
          Save
        </Button>
        <Button type='button' onClick={remove} variant='contained' color='error' sx={styles.buttons.groupElement}
          startIcon={<DeleteForever/>}>
          Delete
        </Button>
      </ButtonGroup>
    </Box>
  </form>
}
