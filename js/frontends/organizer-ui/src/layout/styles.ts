const card = {
  boxSizing: 'border-box',
  margin: 'auto',
  px: 4,
  py: 2,
  mb: 4
}

const title = {
  mt: 2,
  mb: 3
}

const layout = {
  root: {
    display: 'flex',
    minHeight: '100vh'
  },
  background: {
    flex: 1,
    py: 6,
    px: 4,
    backgroundColor: '#eaeff1'
  },
  cardSmall: {
    ...card,
    maxWidth: '480px'
  },
  cardMedium: {
    ...card,
    maxWidth: '960px'
  },
  cardLarge: {
    ...card,
    maxWidth: '1500px'
  },
  title,
  titleCenter: {
    ...title,
    textAlign: 'center'
  },
  editCardTitle: {
    ...title,
    display: 'flex',
    justifyContent: 'space-between'
  },
  placeholderText: {
    color: '#8393A0',
    fontStyle: 'italic',
    textAlign: 'center',
    margin: '10px 0'
  },
  content: {
    flex: 1,
    py: 2,
    px: 4,
    backgroundColor: '#eaeff1'
  },
  fullWidth: {
    width: '100%'
  }
}

const alertBar = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    left: '20px',
    right: '20px',
    margin: 'auto',
    maxWidth: '960px',
    zIndex: 10000
  },
  alert: {
    width: '960px',
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    my: 1
  }
}

const forms = {
  column: {
    display: 'flex',
    flexDirection: 'column'
  },
  field: {
    my: 1.5
  },
  fieldHidden: {
    display: 'none'
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    my: 1.5
  },
  doubleColumnContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    columnGap: '30px'
  },
  columnContainer: {
    maxWidth: '420px',
    flexGrow: 1
  }
}

const buttons = {
  single: {
    minWidth: '200px',
    maxWidth: '45%',
    my: 2
  },
  group: {
    display: 'flex',
    gap: '30px'
  },
  groupElement: {
    flexGrow: 1,
    my: 2
  },
  groupElementLink: {
    width: '100%',
    my: 2
  },
  footerElement: {
    width: '200px'
  }
}

const linkContainer = {
  color: 'inherit',
  textDecoration: 'inherit'
}

const links = {
  component: linkContainer,
  componentGrow: {
    ...linkContainer,
    flexGrow: 1
  },
  componentFull: {
    ...linkContainer,
    width: '100%'
  }
}

const tables = {
  container: {
    height: 400,
    width: '100%'
  },
  footer: {
    mt: 3,
    mb: 2
  }
}

export const styles = {
  layout,
  alertBar,
  forms,
  buttons,
  links,
  tables
}
