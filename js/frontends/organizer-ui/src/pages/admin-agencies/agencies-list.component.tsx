import { styles } from '../../layout/styles'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import React from 'react'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { Box } from '@mui/material'
import { useAgenciesList } from './agencies.hook'
import { TableRowLinkButton } from '../../common/components/table-row-link-button.component'
import { Visibility } from '@mui/icons-material'

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
    field: 'approved',
    headerName: 'Approved',
    width: 150
  },
  {
    headerName: 'Actions',
    field: 'actions',
    type: 'actions',
    renderCell: ({ id }: GridRenderCellParams) => <TableRowLinkButton
      label='Show'
      url={`/admin/agencies/${id}`}
      icon={<Visibility/>}
    />
  }
]

export const AgenciesList = (): JSX.Element => {
  const { list: events } = useAgenciesList()

  return <Box style={styles.tables.container}>
    <DataGrid
      rows={events}
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
