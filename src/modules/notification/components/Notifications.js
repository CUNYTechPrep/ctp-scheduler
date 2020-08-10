import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import WarningIcon from '@material-ui/icons/Warning'
import InfoIcon from '@material-ui/icons/Info'
import Button from '@material-ui/core/Button'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import classNames from 'classnames'
import * as actions from '../actions'

const useStyles = makeStyles(theme => ({
  buttonRoot: {
    color: 'white'
  },
  success: {
    backgroundColor: theme.palette.success
      ? theme.palette.success.dark
      : theme.palette.primary.light
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: theme.palette.warning
      ? theme.palette.warning.dark
      : theme.palette.primary.light
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
}))
const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
}

export const TRANSITION_DELAY = 150

export const TRANSITION_DOWN_DURATION = 200

const getTransitionStyles = (offset, anchorOrigin) => ({
  [anchorOrigin.vertical]: offset,
  WebKitTransition: `all ${TRANSITION_DOWN_DURATION}ms`,
  MozTransition: `all ${TRANSITION_DOWN_DURATION}ms`,
  msTransition: `all ${TRANSITION_DOWN_DURATION}ms`,
  OTransition: `all ${TRANSITION_DOWN_DURATION}ms`,
  transition: `all ${TRANSITION_DOWN_DURATION}ms`,
  transitionDelay: `${TRANSITION_DELAY}ms`
})
function Notifications({ allIds, byId, dismissNotification }) {
  const classes = useStyles()

  // Only render if notifications exist
  if (!allIds || !Object.keys(allIds).length) {
    return null
  }

  return (
    <div>
      {allIds.map((id, i) => {
        const { type, message, action } = byId[id]
        const vertical = 'top',
          horizontal = 'left',
          Icon = variantIcon[type]
        return (
          <Snackbar
            key={id}
            open
            className={classNames(classes[type])}
            anchorOrigin={{
              vertical,
              horizontal
            }}
            style={{
              margin: 30,
              ...getTransitionStyles(80 * i + 64, {
                vertical,
                horizontal
              })
            }}>
            <SnackbarContent
              className={classNames(classes[type])}
              aria-describedby="client-snackbar"
              message={
                <span id="client-snackbar" className={classes.message}>
                  <Icon
                    className={classNames(classes.icon, classes.iconVariant)}
                  />
                  {message}
                </span>
              }
              action={[
                <div key="actions">
                  {action && (
                    <Button
                      key="notification.action"
                      color="inherit"
                      onClick={action.callback}>
                      {action.label}
                    </Button>
                  )}
                  <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={() => dismissNotification(id)}>
                    <CloseIcon key="close.button" className={classes.icon} />
                  </IconButton>
                </div>
              ]}
            />
          </Snackbar>
        )
      })}
    </div>
  )
}

Notifications.propTypes = {
  allIds: PropTypes.array.isRequired,
  byId: PropTypes.object.isRequired,
  dismissNotification: PropTypes.func.isRequired
}

export default connect(
  ({ notifications: { allIds, byId } }) => ({ allIds, byId }),
  actions
)(Notifications)
