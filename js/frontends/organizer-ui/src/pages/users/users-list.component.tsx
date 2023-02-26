import React from 'react'
import { User, UserRoleLabels, useUsersList } from './user.entity'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { EditTableRowButton } from '../../common/edit-table-row-button.component'
import { styles } from '../../layout/styles'
import { Box } from '@mui/material'

const parseFullName = ({
  row: {
    firstName,
    lastName
  }
}: { row: User }): string => `${firstName} ${lastName}`
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
    renderCell: ({ id }: GridRenderCellParams) => <EditTableRowButton editUrl={`/users/${id}`}/>
  }
]

export const UsersList = (): JSX.Element => {
  const { list: users } = useUsersList()

  return <Box style={styles.tables.container}>
    <DataGrid
      rows={users}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      disableSelectionOnClick
    />
  </Box>
}
