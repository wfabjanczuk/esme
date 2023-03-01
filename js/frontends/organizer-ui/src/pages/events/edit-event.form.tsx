import { Box, Button, TextField } from '@mui/material'
import { styles } from '../../layout/styles'
import { FormErrors } from '../../common/form-errors.component'
import { DeleteForever, Save } from '@mui/icons-material'
import React from 'react'
import { parseDateTimeValue } from '../../common/utils'
import { useEditEvent } from './event.entity'

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
    <Box sx={styles.forms.component}>
      <TextField
        type='number'
        name='id'
        label='id'
        defaultValue={entity.id}
        sx={styles.forms.field}
        disabled
      />
      <TextField
        name='name'
        label='name'
        defaultValue={entity.name}
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='description'
        label='description'
        defaultValue={entity.description}
        error={isError}
        sx={styles.forms.field}
        multiline
      />
      <TextField
        name='address'
        label='address'
        defaultValue={entity.address}
        error={isError}
        sx={styles.forms.field}
        multiline
      />
      <TextField
        type='datetime-local'
        name='timeStart'
        label='start time'
        defaultValue={parseDateTimeValue(entity.timeStart)}
        error={isError}
        sx={styles.forms.field}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        type='datetime-local'
        name='timeEnd'
        label='end time'
        defaultValue={parseDateTimeValue(entity.timeEnd)}
        error={isError}
        sx={styles.forms.field}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        type='number'
        inputProps={{ step: 'any' }}
        name='lat'
        label='latitude'
        defaultValue={entity.lat}
        sx={styles.forms.field}
      />
      <TextField
        type='number'
        inputProps={{ step: 'any' }}
        name='lng'
        label='longitude'
        defaultValue={entity.lng}
        sx={styles.forms.field}
      />
      <FormErrors errorMessages={errorMessages}/>
      <Box style={styles.buttons.group}>
        <Button type='submit' variant='contained' color='success' sx={styles.buttons.groupElement}
          startIcon={<Save/>}
        >
          Save
        </Button>
        <Button type='button' variant='contained' color='error' sx={styles.buttons.groupElement}
          onClick={remove}
          startIcon={<DeleteForever/>}>
          Delete
        </Button>
      </Box>
    </Box>
  </form>
}
