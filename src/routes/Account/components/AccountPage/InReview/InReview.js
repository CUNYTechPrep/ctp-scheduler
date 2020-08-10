import React from "react";
import { useFirebase } from "react-redux-firebase";
import { useNotifications } from "modules/notification";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import useStyles from "./InReview.styles";
import { Grid, Container } from "@material-ui/core";
import { useSelector } from "react-redux";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import AccountForm from '../../AccountForm'
import image from "static/review.jpg";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const InReview = () => {
  const classes = useStyles();
  const firebase = useFirebase();

  const profile = useSelector((state) => state.firebase.profile);
  const { showSuccess, showError } = useNotifications();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function updateAccount(newAccount) {
    return firebase
      .updateProfile(newAccount)
      .then(() => showSuccess("Profile updated successfully"))
      .catch((error) => {
        console.error("Error updating profile", error.message || error); // eslint-disable-line no-console
        showError("Error updating profile: ", error.message || error);
        return Promise.reject(error);
      });
  }
  const [value, setValue] = React.useState(0);

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
      >
        <Tab label="Confirmed Appointments" {...a11yProps(0)} />
        <Tab label="Account" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Container>
          <Grid
            spacing={3}
            direction="column"
            container
            justify="center"
            alignContent="center"
          >
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
                      Account In Review
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      If we need more information from you, we'll notify you by
                      email, on your account dashboard, and on your account
                      status page
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions></CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AccountForm
          onSubmit={updateAccount}
          account={profile}
          initialValues={profile}
        />
      </TabPanel>
    </>
  );
};

export default InReview;
