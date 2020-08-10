import React from 'react'
import { useSelector } from 'react-redux'
import { isLoaded, useFirebase } from 'react-redux-firebase'
import LoadingSpinner from 'components/LoadingSpinner'
import { useNotifications } from 'modules/notification'
import AccountForm from '../../AccountForm'
import ReadOnlyCalandar from 'components/ReadOnlyCalandar'
import { useFirebaseConnect } from 'react-redux-firebase'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
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
      path: '/open_appointments'
    }
  ])

  const open_appointments = useSelector(
    (state) => state.firebase.ordered.open_appointments
  )

  // Get profile from redux state
  const profile = useSelector((state) => state.firebase.profile)
  if (!isLoaded(profile) && !isLoaded(open_appointments)) {
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

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  if (!open_appointments) return <LoadingSpinner />
  const availability = open_appointments.flatMap(({ value }) =>
    value.map(({ startDate, endDate, ...rest }) => ({
      ...rest,
      startDate: moment(startDate).toDate(),
      endDate: moment(endDate).toDate()
    }))
  )
  const { confirmed_appointments } = profile
  const confirmedArray = Object.keys(confirmed_appointments || {}).map(
    (key) => confirmed_appointments[key]
  )
  return (
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example">
        <Tab label="Confirmed Appointments" {...a11yProps(0)} />
        <Tab label="Open Appointments" {...a11yProps(1)} />
        <Tab label="Account" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <ReadOnlyCalandar appointments={confirmedArray} readOnly />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ReadOnlyCalandar appointments={availability} />
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
