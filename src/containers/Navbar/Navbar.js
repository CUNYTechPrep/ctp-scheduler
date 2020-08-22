import React from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import { isLoaded, isEmpty } from 'react-redux-firebase'
import { LOGIN_PATH } from 'constants/paths'
import AccountMenu from './AccountMenu'
import styles from './Navbar.styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles(styles)

function Navbar() {
  const classes = useStyles()

  // Get auth from redux state
  const auth = useSelector((state) => state.firebase.auth)
  const authExists = isLoaded(auth) && !isEmpty(auth)

  return (
    <Toolbar className={classes.toolBar}>
      <div className={classes.title} data-label="Work In Progress">
        <Link to={LOGIN_PATH}>
          <div className={classes.card_container}>
            <Typography variant="h1" style={{ color: 'white' }}>
              Cuny Tech Interviews
            </Typography>
          </div>
        </Link>
      </div>
      <div className={classes.flex} />
      {authExists ? <AccountMenu /> : <> </>}
    </Toolbar>
  )
}

export default Navbar
