import React, { useState, useEffect } from "react";
import _ from "lodash";
import ReviewTile from "./ReviewTile";
import { Link } from "react-router-dom";

const UserShowPage = (props) => {
    const [user, setUser] = useState({})
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() =>{
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            const response = await fetch(`/api/v1/users/${props.match.params.id}`)
            if (!response.ok){
                const errorMessage = `${response.status} (${response.statusText})`
                const error = new Error (errorMessage)
                throw(error)
            }
            const userObject = await response.json()
            setUser(userObject.user)
            if (userObject.user.current_user) {
                setCurrentUser(userObject.user.current_user)
            }
        } catch (error){
            console.error(`Error in fetch: ${error.message}`)
        }
    }

    if (_.isEmpty(user)) {
        return null
    }

    const formatDate = () =>{    
        return new Date(user.created_at).toDateString()
    }

    let reviewTiles
    if (user.reviews.length != 0){
        reviewTiles = user.reviews.map((review) => {
            return (
                <div key={review.id}>
                    <ReviewTile
                        reviewUserId={review.user_id}
                        title={review.title}
                        rating={review.rating}
                        body={review.body}
                        createdAt={review.created_at}
                        name={review.place_name}
                        placeId={review.place_id}
                    />
                </div>
            )
        })
    } else {
        reviewTiles = <div className="center-element">No experiences yet...</div>
    }

    const userNewReview = () => {
        if (currentUser.id === user.id) {
            return (
                <Link to="/reviews/new">Add a New Experience</Link>
            )
        }
    } 

    return (
        <div className="grid-container show-page-margin">
          <div className="grid-x grid-margin-x">
              <div className="cell">
                <h4 className="header-show-page center-element">{user.patron_handle}</h4>
                <p className="center-element">Journey started: {formatDate()}</p>
                <p className="center-element">{userNewReview()}</p>
              </div>
              <div className="cell callout">
                {reviewTiles}
              </div>
            </div>
        </div>
    )
}

export default UserShowPage