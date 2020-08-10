import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Checkbox from '@material-ui/core/Checkbox'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import { useFirebase } from 'react-redux-firebase'
import { useNotifications } from 'modules/notification'
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  formControl: {
    margin: theme.spacing(3)
  }
}))

export default function CheckboxesGroup() {
  const firebase = useFirebase()
  const classes = useStyles()
  const { showInfo, showError } = useNotifications()
  const [Languages, setLang] = React.useState({
    Java: false,
    C: false,
    PHP: false,
    'C++': false,
    'C#': false,
    Go: false,
    Python: false,
    Swift: false,
    Clojure: false,
    JavaScript: false,
    Ruby: false,
    Haskell: false
  })

  const handleLangChange = (event) => {
    const updateState = {
      ...Languages,
      [event.target.name]: event.target.checked
    }
    setLang(updateState)
    const programming_languages = Object.keys(updateState).filter(
      (val) => updateState[val]
    )
    firebase
      .updateProfile({ programming_languages })
      .then(() => showInfo('Profile updated successfully'))
      .catch((error) => {
        console.error('Error updating profile', error.message || error) // eslint-disable-line no-console
        showError('Error updating profile: ', error.message || error)
        return Promise.reject(error)
      })
  }
  return (
    <Grid container justify="center" alignContent="center">
      <Grid item>
        <Card className={classes.root}>
          <div className={classes.root}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">
                WHAT PROGRAMMING LANGUAGES CAN YOU INTERVIEW IN?
              </FormLabel>
              <FormGroup>
                {Object.keys(Languages).map((lang) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Languages[lang]}
                        onChange={handleLangChange}
                        name={lang}
                      />
                    }
                    label={lang}
                  />
                ))}
              </FormGroup>
              <FormHelperText>Common Programming Languages</FormHelperText>
            </FormControl>
          </div>
        </Card>
      </Grid>
    </Grid>
  )
}
