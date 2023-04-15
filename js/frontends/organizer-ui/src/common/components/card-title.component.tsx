import { styles } from '../../layout/styles'
import { NavLink } from 'react-router-dom'
import Button from '@mui/material/Button'
import { ArrowBack } from '@mui/icons-material'
import { Typography } from '@mui/material'
import React from 'react'

interface CardTitleProps {
  title: string
  redirectUrl?: string
  redirectLabel?: string
}

export const CardTitle = ({ title, redirectLabel, redirectUrl }: CardTitleProps): JSX.Element => {
  return <Typography component='h2' variant='h5' sx={styles.layout.editCardTitle}>
    {title}
    {redirectUrl === undefined
      ? <></>
      : <NavLink to={redirectUrl} style={styles.links.component}>
        <Button variant='contained' color='primary' startIcon={<ArrowBack/>}>
          {redirectLabel}
        </Button>
      </NavLink>
    }
  </Typography>
}
