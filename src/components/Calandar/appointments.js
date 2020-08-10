import moment from 'moment'
export const appointments = [
  {
    title: 'Website Re-Design Plan',
    startDate: moment()
      .startOf('day')
      .toDate(),
    endDate: moment()
      .startOf('day')
      .add(1, 'hour')
      .toDate(),
    id: 0,
    location: 'Room 1'
  }
]
