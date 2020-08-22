import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from 'components/FormTextField'
import { required, validateEmail } from 'utils/form'
import styles from './Reset.styles'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(styles)

function SignupForm({ pristine, submitting, handleSubmit }) {
  const classes = useStyles()

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <form className={classes.root} onSubmit={handleSubmit}>
        <Grid item>
          <Field
            name="email"
            component={TextField}
            autoComplete="email"
            label="Email"
            validate={[required, validateEmail]}
          />
        </Grid>
        <Grid item>
          <div className={classes.submit}>
            <Button
              color="primary"
              type="submit"
              variant="contained"
              disabled={pristine || submitting}>
              {submitting ? 'Loading' : 'Reset Account'}
            </Button>
          </div>
        </Grid>
      </form>
    </Grid>
  )
}

SignupForm.propTypes = {
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  handleSubmit: PropTypes.func.isRequired // from enhancer (reduxForm - calls onSubmit)
}

export default SignupForm
