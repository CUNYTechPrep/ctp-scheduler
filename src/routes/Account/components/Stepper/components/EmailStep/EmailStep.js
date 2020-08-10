import Button from "@material-ui/core/Button";
import { useFirebase } from "react-redux-firebase";
import { useNotifications } from "modules/notification";
import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import useStyles from "./Email.styles";
import { Grid } from "@material-ui/core";
import { useSelector } from 'react-redux'
import image from 'static/email.jpg'


const Step1 = () => {
  const firebase = useFirebase();
  const { showError, showSuccess } = useNotifications();
        const profile = useSelector(state => state.firebase.profile)

  const classes = useStyles();

  const onClick = () => {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        showSuccess("Link Resent");
      })
      .catch((err) => {
        showError(err.message);
      });
  };

  return (
    <Grid container justify="center" alignContent="center">
      <Grid item>
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={image}
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="h1" component="h2">
                Email Confirmation
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                We have sent an email to <span style={{ fontWeight: 'bold'}}> {profile.email} </span> to confirm the vality of your email address. 
                After reciving the email follow the link provided to complete the registration. 
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button fullWidth color="primary" variant="contained" onClick={onClick}>
              Resend Link
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Step1;
