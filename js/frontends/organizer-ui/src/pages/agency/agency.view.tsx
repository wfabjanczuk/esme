import React, { FormEvent, Fragment } from 'react'
import Header from '../../layout/header'
import Paper from '@mui/material/Paper'
import { Box, Typography } from '@mui/material'
import { UpdateAgencyPayload, useAgency } from './agency.hook'
import { AgencyForm } from './agency.form'
import { styles } from '../../common/styles'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'

export const AgencyView = (): JSX.Element => {
  const { agency, updateAgency, deleteAgency, errorMessages } = useAgency()

  const handleUpdate = (e: FormEvent<HTMLFormElement>): void => {
    void handleUpdateAsync(e, updateAgency)
  }
  const handleDelete = (): void => {
    void deleteAgency()
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
          agency={agency}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          errorMessages={errorMessages}
        />
      </Paper>
    </Box>
  </Fragment>
}

const handleUpdateAsync = async (
  e: FormEvent<HTMLFormElement>,
  updateAgency: (payload: UpdateAgencyPayload) => Promise<void>
): Promise<void> => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)

  await updateAgency({
    name: formData.get('name') as string,
    address: formData.get('address') as string,
    website: formData.get('website') as string
  })
}
