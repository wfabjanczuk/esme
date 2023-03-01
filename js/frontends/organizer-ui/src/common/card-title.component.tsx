import { styles } from '../layout/styles'
import { NavLink } from 'react-router-dom'
import Button from '@mui/material/Button'
import { ArrowBack } from '@mui/icons-material'
import { Typography } from '@mui/material'
import React from 'react'

interface CardTitleProps {
  title: string
  entityName: string
  listUrl: string
}

export const CardTitle = ({ title, entityName, listUrl }: CardTitleProps): JSX.Element => {
  return <Typography component='h2' variant='h5' sx={styles.layout.editCardTitle}>
    {title}
    <NavLink to={listUrl} style={styles.links.component}>
      <Button variant='contained' color='primary' startIcon={<ArrowBack/>}>
        Go to {entityName}s list
      </Button>
    </NavLink>
  </Typography>
}
