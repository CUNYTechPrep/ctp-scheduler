import React from 'react'
import { useSelector } from 'react-redux'
import { isLoaded, useFirebase } from 'react-redux-firebase'
import LoadingSpinner from 'components/LoadingSpinner'
import { useNotifications } from 'modules/notification'
import AccountForm from '../../AccountForm'
import Calandar from 'components/Calandar'
//import OtherCal from '/Users/h10619/Desktop/Personal/Interviews/material/src/components/Calandar/OtherCal'
import ReadOnlyCalandar from 'components/ReadOnlyCalandar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

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

  // Get profile from redux state
  const profile = useSelector(state => state.firebase.profile)
  const auth = useSelector(state => state.firebase.auth)
  if (!isLoaded(profile)) {
    return <LoadingSpinner />
  }

  function updateAccount(newAccount) {
    return firebase
      .updateProfile(newAccount)
      .then(() => showSuccess('Profile updated successfully'))
      .catch(error => {
        console.error('Error updating profile', error.message || error) // eslint-disable-line no-console
        showError('Error updating profile: ', error.message || error)
        return Promise.reject(error)
      })
  }
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  function updateAvailability({ availability, appointment_intervals }) {
    const { uid } = auth
    firebase.remove(`open_appointments/${uid}`)
    firebase.remove(`pending_appointments/${uid}`)
    firebase.update(`open_appointments/${uid}`, appointment_intervals)
    return firebase
      .updateProfile({ availability })
      .then(() => showSuccess('Profile updated successfully'))
      .catch(error => {
        console.error('Error updating profile', error.message || error) // eslint-disable-line no-console
        showError('Error updating profile: ', error.message || error)
        return Promise.reject(error)
      })
  }
  const { confirmed_appointments } = profile
  const confirmedArray = Object.keys(confirmed_appointments || {}).map(
    key => confirmed_appointments[key]
  )
  const { availability } = profile
  return (
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example">
        <Tab label="Confirmed Appointments" {...a11yProps(0)} />
        <Tab label="Your Availability " {...a11yProps(1)} />
        <Tab label="Account" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <ReadOnlyCalandar appointments={confirmedArray} readOnly />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Calandar onSubmit={updateAvailability} availability={availability} />
      </TabPanel>
      <TabPanel value={value} index={2}>
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
