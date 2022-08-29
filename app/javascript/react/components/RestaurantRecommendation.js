import React, { useEffect, useState } from "react";

import DistanceSlider from "./DistanceSlider";
import ErrorDisplay from "./ErrorDisplay";
import RadioButton from "./RadioButton";

const blankRecommendation = {
    category: "",
    price: "",
    radius: 0,
    lat: null,
    lon: null
}

const RestaurantRecommendation = (props) => {
    const [errors, setErrors] = useState({})
    const [allCategories, setAllCategories] = useState([])
    const [filteredCategories, setFilteredCategories] = useState([])
    const [newRecommendation, setNewRecommendation] = useState(blankRecommendation)

    useEffect(() =>{
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await fetch(`/api/v1/categories`)
            if (!response.ok){
                const errorMessage = `${response.status} (${response.statusText})`
                const error = new Error (errorMessage)
                throw(error)
            }
            const categoriesArray = await response.json()
            setAllCategories(categoriesArray.categories)
            setFilteredCategories(
                categoriesArray.categories.map((category) => {
                    return <option value={category.alias} key={category.id}>{category.title}</option>
                })
            )
        } catch (error){
            console.error(`Error in fetch: ${error.message}`)
        }
    }

    const fetchRecommendation = async (formPayload) => {
        try {
            const response = await fetch(`/api/v1/recommendations`, {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({formPayload})
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

    const successGetLocation = (position) => {
        const coords = position.coords
        console.log(coords)
        setNewRecommendation({
            ...newRecommendation,
            lat: coords.latitude,
            lon: coords.longitude
        })
    }

    const errorGetLocation = (err) => {
        alert(`Error, please allow browser to find location then refresh page`);
    }

    const handleGetCoords = (event) => {
        event.preventDefault()
        navigator.geolocation.getCurrentPosition(successGetLocation, errorGetLocation, {maximumAge: 0})
    }

    const categoriesChangeHandler = (event) => {
        const searchTerm = event.currentTarget.value

        if (searchTerm !== '') {
            const results = allCategories.filter((category) => {
                return category.title.toLowerCase().includes(searchTerm.toLowerCase())
            })

            const categoriesList = results.map((category) => {
                return <option value={category.alias} key={category.id}>{category.title}</option>
            })

            setFilteredCategories(categoriesList)
        } else if (searchTerm === '') {
            const categoriesList = allCategories.map((category) => {
                return <option value={category.alias} key={category.id}>{category.title}</option>
            })

            setFilteredCategories(categoriesList)
        }
    }
    
    const validForSubmission = () => {
        let submitErrors = {}
        const requiredFields = ["category", "price"]
        requiredFields.forEach(field => {
            if (newRecommendation[field].trim() == "") {
                submitErrors = {
                    ...submitErrors,
                    [field]: "cannot be blank"
                }
            }
        })
        if (newRecommendation.lat === null && newRecommendation.lon === null) {
            setErrors({
                ...submitErrors,
                geolocation: "error, please allow the browser to find your location"
            })
            return false
        } else if (_.isEmpty(submitErrors)) {
          return true
        } 
        setErrors(submitErrors)
        return false
    }

    const handleCategorySelect = (event) => {
        setNewRecommendation({
            ...newRecommendation,
            category: event.currentTarget.value
        })
    }

    const handleRadioChange = (event) => {
        setNewRecommendation({
            ...newRecommendation,
            price: event.currentTarget.value
        })
    }

    const handleDistanceChange = (event) => {
        setNewRecommendation({
            ...newRecommendation,
            radius: event.currentTarget.value
        })
    }

    const handleFormSubmit = (event) => {
        event.preventDefault()
        
        if(validForSubmission()) {
            fetchRecommendation(newRecommendation)
            setNewRecommendation(blankRecommendation)
        }
        
    }

    return (
      <form onSubmit={handleFormSubmit}>
        <div className="grid-container show-page-margin">
          <div className="grid-x grid-margin-x">
            <div className="cell">
              <h4 className="header-show-page center-element">Get a Recommendation</h4>
            </div>
            <div className="cell">
              <ErrorDisplay 
                errors={errors}
              />
            </div>
            <div className="cell">
              <button className="button" onClick={handleGetCoords}>Get Current Location</button>
            </div>
            <div className="cell">
              <label>
                Filter Categories:
                <input placeholder="Search for a category" onChange={categoriesChangeHandler}/> 
              </label>
            </div>
            <div className="cell">
              <label>
                Categories:
                <select className="restaurant-rec-select" defaultValue={"default"} size={5} onChange={handleCategorySelect}>
                  <option value="default" disabled>---Select a Category---</option>
                  {filteredCategories}
                </select>
              </label>
            </div>
            <div className="cell">
              Distance:
              <DistanceSlider 
                value={newRecommendation.radius}
                onChange={handleDistanceChange}
              />
            </div>
            <div className="cell">
              Price Level:
                <RadioButton 
                  label="$"
                  value="1"
                  checked={newRecommendation.price == "1"}
                  onChange={handleRadioChange}
                />
                <RadioButton 
                  label="$$"
                  value="2"
                  checked={newRecommendation.price == "2"}
                  onChange={handleRadioChange}
                />
                <RadioButton 
                  label="$$$"
                  value="3"
                  checked={newRecommendation.price == "3"}
                  onChange={handleRadioChange}
                />
                <RadioButton 
                  label="$$$$"
                  value="4"
                  checked={newRecommendation.price == "4"}
                  onChange={handleRadioChange}
                />
            </div>
            
            <input className="cell button" type="submit" value="Get a Recommendation" />
          </div>
        </div>
      </form>
    )
}

export default RestaurantRecommendation