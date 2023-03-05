import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { TableRowLinkButton } from '../../../common/table-row-link-button.component'
import { Edit } from '@mui/icons-material'
import { Box } from '@mui/material'
import { styles } from '../../../layout/styles'
import React from 'react'
import { useAnnouncementsList } from './announcement.entity'
import { parseDateTimeColumn } from '../../../common/utils'

const columns = (eventId: number): Array<GridColDef | GridActionsColDef> => [
  {
    field: 'id',
    headerName: 'ID',
    width: 70
  },
  {
    field: 'sentAt',
    headerName: 'Published',
    valueGetter: parseDateTimeColumn,
    width: 150
  },
  {
    field: 'content',
    headerName: 'Content',
    flex: 1,
    minWidth: 150
  },
  {
    headerName: 'Actions',
    field: 'actions',
    type: 'actions',
    renderCell: ({ id }: GridRenderCellParams) => <TableRowLinkButton
      label='Edit'
      url={`/events/${eventId}/announcements/${id}`}
      icon={<Edit/>}
    />
  }
]

interface AnnouncementsListProps {
  eventId: number
}

export const AnnouncementsList = ({ eventId }: AnnouncementsListProps): JSX.Element => {
  const { list: announcements } = useAnnouncementsList(eventId)

  return <Box style={styles.tables.container}>
    <DataGrid
      rows={announcements}
      columns={columns(eventId)}
      pageSize={5}
      rowsPerPageOptions={[5]}
      disableSelectionOnClick
    />
  </Box>
}
