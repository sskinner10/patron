import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import RestaurantRecommendation from './RestaurantRecommendation'
import RestaurantSelect from './RestaurantSelect'
import RestaurantShow from './RestaurantShow'
import UserShowPage from './UserShowPage'

export const App = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/reviews/new" component={RestaurantSelect} />
        <Route exact path="/users/:id" component={UserShowPage} />
        <Route exact path="/restaurants/recommendation" component={RestaurantRecommendation} />
        <Route exact path="/restaurants/:place_id" component={RestaurantShow} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
