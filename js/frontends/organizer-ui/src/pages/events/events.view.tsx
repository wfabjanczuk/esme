import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box, Button, Typography } from '@mui/material'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import Paper from '@mui/material/Paper'
import { styles } from '../../common/styles'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { Add, Edit } from '@mui/icons-material'
import { NavLink } from 'react-router-dom'
import { GridRowId } from '@mui/x-data-grid/models/gridRows'
import { GridValueGetterParams } from '@mui/x-data-grid/models/params/gridCellParams'
import { useEventsList } from './event.entity'
import { utcdayjs } from '../../common/utils'

const linkStyle = {
  color: 'inherit',
  textDecoration: 'inherit',
  width: '100%'
}

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
    renderCell: ({ id }: GridRenderCellParams) => <EditButton id={id}/>
  }
]

interface EditButtonProps {
  id: GridRowId
}

const EditButton = ({ id }: EditButtonProps): JSX.Element => {
  return <NavLink to={`/events/${id}`} style={linkStyle}>
    <Button color='primary' startIcon={<Edit/>} sx={{ width: '100%' }}>
      Edit
    </Button>
  </NavLink>
}

export const EventsView = (): JSX.Element => {
  const { list: events } = useEventsList()

  return <Fragment>
    <Header title='Events'/>
    <Box component='main' sx={{
      flex: 1,
      py: 2,
      px: 4,
      backgroundColor: '#eaeff1'
    }}>
      <AlertBar maxWidth='1500px'/>
      <Paper sx={{
        maxWidth: '1500px',
        margin: 'auto',
        overflow: 'hidden',
        px: 4,
        py: 2
      }}>
        <Typography component='h2' variant='h5' sx={styles.header}>Browse events</Typography>
        <div style={{
          height: 400,
          width: '100%'
        }}>
          <DataGrid
            rows={events}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </div>
        <Box sx={{ mt: 3, mb: 2 }}>
          <NavLink to={'/events/add'} style={linkStyle}>
            <Button variant='contained' color='primary' startIcon={<Add/>} sx={{ width: '200px' }}>
              Add event
            </Button>
          </NavLink>
        </Box>
      </Paper>
    </Box>
  </Fragment>
}
