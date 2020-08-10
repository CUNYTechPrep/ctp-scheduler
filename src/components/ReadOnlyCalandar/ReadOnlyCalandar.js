import * as React from 'react'
import { ViewState } from '@devexpress/dx-react-scheduler'
import {
  Scheduler,
  DayView,
  Appointments,
  MonthView,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  TodayButton,
  AppointmentTooltip
} from '@devexpress/dx-react-scheduler-material-ui'
import { isLoaded, useFirebase } from 'react-redux-firebase'
import { withStyles, createStyles } from '@material-ui/core'
import { indigo, blue, teal } from '@material-ui/core/colors'
import Paper from '@material-ui/core/Paper'
import { fade } from '@material-ui/core/styles/colorManipulator'
import classNames from 'clsx'
import IconButton from '@material-ui/core/IconButton'
import MoreIcon from '@material-ui/icons/MoreVert'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import LoadingSpinner from 'components/LoadingSpinner'
import { useNotifications } from 'modules/notification'
import { useSelector } from 'react-redux'
import moment from 'moment'

const styles = ({ palette }) =>
  createStyles({
    appointment: {
      borderRadius: 0,
      borderBottom: 0
    },
    highPriorityAppointment: {
      borderLeft: `4px solid ${teal[500]}`
    },
    middlePriorityAppointment: {
      borderLeft: `4px solid ${blue[500]}`
    },
    lowPriorityAppointment: {
      borderLeft: `4px solid ${indigo[500]}`
    },
    weekEndCell: {
      backgroundColor: fade(palette.action.disabledBackground, 0.04),
      '&:hover': {
        backgroundColor: fade(palette.action.disabledBackground, 0.04)
      },
      '&:focus': {
        backgroundColor: fade(palette.action.disabledBackground, 0.04)
      }
    },
    weekEndDayScaleCell: {
      backgroundColor: fade(palette.action.disabledBackground, 0.06)
    },
    text: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    content: {
      opacity: 0.7
    },
    container: {
      width: '100%',
      lineHeight: 1.2,
      height: '100%'
    }
  })

const isWeekEnd = (date) =>
  new Date(date).getDay() === 0 || new Date(date).getDay() === 6
const defaultCurrentDate = new Date()

const DayScaleCell = withStyles(styles)(
  ({ startDate, classes, ...restProps }) => (
    <MonthView.DayScaleCell
      className={classNames({
        [classes.weekEndDayScaleCell]: isWeekEnd(startDate)
      })}
      startDate={startDate}
      {...restProps}
    />
  )
)

const TimeTableCell = withStyles(styles)(
  ({ startDate, classes, ...restProps }) => (
    <MonthView.TimeTableCell
      className={classNames({
        [classes.weekEndCell]: isWeekEnd(!startDate)
      })}
      startDate={startDate}
      {...restProps}
    />
  )
)

const Appointment = withStyles(styles)(({ classes, data, ...restProps }) => (
  <Appointments.Appointment
    {...restProps}
    className={classNames({
      [classes.highPriorityAppointment]: data.priority === 1,
      [classes.middlePriorityAppointment]: data.priority === 2,
      [classes.lowPriorityAppointment]: data.priority === 3,
      [classes.appointment]: true
    })}
    data={data}
  />
))

const AppointmentContent = withStyles(styles, { name: 'AppointmentContent' })(
  ({ classes, data, ...restProps }) => {
    return (
      <Appointments.AppointmentContent {...restProps} data={data}>
        <div className={classes.container}>
          <div className={classes.text}>{data.title}</div>
          <div className={classNames(classes.text, classes.content)}>
            Open Appointment
          </div>
          <div className={classNames(classes.text, classes.content)}></div>
        </div>
      </Appointments.AppointmentContent>
    )
  }
)

const style = ({ palette }) => ({
  icon: {
    color: palette.action.active
  },
  textCenter: {
    textAlign: 'center'
  },
  firstRoom: {},
  secondRoom: {},
  thirdRoom: {},
  header: {
    backgroundSize: 'cover'
  },
  commandButton: {
    backgroundColor: 'rgba(255,255,255,0.65)'
  }
})

const Header = withStyles(style, { name: 'Header' })(
  ({ children, appointmentData, classes, ...restProps }) => (
    <AppointmentTooltip.Header
      {...restProps}
      className={classNames(classes.header)}
      appointmentData={appointmentData}>
      <IconButton
        /* eslint-disable-next-line no-alert */
        onClick={() => alert(JSON.stringify(appointmentData))}
        className={classes.commandButton}>
        <MoreIcon />
      </IconButton>
    </AppointmentTooltip.Header>
  )
)

const CommandButton = withStyles(style, { name: 'CommandButton' })(
  ({ classes, ...restProps }) => {
    return (
      <AppointmentTooltip.CommandButton
        {...restProps}
        className={classes.commandButton}>
        here
      </AppointmentTooltip.CommandButton>
    )
  }
)

export default ({ appointments, readOnly }) => {
  const [visible, changeVisible] = React.useState(false)
  const toggleVisibility = () => {
    changeVisible(!visible)
  }

  const Content = withStyles(style, { name: 'Content' })(
    ({ children, appointmentData, classes, ...restProps }) => {
      const firebase = useFirebase()
      const { showSuccess, showError } = useNotifications()
      const { interviewer_uid } = appointmentData
      const auth = useSelector((state) => state.firebase.auth)
      const open_appointment = useSelector(
        (state) =>
          state.firebase.data.open_appointments[appointmentData.interviewer_uid]
      )
      const profile = useSelector((state) => state.firebase.profile)
      if (!isLoaded(profile && open_appointment)) {
        return <LoadingSpinner />
      }
      const onCLick = async () => {
        try {
          const remove_index = open_appointment.findIndex((elmt) =>
            elmt
              ? moment(elmt.startDate).isSame(moment(appointmentData.startDate))
              : null
          )
          if (remove_index === -1) throw Error('Item Not Found')
          await firebase.remove(
            `open_appointments/${interviewer_uid}/${remove_index}`
          )
          await firebase.push(`pending_appointments/${interviewer_uid}`, {
            student_info: {
              email: profile.email,
              firstName: profile.firstName,
              lastName: profile.lastName,
              uid: auth.uid
            },
            ...appointmentData
          })
          showSuccess('Appointment Request Processed')
        } catch (e) {
          showError(e.message)
        } finally {
          toggleVisibility()
        }
      }
      return (
        <AppointmentTooltip.Content
          {...restProps}
          appointmentData={appointmentData}>
          <Grid container alignItems="center">
            <Grid item className={classes.textCenter}>
              {!readOnly && (
                <Button fullWidth color="primary" onClick={onCLick}>
                  Request Confirmation
                </Button>
              )}
            </Grid>
          </Grid>
        </AppointmentTooltip.Content>
      )
    }
  )

  return (
    <Paper>
      <Scheduler data={appointments}>
        <ViewState defaultCurrentDate={defaultCurrentDate} />

        <MonthView
          dayScaleCellComponent={DayScaleCell}
          timeTableCellComponent={TimeTableCell}
        />
        <DayView />

        <Appointments
          appointmentComponent={Appointment}
          appointmentContentComponent={AppointmentContent}
        />
        <AppointmentTooltip
          headerComponent={Header}
          contentComponent={Content}
          visible={visible}
          onVisibilityChange={toggleVisibility}
          commandButtonComponent={CommandButton}
          showCloseButton
        />
        <Toolbar />
        <DateNavigator />
        <ViewSwitcher />
        <TodayButton />
      </Scheduler>
    </Paper>
  )
}
