import React from 'react'
import { Box } from '@mui/material'

interface ButtonGroupProps {
  children: React.ReactNode
}

export const ButtonGroup = ({ children }: ButtonGroupProps): JSX.Element => <Box sx={{
  display: 'flex',
  gap: '30px'
}}>
  {children}
</Box>
