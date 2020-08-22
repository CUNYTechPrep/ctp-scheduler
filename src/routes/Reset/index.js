import { Loadable } from 'utils/components'
import { RESET as path } from 'constants/paths'

export default {
  path,
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'Signup' */ './components/ResetPage')
  })
}
