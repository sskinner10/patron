import React from "react";

const ReviewTile = (props) => {

    const formatDate = () =>{    
        return new Date(props.createdAt).toDateString()
    }

    return (
        <div className="grid-x callout">
          <div className="cell grid-x">
            <h4 className="header-show-page cell small-9">{props.title}</h4>
            <span className="cell small-3">Experience: {props.rating}/5</span>
          </div>
          <div className="cell">
            <p>{props.body}</p>
          </div>
          <div className="cell">
            {formatDate()}
          </div>
        </div>
    )
}

export default ReviewTile

// reviewUserId={review.user_id}
        // title={review.title}
        // rating={review.rating}
        // heatIndex={review.heatIndex}
        // body={review.body}
        // createdAt={review.created_at}