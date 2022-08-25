import React, { useState, useEffect } from "react";
import _ from "lodash";

import ReviewTile from "./ReviewTile";

const RestaurantShow = (props) => {
    const [restaurantDetails, setRestaurantDetails] = useState({})
    const [restaurantReviews, setRestaurantReviews] = useState([])
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() =>{
        fetchRestaurant()
    }, [])

    const fetchRestaurant = async () => {
        try {
            const response = await fetch(`/api/v1/restaurants/${props.match.params.place_id}`)
            if (!response.ok){
                const errorMessage = `${response.status} (${response.statusText})`
                const error = new Error (errorMessage)
                throw(error)
            }
            const restaurantObject = await response.json()
            setRestaurantDetails(restaurantObject.details)
            setRestaurantReviews(restaurantObject.reviews.reviews)
            if (restaurantObject.current_user) {
                setCurrentUser(restaurantObject.current_user)
            }
        } catch (error){
            console.error(`Error in fetch: ${error.message}`)
        }
    }

    const reviewTiles = restaurantReviews.map((review) => {
        
        return (
            <div key={review.id}>
                <ReviewTile
                    reviewUserId={review.user_id}
                    title={review.title}
                    rating={review.rating}
                    body={review.body}
                    createdAt={review.created_at}
                    placeId={review.place_id}
                    userId={review.user_id}
                    patronHandle={review.user_handle}
                />
            </div>
        )
    })
    
    return (
        <div className="grid-container show-page-margin">
          <div className="grid-x grid-margin-x">
              <div className="cell">
                <h4 className="header-show-page center-element">{restaurantDetails.name}</h4>
              </div>
              <div className="cell callout">
                {reviewTiles}
              </div>
            </div>
        </div>
    )
}

export default RestaurantShow