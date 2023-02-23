import React, { FormEvent, Fragment } from 'react'
import Header from '../../layout/header'
import Paper from '@mui/material/Paper'
import { Box, Typography } from '@mui/material'
import { useAgency } from './agency.hook'
import { AgencyForm } from './agency.form'
import { styles } from '../../common/styles'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'

export const EditAgencyView = (): JSX.Element => {
  const { errorMessages, agency, updateAgency, removeAgency } = useAgency()

  const handleUpdate = (e: FormEvent<HTMLFormElement>): void => {
    void handleUpdateAsync(e, updateAgency)
  }
  const handleRemove = (): void => {
    void removeAgency()
  }

  return <Fragment>
    <Header title='Agency'/>
    <Box component='main' sx={{ flex: 1, py: 2, px: 4, backgroundColor: '#eaeff1' }}>
      <AlertBar maxWidth='936px'/>
      <Paper sx={{
        maxWidth: '936px',
        margin: 'auto',
        overflow: 'hidden',
        px: 4,
        py: 2
      }}>
        <Typography component='h2' variant='h5' sx={styles.header}>Edit agency</Typography>
        <AgencyForm
          errorMessages={errorMessages}
          agency={agency}
          handleUpdate={handleUpdate}
          handleRemove={handleRemove}
        />
      </Paper>
    </Box>
  </Fragment>
}

const handleUpdateAsync = async (
  e: FormEvent<HTMLFormElement>,
  updateAgency: (payload: Object) => Promise<void>
): Promise<void> => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  const payload = Object.fromEntries(formData)

  await updateAgency(payload)
}
