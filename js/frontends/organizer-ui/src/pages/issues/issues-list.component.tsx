import { styles } from '../../layout/styles'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import React from 'react'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { TableRowLinkButton } from '../../common/table-row-link-button.component'
import { Box } from '@mui/material'
import { Edit } from '@mui/icons-material'
import { Issue, IssuePriorityLabels, IssueStatusLabels, useIssuesList } from './issue.entity'

const parsePriority = ({ row: { priority } }: { row: Issue }): string => IssuePriorityLabels[priority]
const parseStatus = ({ row: { status } }: { row: Issue }): string => IssueStatusLabels[status]

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
    field: 'description',
    headerName: 'Description',
    flex: 3,
    minWidth: 300
  },
  {
    field: 'priority',
    headerName: 'Priority',
    valueGetter: parsePriority,
    width: 100
  },
  {
    field: 'status',
    headerName: 'Status',
    valueGetter: parseStatus,
    width: 100
  },
  {
    headerName: 'Actions',
    field: 'actions',
    type: 'actions',
    renderCell: ({ id }: GridRenderCellParams) => <TableRowLinkButton
      label='Edit'
      url={`/issues/${id}`}
      icon={<Edit/>}
    />
  }
]

export const IssuesList = (): JSX.Element => {
  const { list: issues } = useIssuesList()

  return <Box style={styles.tables.container}>
    <DataGrid
      rows={issues}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      disableSelectionOnClick
    />
  </Box>
}
