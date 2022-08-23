import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import RestaurantSelect from './RestaurantSelect'
import UserShowPage from './UserShowPage'

export const App = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/reviews/new" component={RestaurantSelect} />
        <Route exact path="/users/:id" component={UserShowPage} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
