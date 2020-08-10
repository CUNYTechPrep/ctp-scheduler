import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import CoreLayout from '../layouts/CoreLayout'
import LoginRoute from './Login'
import SignupRoute from './Signup'
import AccountRoute from './Account'

export default function createRoutes(store) {
  return (
    <CoreLayout>
      <Switch>
        {/* <Route exact path={Home.path} component={() => <Home.component />} /> */}
        {
          /* Build Route components from routeSettings */
          [
            AccountRoute,
            SignupRoute,
            LoginRoute
            /* Add More Routes Here */
          ].map((settings, index) => (
            <Route key={`Route-${index}`} {...settings} />
          ))
        }
        {/* <Route component={NotFoundRoute.component} /> */}
        <Redirect from="*" to="/login" />
      </Switch>
    </CoreLayout>
  )
}
