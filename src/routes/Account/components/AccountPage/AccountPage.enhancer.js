import { UserIsAuthenticated } from 'utils/router'
import React from 'react'
import { connect } from 'react-redux'
import USER_STATE from 'constants/users_states'
import Unverifyed from '../Stepper'
import InReview from './InReview'
import { CircularProgress } from '@material-ui/core'

const UserStateSwitch = (Volunteer, Student, Admin) => {
  return UserIsAuthenticated(
    connect(state => ({profile: state.firebase.profile, auth: state.firebase.auth}))(
      ({profile, auth})=> {
      const { account_type } =profile 
      const {emailVerified} = auth
      if(!profile.isLoaded) return <CircularProgress/>
      if(!emailVerified) return <Unverifyed/>
      switch (account_type) {
        case USER_STATE.VOLUENTEER:
          return <Volunteer />
        case USER_STATE.STUDENT:
          return <Student />
        case USER_STATE.ADMIN:
          return <Admin />
        default:
          return <InReview/> 
      }
    })
  )
}

export default UserStateSwitch // redirect to /login if user is not authenticated
