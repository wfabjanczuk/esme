import { styles } from '../../layout/styles'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import React from 'react'
import { useEventsList } from './event.entity'
import { parseDateTimeColumn } from '../../common/utils'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { TableRowLinkButton } from '../../common/components/table-row-link-button.component'
import { Box } from '@mui/material'
import { Edit } from '@mui/icons-material'

const columns: Array<GridColDef | GridActionsColDef> = [
  {
    field: 'id',
    headerName: 'ID',
    width: 70
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 2,
    minWidth: 200
  },
  {
    field: 'address',
    headerName: 'Address',
    flex: 3,
    minWidth: 300
  },
  {
    field: 'timeStart',
    headerName: 'Time start',
    valueGetter: parseDateTimeColumn,
    width: 150
  },
  {
    field: 'timeEnd',
    headerName: 'Time end',
    valueGetter: parseDateTimeColumn,
    width: 150
  },
  {
    headerName: 'Actions',
    field: 'actions',
    type: 'actions',
    renderCell: ({ id }: GridRenderCellParams) => <TableRowLinkButton
      label='Edit'
      url={`/events/${id}`}
      icon={<Edit/>}
    />
  }
]

export const EventsList = (): JSX.Element => {
  const { list: events } = useEventsList()

  return <Box style={styles.tables.container}>
    <DataGrid
      rows={events}
      columns={columns}
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
