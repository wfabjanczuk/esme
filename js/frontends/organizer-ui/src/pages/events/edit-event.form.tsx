import { Box, Button, TextField } from '@mui/material'
import { styles } from '../../common/styles'
import { FormErrors } from '../../common/form-errors.component'
import { DeleteForever, Save } from '@mui/icons-material'
import React from 'react'
import { utcdayjs } from '../../common/utils'
import { useEditEvent } from './hooks'

interface EditEventFormProps {
  id: number
}

export const EditEventForm = ({ id }: EditEventFormProps): JSX.Element => {
  const { errorMessages, entity, update, remove } = useEditEvent(id)
  const isError = errorMessages.length > 0

  if (entity === undefined) {
    return <></>
  }

  return <form onSubmit={update}>
    <Box sx={styles.form}>
      <TextField
        type='number'
        name='id'
        label='id'
        defaultValue={entity.id}
        sx={styles.formField}
        disabled
      />
      <TextField
        name='name'
        label='name'
        defaultValue={entity.name}
        error={isError}
        sx={styles.formField}
      />
      <TextField
        name='description'
        label='description'
        defaultValue={entity.description}
        error={isError}
        sx={styles.formField}
        multiline
      />
      <TextField
        name='address'
        label='address'
        defaultValue={entity.address}
        error={isError}
        sx={styles.formField}
        multiline
      />
      <TextField
        type='datetime-local'
        name='timeStart'
        label='start time'
        defaultValue={utcdayjs(entity.timeStart).format('YYYY-MM-DDTHH:mm')}
        error={isError}
        sx={styles.formField}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        type='datetime-local'
        name='timeEnd'
        label='end time'
        defaultValue={utcdayjs(entity.timeEnd).format('YYYY-MM-DDTHH:mm')}
        error={isError}
        sx={styles.formField}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        type='number'
        inputProps={{ step: 'any' }}
        name='lat'
        label='latitude'
        defaultValue={entity.lat}
        sx={styles.formField}
      />
      <TextField
        type='number'
        inputProps={{ step: 'any' }}
        name='lng'
        label='longitude'
        defaultValue={entity.lng}
        sx={styles.formField}
      />
      <FormErrors errorMessages={errorMessages}/>
      <Box style={{
        display: 'flex',
        gap: 40
      }}>
        <Button type='submit' variant='contained' color='success' sx={styles.buttonGroupElement}
          startIcon={<Save/>}
        >
          Save
        </Button>
        <Button type='button' variant='contained' color='error' sx={styles.buttonGroupElement}
          onClick={remove}
          startIcon={<DeleteForever/>}>
          Delete
        </Button>
      </Box>
    </Box>
  </form>
}
