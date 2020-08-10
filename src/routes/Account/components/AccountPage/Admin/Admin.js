import React from 'react'
import { useSelector } from 'react-redux'
import { isLoaded, useFirebase, useFirebaseConnect } from 'react-redux-firebase'
import LoadingSpinner from 'components/LoadingSpinner'
import { useNotifications } from 'modules/notification'
import AccountForm from '../../AccountForm'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  CardActions
} from '@material-ui/core/'
import moment from 'moment'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

function AccountPage() {
  const firebase = useFirebase()
  const { showSuccess, showError } = useNotifications()
  const [value, setValue] = React.useState(0)

  useFirebaseConnect(() => [
    {
      path: '/pending_appointments'
    }
  ])
  // Get profile from redux state
  const profile = useSelector((state) => state.firebase.profile)
  const pending_appointments = useSelector(
    (state) => state.firebase.ordered.pending_appointments
  )
  if (!isLoaded(profile && pending_appointments)) {
    return <LoadingSpinner />
  }

  function updateAccount(newAccount) {
    return firebase
      .updateProfile(newAccount)
      .then(() => showSuccess('Profile updated successfully'))
      .catch((error) => {
        console.error('Error updating profile', error.message || error) // eslint-disable-line no-console
        showError('Error updating profile: ', error.message || error)
        return Promise.reject(error)
      })
  }

  const onConfirm = (data) => (e) => {
    const { interviewer_uid, student_info } = data
    firebase.push(`users/${interviewer_uid}/confirmed_appointments`, {
      ...data
    })
    firebase.push(`users/${student_info.uid}/confirmed_appointments`, {
      ...data
    })
    firebase.remove(`pending_appointments/${interviewer_uid}/${data.key}`)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  let arr = []
  if (pending_appointments) {
    arr = pending_appointments.flatMap(({ value }) =>
      Object.keys(value).map((key) => ({ ...value[key], key }))
    )
  }
  return (
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example">
        <Tab label="Pending Appointments" {...a11yProps(0)} />
        <Tab label="Account" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start">
          {pending_appointments &&
            arr.map((elmt) => (
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardHeader />
                  <CardContent>
                    {/* {JSON.stringify(elmt)} */}
                    <Typography gutterBottom variant="h5" component="h2">
                      Interview Time
                      <br></br>
                      {moment(elmt.startDate).format('HH:MM DD/MM/YYY')}-
                      <br></br>
                      {moment(elmt.endDate).format('HH:MM DD/MM/YYY')}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h2">
                      Interviewer
                      <br />
                      {elmt.firstName} {elmt.lastName}
                      {elmt.email}
                    </Typography>
                    <Typography></Typography>
                    <Typography
                      variant="h5"
                      color="textSecondary"
                      component="p">
                      Student info
                      <br />
                      {/* {JSON.stringify(elmt.student_info)} */}
                      {elmt.student_info.firstName}{' '}
                      {/* {JSON.stringify(elmt.student_info)} */}
                      {elmt.student_info.lastName}
                      <br />
                      {elmt.student_info.email}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <Button onClick={onConfirm(elmt)}>
                      Confirm Appointment
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AccountForm
          onSubmit={updateAccount}
          account={profile}
          initialValues={profile}
        />
      </TabPanel>
    </div>
  )
}

export default AccountPage
