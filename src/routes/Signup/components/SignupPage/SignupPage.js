import React from 'react'
import { Link } from 'react-router-dom'
import GoogleButton from 'react-google-button'
import Paper from '@material-ui/core/Paper'
import { useFirebase } from 'react-redux-firebase'
import { makeStyles } from '@material-ui/core/styles'
import { LOGIN_PATH, RESET } from 'constants/paths'
import { useNotifications } from 'modules/notification'
import SignupForm from '../SignupForm'
import Grid from '@material-ui/core/Grid'
import styles from './SignupPage.styles'

const useStyles = makeStyles(styles)

function SignupPage() {
  const classes = useStyles()
  const firebase = useFirebase()
  const { showError } = useNotifications()

  const onSubmitFail = (formErrs, dispatch, err) =>
    showError(formErrs ? 'Form Invalid' : err.message || 'Error')
  const googleLogin = () =>
    firebase
      .login({ provider: 'google', type: 'popup' })
      .catch((err) => showError(err.message))
  const emailSignup = (creds) => {
    firebase
      .createUser(creds, {
        email: creds.email,
        ...creds
      })
      .then(() => {
        firebase.auth().currentUser.sendEmailVerification()
      })
      .catch((err) => {
        showError(err.message)
      })
  }

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item>
        <Paper className={classes.panel}>
          <SignupForm onSubmit={emailSignup} onSubmitFail={onSubmitFail} />
        </Paper>
      </Grid>
      <Grid item>
        <div className={classes.orLabel}>or</div>
      </Grid>
      <Grid item>
        <div className={classes.providers}>
          <GoogleButton onClick={googleLogin} data-test="google-auth-button" />
        </div>
      </Grid>
      <Grid item>
        <div className={classes.login}>
          <span className={classes.loginLabel}>Already have an account?</span>

          <Link className={classes.loginLink} to={LOGIN_PATH}>
            Login
          </Link>
        </div>
      </Grid>
      <Grid item>
        <div className={classes.login}>
          <span className={classes.loginLabel}>Forgot password ?</span>

          <Link className={classes.loginLink} to={RESET}>
            Reset account
          </Link>
        </div>
      </Grid>
    </Grid>
  )
}

export default SignupPage
