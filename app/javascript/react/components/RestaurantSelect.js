import React, { useEffect, useRef, useState } from "react"
import _ from "lodash"

import ErrorDisplay from "./ErrorDisplay"
import { Redirect } from "react-router-dom"

const blankReviewForm = {
    title:"",
    rating:"",
    body:"",
    placeId:""
}

const RestaurantSelect = (props) => {
    const [newReview, setNewReview] = useState(blankReviewForm)
    const [errors, setErrors] = useState({})
    const [redirectUser, setRedirectUser] = useState(null)
    const autoCompleteRef = useRef();
    const inputRef = useRef();
    const options = {
        fields: ["place_id"]
    }

    useEffect(() => {
        autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
        )

        autoCompleteRef.current.addListener("place_changed", async function () {
            const place = await autoCompleteRef.current.getPlace()
            setNewReview({
                ...newReview,
                placeId: place.place_id
            })
        })
    }, [])

      
    const handleChange = (event) => {
        setNewReview ({
            ...newReview,
            [event.currentTarget.name]: event.currentTarget.value
        })
    }

    const validForSubmission = () => {
        let submitErrors = {}
        const requiredFields = ["title", "rating", "body", "placeId"]
        requiredFields.forEach(field => {
          if (newReview[field].trim() == "") {
            submitErrors = {
              ...submitErrors,
              [field]: "cannot be blank"
            }
          }
        })
        if (_.isEmpty(submitErrors)) {
          return true
        } 
        setErrors(submitErrors)
        return false
    }

    const handleFormSubmit = (event) => {
        event.preventDefault()

        const formData = {
          ...newReview,
          place_id: newReview.placeId,
        }

        if (validForSubmission()) {
          postReview(formData)
          setNewReview (blankReviewForm)
        }
    }

    const postReview = async (formPayload) =>{
        try {
            const response = await fetch(`/api/v1/reviews`, {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({review: formPayload})
            })
            if (!response.ok) {
            const errorMessage = `${response.status} (${response.status.text})`
            const error = new Error(errorMessage)
            throw(error)
            }
            const responseBody = await response.json()
            if (responseBody.user) {
              setRedirectUser(responseBody.user)
            } else if (responseBody.error[0] === "You need to be signed in first") {
              location.assign("/users/sign_in")
            }
        } catch(err) {
          console.log(`Error in fetch: ${err}`)
        }
  }

  if (redirectUser) {
      return <Redirect to={`/users/${redirectUser.id}`} />
  }

    return (
      <form onSubmit={handleFormSubmit}>
        <div className="grid-container show-page-margin">
          <div className="grid-x grid-margin-x">
            <div className="cell">
              <h4 className="header-show-page center-element">Add a New Experience</h4>
            </div>
            <div className="cell">
              <ErrorDisplay 
                errors={errors}
              />
            </div>
            <div className="cell">
              <label>Find the restaurant you want to review:
                <input className="" type="text" name="placeId" id="placeId"  ref={inputRef}/>
              </label>
            </div>
            <div className="cell">
              <label>
                Title:
                <input 
                  name="title"
                  id="title"
                  type="text"
                  onChange={handleChange}
                  value={newReview.title}
                />
              </label>
            </div>
            <div className="cell">
              <label>
                Rating:
                <input 
                  name="rating"
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="1"
                  onChange={handleChange}
                  value={newReview.rating}
                />
              </label>
            </div>
            <div className="cell">
              <label>
                Review:
                <input 
                  name="body"
                  id="body"
                  type="text"
                  onChange={handleChange}
                  value={newReview.body}
                />
              </label>
            </div>
            
            <input className="cell button" type="submit" value="Submit Review" />
          </div>
        </div>
      </form>
    )
}


export default RestaurantSelect