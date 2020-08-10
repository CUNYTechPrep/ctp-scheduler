import React from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import { isLoaded, useFirebase } from 'react-redux-firebase'
import LoadingSpinner from 'components/LoadingSpinner'
import { useNotifications } from 'modules/notification'
import defaultUserImageUrl from 'static/User.png'
import AccountForm from '../AccountForm'
import styles from './AccountPage.styles'
import Calandar from 'components/Calandar'
import { Container } from '@material-ui/core'
//import OtherCal from '/Users/h10619/Desktop/Personal/Interviews/material/src/components/Calandar/OtherCal'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import TextField from 'components/FormTextField'
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

const useStyles = makeStyles(styles)

function AccountPage() {
  const classes = useStyles()
  const firebase = useFirebase()
  const { showSuccess, showError } = useNotifications()
  const [value, setValue] = React.useState(0)

  // Get profile from redux state
  const profile = useSelector(state => state.firebase.auth)
  if (!isLoaded(profile)) {
    return <LoadingSpinner />
  }

  function updateAccount(newAccount) {
    return firebase
      .updateProfile(newAccount)
      .then(() => showSuccess('Profile updated successfully'))
      .catch(error => {
        showError('Error updating profile: ', error.message || error)
        return Promise.reject(error)
      })
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

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
      <TabPanel value={value} index={0}></TabPanel>
      <TabPanel value={value} index={1}>
        <Calandar onSubmit={updateAccount} />
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
