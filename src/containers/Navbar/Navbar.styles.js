export default () => ({
  flex: {
    flexGrow: 1
  },
  appBar: {
    // backgroundColor: theme.palette.primary1Color // Update this to change navbar color
    backgroundColor: 'none'
  },
  toolBar: {
    backgroundColor: 'rgba(32, 32, 32, 0.85)'
  },
  signIn: {
    color: 'white',
    textDecoration: 'none',
    alignSelf: 'center'
  },
  title: {
    borderRadius: '1rem',
    boxShadow: '4px 4px 15px rgba(#000, 0.15)',
    position: 'relative',
    color: 'white',
    '&::after': {
      transform: 'rotate(15deg)',
      position: 'absolute',
      content: 'attr(data-label)',
      top: '0px',
      right: '-14px',
      padding: '0.5rem',
      background: 'rgb(66, 133, 244)',
      color: 'white',
      textAlign: 'center',
      boxShadow: '4px 4px 15px rgba(26, 35, 126, 0.2)'
    }
  },
  card_container: {
    padding: '2rem',
    width: '100%',
    height: '100%',
    borderRadius: '1rem',
    position: 'relative'
  },
  card__card__header: {
    marginBottom: '1rem',
    fontFamily: "'Playfair Display', serif"
  },
  card__card__body: { fontFamily: "'Roboto', sans-serif" },

  span: {}
})
