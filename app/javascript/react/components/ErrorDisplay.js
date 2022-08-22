import React from "react";
import _ from 'lodash'

const ErrorDisplay = (props) => {
    const errorKeys = Object.keys(props.errors)
    if (errorKeys.length > 0) {
      let index = 0
      const listItems = errorKeys.map(field => {
        index++
        let titleString = _.startCase(field).replace(/([A-Z])/g, ' $1').trim()
        return (
          <li key={index}>
            {titleString} {props.errors[field]}
          </li>
        )
      })
      return (
        <div className="callout alert">
          <ul>{listItems}</ul>
        </div>
      )
    } else {
      return ""
    }
}

export default ErrorDisplay