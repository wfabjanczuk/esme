import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { TableRowLinkButton } from '../../../common/components/table-row-link-button.component'
import { Edit } from '@mui/icons-material'
import { Box } from '@mui/material'
import { styles } from '../../../layout/styles'
import React from 'react'
import { useContactsList } from './contact.entity'
import { User } from '../../users/user.entity'

const parseFullName = ({
  row: {
    firstName,
    lastName
  }
}: { row: User }): string => `${firstName} ${lastName}`

const columns = (eventId: number): Array<GridColDef | GridActionsColDef> => [
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
    headerName: 'Actions',
    field: 'actions',
    type: 'actions',
    renderCell: ({ id }: GridRenderCellParams) => <TableRowLinkButton
      label='Edit'
      url={`/events/${eventId}/contacts/${id}`}
      icon={<Edit/>}
    />
  }
]

interface ContactsListProps {
  eventId: number
}

export const ContactsList = ({ eventId }: ContactsListProps): JSX.Element => {
  const { list: contacts } = useContactsList(eventId)

  return <Box style={styles.tables.container}>
    <DataGrid
      rows={contacts}
      columns={columns(eventId)}
      pageSize={5}
      rowsPerPageOptions={[5]}
      initialState={{
        sorting: {
          sortModel: [{ field: 'id', sort: 'desc' }]
        }
      }}
      disableSelectionOnClick
    />
  </Box>
}
