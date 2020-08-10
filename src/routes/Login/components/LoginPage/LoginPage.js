import React from "react";
import { Link } from "react-router-dom";
import GoogleButton from "react-google-button";
import { useFirebase } from "react-redux-firebase";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { SIGNUP_PATH } from "constants/paths";
import { useNotifications } from "modules/notification";
import LoginForm from "../LoginForm";
import styles from "./LoginPage.styles";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(styles);

function LoginPage() {
  const classes = useStyles();
  const firebase = useFirebase();
  const { showError } = useNotifications();

  const onSubmitFail = (formErrs, dispatch, err) =>
    showError(formErrs ? "Form Invalid" : err.message || "Error");
  const googleLogin = () =>
    firebase
      .login({ provider: "google", type: "popup" })
      .catch((err) => showError(err.message));
  const emailLogin = (creds) =>
    firebase.login(creds).catch((err) => showError(err.message));

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={8} lg={8}  className={classes.image} />
      <Grid item xs={12} sm={8} md={4} lg={4} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Paper className={classes.panel}>
            <LoginForm onSubmit={emailLogin} onSubmitFail={onSubmitFail} />
          </Paper>
          <div className={classes.orLabel}>or</div>
          <div className={classes.providers}>
            <GoogleButton
              onClick={googleLogin}
              data-test="google-auth-button"
            />
          </div>
          <div className={classes.signup}>
            <span className={classes.signupLabel}>Need an account?</span>
            <Link className={classes.signupLink} to={SIGNUP_PATH}>
              Sign Up
            </Link>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default LoginPage;
