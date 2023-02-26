import { Box, Button } from '@mui/material'
import { styles } from '../layout/styles'
import { NavLink } from 'react-router-dom'
import { Add } from '@mui/icons-material'
import React from 'react'

interface TableFooterProps {
  entityName: string
  addUrl: string
}

export const TableFooter = ({ entityName, addUrl }: TableFooterProps): JSX.Element => {
  return <Box sx={styles.tables.footer}>
    <NavLink to={addUrl} style={styles.links.component}>
      <Button variant='contained' color='primary' startIcon={<Add/>} sx={styles.buttons.footerElement}>
        Add {entityName}
      </Button>
    </NavLink>
  </Box>
}
