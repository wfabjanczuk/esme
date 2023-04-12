import React from 'react'
import { Box, Button, TextField } from '@mui/material'
import { FormErrors } from '../../../common/form-errors.component'
import { styles } from '../../../layout/styles'
import { Save, Visibility } from '@mui/icons-material'
import { ButtonGroup } from '../../../common/button-group.component'
import { useAdminAgency } from './agencies.hook'
import { AgencyApprovedSelect } from './agency-approved-select.component'

interface AdminAgencyFormProps {
  id: number
}

export const AdminAgencyForm = ({ id }: AdminAgencyFormProps): JSX.Element => {
  const {
    errorMessages,
    agency,
    verify
  } = useAdminAgency(id)
  const isError = errorMessages.length > 0

  if (agency === undefined) {
    return <FormErrors errorMessages={errorMessages}/>
  }

  return <form onSubmit={verify}>
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
        disabled
      />
      <TextField
        name='address'
        label='address'
        defaultValue={agency.address}
        error={isError}
        sx={styles.forms.field}
        disabled
      />
      <TextField
        name='website'
        label='website'
        defaultValue={agency.website}
        error={isError}
        sx={styles.forms.field}
        disabled
      />
      <AgencyApprovedSelect currentValue={agency.approved} isError={isError}/>
      <FormErrors errorMessages={errorMessages}/>
      <ButtonGroup>
        <Button type='submit' variant='contained' color='success' sx={styles.buttons.groupElement} startIcon={<Save/>}>
          Save
        </Button>
        <Button type='button' variant='contained' color='primary' sx={styles.buttons.groupElement} startIcon={<Visibility/>}>
          View data
        </Button>
      </ButtonGroup>
    </Box>
  </form>
}
