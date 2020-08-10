import React from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import { isLoaded, isEmpty } from 'react-redux-firebase'
import { LOGIN_PATH } from 'constants/paths'
import AccountMenu from './AccountMenu'
import styles from './Navbar.styles'

const useStyles = makeStyles(styles)

function Navbar() {
  const classes = useStyles()

  // Get auth from redux state
  const auth = useSelector(state => state.firebase.auth)
  const authExists = isLoaded(auth) && !isEmpty(auth)

  return (
    <Toolbar className={classes.toolBar}>
      <nav className="navbar navbar-dark navbar-expand-md ">
        <a href="/" className="navbar-brand">
          CUNY Tech Prep Interviews
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
            </li>
            <li className="nav-item">
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#program-news">
              </a>
            </li>
            <li className="nav-item">
            </li>
          </ul>
        </div>
      </nav>
      <div className={classes.flex} />
      {authExists ? (
        <AccountMenu />
      ) : (
        <Button
          className={classes.signIn}
          component={Link}
          to={LOGIN_PATH}
          data-test="sign-in">
          Sign In
        </Button>
      )}
    </Toolbar>
  )
}

export default Navbar
