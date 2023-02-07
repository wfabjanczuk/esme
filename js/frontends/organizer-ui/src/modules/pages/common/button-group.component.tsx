import React from 'react'
import { Box } from '@mui/material'
import { styles } from './styles'

interface ButtonGroupProps {
  children: React.ReactNode
}

export const ButtonGroup = ({ children }: ButtonGroupProps): JSX.Element => <Box sx={styles.buttonGroup}>
  {children}
</Box>
