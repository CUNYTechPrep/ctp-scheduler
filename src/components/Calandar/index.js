import Calandar from './Calandar.js'
import { connect } from 'react-redux'

const enhance = connect(
  // Map redux state to component props
  ({ firebase: { auth, profile } }) => ({
    auth,
    profile
  })
)

export default enhance(Calandar)
