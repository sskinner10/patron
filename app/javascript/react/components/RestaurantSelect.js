import React, { useEffect, useRef, useState } from "react"
import _ from "lodash"

import ErrorDisplay from "./ErrorDisplay"

const blankReviewForm = {
    title:"",
    rating:"",
    body:"",
    place:""
}

const RestaurantSelect = (props) => {
    const [newReview, setNewReview] = useState(blankReviewForm)
    const [errors, setErrors] = useState({})
    const autoCompleteRef = useRef();
    const inputRef = useRef();
    const options = {
        fields: ["place_id", "name"]
    }
  
    useEffect(() => {
        autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
        )

        autoCompleteRef.current.addListener("place_changed", async function () {
            const place = await autoCompleteRef.current.getPlace();
            setNewReview({
                ...newReview,
                place: place.place_id
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
        const requiredFields = ["title", "rating", "body", "place"]
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
        
        if (validForSubmission()) {
          postReview(newReview)
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
            const reviewObject = await response.json()
  
            if (reviewObject.review) {
                appendNewReview(reviewObject.review)
            } else if (reviewObject.error) {
                setErrors({'error: ': reviewObject.error})
            }
        } catch(err) {
          console.log(`Error in fetch: ${err}`)
        }
  }

    return (
      <form onSubmit={handleFormSubmit}>
        <ErrorDisplay 
          errors={errors}
        />
        <div>
          <label>Find the restaurant you want to review:
            <input ref={inputRef}/>
          </label>
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
        
        <input className="button" type="submit" value="Submit Review" />
      </form>
    )
}


export default RestaurantSelect