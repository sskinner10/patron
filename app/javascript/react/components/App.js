import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import RestaurantSelect from './RestaurantSelect'

export const App = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/reviews/new" component={RestaurantSelect} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
