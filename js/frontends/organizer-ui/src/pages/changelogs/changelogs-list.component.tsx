import { styles } from '../../layout/styles'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import React from 'react'
import { parseDateTimeColumn } from '../../common/utils'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { Box } from '@mui/material'
import { Changelog, useChangelogsList } from './changelog.entity'
import { TableRowLinkButton } from '../../common/table-row-link-button.component'
import { Visibility } from '@mui/icons-material'

const parseEntity = ({
  row: {
    entityClass,
    entityId
  }
}: { row: Changelog }): string => `${entityClass} ${entityId}`

const columns: Array<GridColDef | GridActionsColDef> = [
  {
    field: 'id',
    headerName: 'ID',
    width: 70
  },
  {
    field: 'entity',
    headerName: 'Entity',
    valueGetter: parseEntity,
    width: 150
  },
  {
    field: 'type',
    headerName: 'Action',
    width: 70
  },
  {
    field: 'valueAfter',
    headerName: 'Value after',
    flex: 1,
    minWidth: 150
  },
  {
    field: 'userId',
    headerName: 'User ID',
    width: 70
  },
  {
    field: 'changedAt',
    headerName: 'Time',
    valueGetter: parseDateTimeColumn,
    width: 150
  },
  {
    headerName: 'Actions',
    field: 'actions',
    type: 'actions',
    renderCell: ({ id }: GridRenderCellParams) => <TableRowLinkButton
      label='Show'
      url={`/changelogs/${id}`}
      icon={<Visibility/>}
    />
  }
]

export const ChangelogsList = (): JSX.Element => {
  const { list: changelogs } = useChangelogsList()

  return <Box style={styles.tables.container}>
    <DataGrid
      rows={changelogs}
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
