import { styles } from '../../layout/styles'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import React from 'react'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { Box } from '@mui/material'
import { TableRowLinkButton } from '../../common/components/table-row-link-button.component'
import { Edit } from '@mui/icons-material'
import { useAdminUsersList } from './admin-user.hook'
import { User, UserRoleLabels } from '../users/user.entity'

const parseRole = ({ row: { role } }: { row: User }): string => UserRoleLabels[role]
const parseFullName = ({
  row: {
    firstName,
    lastName
  }
}: { row: User }): string => `${firstName} ${lastName}`

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
    renderCell: ({ id }: GridRenderCellParams) => <TableRowLinkButton
      label='Edit'
      url={`/admin/users/${id}`}
      icon={<Edit/>}
    />
  }
]

export const AdminUsersList = (): JSX.Element => {
  const { list: adminUsers } = useAdminUsersList()

  return <Box style={styles.tables.container}>
    <DataGrid
      rows={adminUsers}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      initialState={{
        sorting: {
          sortModel: [{
            field: 'id',
            sort: 'desc'
          }]
        }
      }}
      disableSelectionOnClick
    />
  </Box>
}
