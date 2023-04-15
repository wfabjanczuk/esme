import { Box, Button } from '@mui/material'
import { styles } from '../../layout/styles'
import { NavLink } from 'react-router-dom'
import { Add } from '@mui/icons-material'
import React from 'react'

interface CardFooterProps {
  redirectUrl?: string
  redirectLabel?: string
}

export const CardFooter = ({ redirectLabel, redirectUrl }: CardFooterProps): JSX.Element => {
  return <Box sx={styles.tables.footer}>
    {redirectUrl === undefined
      ? <></>
      : <NavLink to={redirectUrl} style={styles.links.component}>
        <Button variant='contained' color='primary' startIcon={<Add/>} sx={styles.buttons.footerElement}>
          {redirectLabel}
        </Button>
      </NavLink>
    }
  </Box>
}
