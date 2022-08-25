import React from "react";
import { Link } from "react-router-dom";

const ReviewTile = (props) => {

    const formatDate = () =>{    
        return new Date(props.createdAt).toDateString()
    }
    
    let linkToDisplay
    if (props.name) {
      linkToDisplay = <Link to={`/restaurants/${props.placeId}`}>{props.name}</Link>
    } else if (props.patronHandle) {
      linkToDisplay = <Link to={`/users/${props.userId}`}>{props.patronHandle}</Link>
    }

    return (
        <div className="grid-x callout">
          <div className="cell grid-x review-tile-head">
            <h4 className="header-show-page cell small-9">{props.title}</h4>
            <div className="cell small-3 center-element">
              {linkToDisplay}
            </div>
          </div>
          <div className="cell">
            <p>{props.body}</p>
          </div>
          <div className="cell small-6">
            {formatDate()}
          </div>
          <div className="cell small-6">
            Experience: {props.rating}/5
          </div>
        </div>
    )
}

export default ReviewTile