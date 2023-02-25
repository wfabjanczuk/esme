import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box, Button, Typography } from '@mui/material'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import Paper from '@mui/material/Paper'
import { styles } from '../../common/styles'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { Add, Edit } from '@mui/icons-material'
import { NavLink } from 'react-router-dom'
import { GridRowId } from '@mui/x-data-grid/models/gridRows'
import { User, UserRoleLabels, useUsersList } from './user.entity'

const linkStyle = {
  color: 'inherit',
  textDecoration: 'inherit',
  width: '100%'
}

const parseFullName = ({ row: { firstName, lastName } }: { row: User }): string => `${firstName} ${lastName}`
const parseRole = ({ row: { role } }: { row: User }): string => UserRoleLabels[role]

const columns: Array<GridColDef | GridActionsColDef> = [
  {
    field: 'id',
    headerName: 'ID',
    width: 70
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    valueGetter: parseFullName,
    flex: 1,
    minWidth: 150
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
    minWidth: 150
  },
  {
    field: 'phoneNumber',
    headerName: 'Phone number',
    flex: 1,
    minWidth: 150
  },
  {
    field: 'role',
    headerName: 'Role',
    valueGetter: parseRole,
    flex: 1,
    minWidth: 150
  },
  {
    headerName: 'Actions',
    field: 'actions',
    type: 'actions',
    renderCell: ({ id }: GridRenderCellParams) => <EditButton id={id}/>
  }
]

interface EditButtonProps {
  id: GridRowId
}

const EditButton = ({ id }: EditButtonProps): JSX.Element => {
  return <NavLink to={`/users/${id}`} style={linkStyle}>
    <Button color='primary' startIcon={<Edit/>} sx={{ width: '100%' }}>
      Edit
    </Button>
  </NavLink>
}

export const UsersView = (): JSX.Element => {
  const { list: users } = useUsersList()

  return <Fragment>
    <Header title='Users'/>
    <Box component='main' sx={{
      flex: 1,
      py: 2,
      px: 4,
      backgroundColor: '#eaeff1'
    }}>
      <AlertBar maxWidth='1500px'/>
      <Paper sx={{
        maxWidth: '1500px',
        margin: 'auto',
        overflow: 'hidden',
        px: 4,
        py: 2
      }}>
        <Typography component='h2' variant='h5' sx={styles.header}>Browse users</Typography>
        <div style={{
          height: 400,
          width: '100%'
        }}>
          <DataGrid
            rows={users}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </div>
        <Box sx={{ mt: 3, mb: 2 }}>
          <NavLink to={'/users/add'} style={linkStyle}>
            <Button variant='contained' color='primary' startIcon={<Add/>} sx={{ width: '200px' }}>
              Add user
            </Button>
          </NavLink>
        </Box>
      </Paper>
    </Box>
  </Fragment>
}
