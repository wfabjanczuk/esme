import { styles } from '../../layout/styles'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import React from 'react'
import { useEventsList } from './event.entity'
import { GridValueGetterParams } from '@mui/x-data-grid/models/params/gridCellParams'
import { utcdayjs } from '../../common/utils'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { EditTableRowButton } from '../../common/edit-table-row-button.component'
import { Box } from '@mui/material'

const parseDate = ({ value }: GridValueGetterParams<string>): string => utcdayjs(value).format('YYYY-MM-DD HH:mm')

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
    valueGetter: parseDate,
    width: 150
  },
  {
    field: 'timeEnd',
    headerName: 'Time end',
    valueGetter: parseDate,
    width: 150
  },
  {
    headerName: 'Actions',
    field: 'actions',
    type: 'actions',
    renderCell: ({ id }: GridRenderCellParams) => <EditTableRowButton editUrl={`/events/${id}`}/>
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
      disableSelectionOnClick
    />
  </Box>
}
