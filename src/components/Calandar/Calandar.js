/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-unused-state */
import React from 'react'
import Paper from '@material-ui/core/Paper'
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler'
import {
  Scheduler,
  Toolbar,
  MonthView,
  WeekView,
  ViewSwitcher,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  DragDropProvider,
  EditRecurrenceMenu,
  AllDayPanel
} from '@devexpress/dx-react-scheduler-material-ui'
import moment from 'moment'
import { connectProps } from '@devexpress/dx-react-core'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import AppointmentFormContainer from './components/AppointmentForm/AppointmentForm.js'

const styles = (theme) => ({
  addButton: {
    position: 'absolute',
    bottom: theme.spacing(1) * 3,
    right: theme.spacing(1) * 4
  }
})

/* eslint-disable-next-line react/no-multi-comp */
class Demo extends React.PureComponent {
  constructor(props) {
    super(props)
    const { availability } = props
    this.state = {
      data: availability || [],
      currentDate: new Date(),
      confirmationVisible: false,
      editingFormVisible: false,
      deletedAppointmentId: undefined,
      editingAppointment: undefined,
      previousAppointment: undefined,
      addedAppointment: {},
      startDayHour: 9,
      endDayHour: 19,
      isNewAppointment: false
    }

    this.toggleConfirmationVisible = this.toggleConfirmationVisible.bind(this)
    this.commitDeletedAppointment = this.commitDeletedAppointment.bind(this)
    this.toggleEditingFormVisibility = this.toggleEditingFormVisibility.bind(
      this
    )

    this.commitChanges = this.commitChanges.bind(this)
    this.onEditingAppointmentChange = this.onEditingAppointmentChange.bind(this)
    this.onAddedAppointmentChange = this.onAddedAppointmentChange.bind(this)
    this.appointmentForm = connectProps(AppointmentFormContainer, () => {
      const {
        editingFormVisible,
        editingAppointment,
        data,
        addedAppointment,
        isNewAppointment,
        previousAppointment
      } = this.state

      const currentAppointment =
        data.filter(
          (appointment) =>
            editingAppointment && appointment.id === editingAppointment.id
        )[0] || addedAppointment
      const cancelAppointment = () => {
        if (isNewAppointment) {
          this.setState({
            editingAppointment: previousAppointment,
            isNewAppointment: false
          })
        }
      }

      return {
        visible: editingFormVisible,
        appointmentData: currentAppointment,
        commitChanges: this.commitChanges,
        visibleChange: this.toggleEditingFormVisibility,
        onEditingAppointmentChange: this.onEditingAppointmentChange,
        cancelAppointment
      }
    })
  }

  componentDidUpdate() {
    this.appointmentForm.update()
  }

  onEditingAppointmentChange(editingAppointment) {
    this.setState({ editingAppointment })
  }

  onAddedAppointmentChange(addedAppointment) {
    this.setState({ addedAppointment })
    const { editingAppointment } = this.state
    if (editingAppointment !== undefined) {
      this.setState({
        previousAppointment: editingAppointment
      })
    }
    this.setState({ editingAppointment: undefined, isNewAppointment: true })
  }

  setDeletedAppointmentId(id) {
    this.setState({ deletedAppointmentId: id })
  }

  toggleEditingFormVisibility() {
    const { editingFormVisible } = this.state
    this.setState({
      editingFormVisible: !editingFormVisible
    })
  }

  toggleConfirmationVisible() {
    const { confirmationVisible } = this.state
    this.setState({ confirmationVisible: !confirmationVisible })
  }

  commitDeletedAppointment() {
    this.setState((state) => {
      const { data, deletedAppointmentId } = state
      const nextData = data.filter(
        (appointment) => appointment.id !== deletedAppointmentId
      )

      return { data: nextData, deletedAppointmentId: null }
    })
    this.toggleConfirmationVisible()
  }

  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      let { data } = state
      if (added) {
        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0
        data = [...data, { id: startingAddedId, ...added }]
      }
      if (changed) {
        data = data.map((appointment) => {
          if (!changed[appointment.id]) return appointment
          delete changed[appointment.id].allDay
          return changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        })
      }

      let elmtArray = []
      const { profile, auth } = this.props
      data.forEach(({ startDate, endDate }, idx) => {
        if (idx === deleted) return
        let runner = moment(startDate)
        const momentEnd = moment(endDate)
        const {
          firstName,
          email,
          lastName,
          displayName,
          confirmed_appointments
        } = profile
        const confirmedArray = Object.keys(confirmed_appointments || {}).map(
          (key) => confirmed_appointments[key]
        )

        while (runner.isBefore(momentEnd)) {
          const start = runner.clone()
          const end = runner.clone().add(1, 'hour')
          if (
            !confirmedArray.find(
              (elmt) => elmt.startDate === start.toISOString()
            )
          ) {
            elmtArray.push({
              firstName: firstName ? firstName : displayName,
              lastName: lastName ? lastName : '',
              email,
              interviewer_uid: auth.uid,
              startDate: start.toDate(),
              endDate: end.toDate()
            })
          }
          runner = runner.clone().add(1, 'hour')
        }
      })
      if (deleted !== undefined) {
        this.setDeletedAppointmentId(deleted)
        this.toggleConfirmationVisible()
        data.splice(deleted, 1)
      }
      this.props.onSubmit({
        availability: data,
        appointment_intervals: elmtArray
      })
      return { data }
    })
  }

  render() {
    const {
      currentDate,
      data,
      confirmationVisible,
      editingFormVisible,
      startDayHour,
      endDayHour
    } = this.state
    const { classes } = this.props

    return (
      <Paper>
        <Scheduler data={data} height={660}>
          <ViewState currentDate={currentDate} />
          <EditingState
            onCommitChanges={this.commitChanges}
            onEditingAppointmentChange={this.onEditingAppointmentChange}
            onAddedAppointmentChange={this.onAddedAppointmentChange}
          />
          <WeekView startDayHour={startDayHour} endDayHour={endDayHour} />
          <MonthView />
          <AllDayPanel />
          <EditRecurrenceMenu />
          <Appointments />
          <AppointmentTooltip showOpenButton showCloseButton showDeleteButton />
          <Toolbar />
          <ViewSwitcher />
          <AppointmentForm
            overlayComponent={this.appointmentForm}
            visible={editingFormVisible}
            onVisibilityChange={this.toggleEditingFormVisibility}
          />
          <DragDropProvider />
        </Scheduler>

        <Dialog open={confirmationVisible} onClose={this.cancelDelete}>
          <DialogTitle>Delete Appointment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this appointment?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.toggleConfirmationVisible}
              color="primary"
              variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={this.commitDeletedAppointment}
              color="secondary"
              variant="outlined">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Fab
          color="secondary"
          className={classes.addButton}
          onClick={() => {
            this.setState({ editingFormVisible: true })
            this.onEditingAppointmentChange(undefined)
            this.onAddedAppointmentChange({
              startDate: new Date(currentDate).setHours(startDayHour),
              endDate: new Date(currentDate).setHours(startDayHour + 1)
            })
          }}>
          <AddIcon />
        </Fab>
      </Paper>
    )
  }
}

export default withStyles(styles, { name: 'EditingDemo' })(Demo)
