/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-unused-state */
import React from 'react'
import { AppointmentForm } from '@devexpress/dx-react-scheduler-material-ui'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import CalendarToday from '@material-ui/icons/CalendarToday'
import containerStyles from './AppointmentForm.styles.js'
import { KeyboardDateTimePicker } from '@material-ui/pickers'

class AppointmentFormContainerBasic extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      appointmentChanges: {}
    }

    this.getAppointmentData = () => {
      const { appointmentData } = this.props
      return appointmentData
    }
    this.getAppointmentChanges = () => {
      const { appointmentChanges } = this.state
      return appointmentChanges
    }

    this.changeAppointment = this.changeAppointment.bind(this)
    this.commitAppointment = this.commitAppointment.bind(this)
  }

  changeAppointment({ field, changes }) {
    const nextChanges = {
      ...this.getAppointmentChanges(),
      [field]: changes
    }
    this.setState({
      appointmentChanges: nextChanges
    })
  }

  commitAppointment(type) {
    const { commitChanges } = this.props
    const appointment = {
      ...this.getAppointmentData(),
      ...this.getAppointmentChanges()
    }
    delete appointment.title
    if (type === 'deleted') {
      commitChanges({ [type]: appointment.id })
    } else if (type === 'changed') {
      commitChanges({ [type]: { [appointment.id]: appointment } })
    } else {
      commitChanges({ [type]: appointment })
    }
    this.setState({
      appointmentChanges: {}
    })
  }

  render() {
    const {
      classes,
      visible,
      visibleChange,
      appointmentData,
      cancelAppointment,
      target,
      onHide
    } = this.props
    const { appointmentChanges } = this.state

    const displayAppointmentData = {
      ...appointmentData,
      ...appointmentChanges
    }

    const isNewAppointment = appointmentData.id === undefined
    const applyChanges = isNewAppointment
      ? () => this.commitAppointment('added')
      : () => this.commitAppointment('changed')

    const pickerEditorProps = (field) => ({
      className: classes.picker,
      keyboard: true,
      ampm: true,
      value: new Date(displayAppointmentData[field]),
      onChange: (date) =>
        this.changeAppointment({
          field: [field],
          changes: new Date(displayAppointmentData[field])
        }),
      inputVariant: 'outlined',
      onError: () => null
    })

    const cancelChanges = () => {
      this.setState({
        appointmentChanges: {}
      })
      visibleChange()
      cancelAppointment()
    }
    return (
      <AppointmentForm.Overlay
        visible={visible}
        target={target}
        fullSize
        onHide={onHide}>
        <div>
          <div className={classes.header}>
            <IconButton className={classes.closeButton} onClick={cancelChanges}>
              <Close color="action" />
            </IconButton>
          </div>
          <div className={classes.content}>
            <div className={classes.wrapper}></div>
            <div className={classes.wrapper}>
              <CalendarToday className={classes.icon} color="action" />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  label="Start Date"
                  {...pickerEditorProps('startDate')}
                />
                <KeyboardDateTimePicker
                  label="End Date"
                  {...pickerEditorProps('endDate')}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className={classes.wrapper}></div>
            <div className={classes.wrapper}></div>
          </div>
          <div className={classes.buttonGroup}>
            {!isNewAppointment && (
              <Button
                variant="outlined"
                color="secondary"
                className={classes.button}
                onClick={() => {
                  visibleChange()
                  this.commitAppointment('deleted')
                }}>
                Delete
              </Button>
            )}
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={() => {
                visibleChange()
                applyChanges()
              }}>
              {isNewAppointment ? 'Create' : 'Save'}
            </Button>
          </div>
        </div>
      </AppointmentForm.Overlay>
    )
  }
}

const AppointmentFormContainer = withStyles(containerStyles, {
  name: 'AppointmentFormContainer'
})(AppointmentFormContainerBasic)

export default AppointmentFormContainer
