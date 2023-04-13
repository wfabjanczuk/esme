import React from 'react'
import { Box } from '@mui/material'
import { styles } from '../../layout/styles'

interface ButtonGroupProps {
  children: React.ReactNode
}

export const ButtonGroup = ({ children }: ButtonGroupProps): JSX.Element => <Box sx={styles.buttons.group}>
  {children}
</Box>
