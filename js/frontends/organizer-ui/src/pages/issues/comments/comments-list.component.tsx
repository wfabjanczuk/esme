import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { TableRowLinkButton } from '../../../common/components/table-row-link-button.component'
import { Edit } from '@mui/icons-material'
import { Box } from '@mui/material'
import { styles } from '../../../layout/styles'
import React from 'react'
import { useCommentsList } from './comment.entity'

const columns = (issueId: number): Array<GridColDef | GridActionsColDef> => [
  {
    field: 'id',
    headerName: 'ID',
    width: 70
  },
  {
    field: 'content',
    headerName: 'Content',
    flex: 3,
    minWidth: 300
  },
  {
    headerName: 'Actions',
    field: 'actions',
    type: 'actions',
    renderCell: ({ id }: GridRenderCellParams) => <TableRowLinkButton
      label='Edit'
      url={`/issues/${issueId}/comments/${id}`}
      icon={<Edit/>}
    />
  }
]

interface CommentsListProps {
  issueId: number
}

export const CommentsList = ({ issueId }: CommentsListProps): JSX.Element => {
  const { list: comments } = useCommentsList(issueId)

  return <Box style={styles.tables.container}>
    <DataGrid
      rows={comments}
      columns={columns(issueId)}
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
