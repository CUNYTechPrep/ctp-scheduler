import React from 'react'
import Paper from '@material-ui/core/Paper'
import { useFirebase } from 'react-redux-firebase'
import { makeStyles } from '@material-ui/core/styles'
import { useNotifications } from 'modules/notification'
import SignupForm from '../ResetForm/index'
import Grid from '@material-ui/core/Grid'
import styles from './ResetPage.styles'

const useStyles = makeStyles(styles)

function SignupPage() {
  const classes = useStyles()
  const firebase = useFirebase()
  const { showError, showInfo } = useNotifications()

  const onSubmitFail = (formErrs, dispatch, err) =>
    showError(formErrs ? 'Form Invalid' : err.message || 'Error')

  const onSubmit = ({ email }) => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(function (user) {
        showInfo('Please check your email...')
      })
      .catch(function (e) {
        showError(e.message || 'Error')
      })
  }

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item>
        <br />
      </Grid>
      <Grid item>
        <Paper className={classes.panel}>
          <SignupForm onSubmit={onSubmit} onSubmitFail={onSubmitFail} />
        </Paper>
      </Grid>
    </Grid>
  )
}

export default SignupPage
