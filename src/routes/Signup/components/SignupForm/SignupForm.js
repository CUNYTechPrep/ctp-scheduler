import React from "react";
import PropTypes from "prop-types";
import { Field } from "redux-form";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "components/FormTextField";
import { required, validateEmail } from "utils/form";
import styles from "./SignupForm.styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(styles);

function SignupForm({ pristine, submitting, handleSubmit }) {
  const classes = useStyles();

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <form className={classes.root} onSubmit={handleSubmit}>
        <Grid item>
          <Field
            name="firstName"
            component={TextField}
            autoComplete="firstName"
            label="First Name"
            validate={required}
          />
        </Grid>
        <Grid item>
          <Field
            name="lastName"
            component={TextField}
            autoComplete="lastName"
            label="Last Name"
            validate={required}
          />
        </Grid>
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
          <Field
            name="password"
            component={TextField}
            autoComplete="current-password"
            label="Password"
            type="password"
            validate={required}
          />
        </Grid>
        <Grid item>
          <div className={classes.submit}>
            <Button
              color="primary"
              type="submit"
              variant="contained"
              disabled={pristine || submitting}
            >
              {submitting ? "Loading" : "Sign Up"}
            </Button>
          </div>
        </Grid>
      </form>
    </Grid>
  );
}

SignupForm.propTypes = {
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm - calls onSubmit)
};

export default SignupForm;
