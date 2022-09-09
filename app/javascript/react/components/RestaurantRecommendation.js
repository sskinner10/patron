import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";

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
    const [fetchedRecommendation, setFetchedRecommendation] = useState({})

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
            body: JSON.stringify({recommendation: formPayload})
            })
            if (!response.ok) {
            const errorMessage = `${response.status} (${response.status.text})`
            const error = new Error(errorMessage)
            throw(error)
            }
            const recommendation = await response.json()

            if (recommendation.recommendation) {
                setFetchedRecommendation(recommendation.recommendation)
            } else if (recommendation.error) {

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
        alert(`Please allow browser to find location then click 'Get Current Location'. This data is used to help locate local restaurants.`);
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
                geolocation: "error, please click 'Get Current Location'"
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

    let locationFound
    if (newRecommendation.lat && newRecommendation.lon) {
        locationFound = "Location retrieved successfully!"
    }

    if(!_.isEmpty(fetchedRecommendation)){
        return (
            <Redirect 
                to={{
                    pathname: "/restaurants/your-recommendation",
                    state: { restaurant: fetchedRecommendation}
                }}
            />
        )
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
            <div className="cell small-12 medium-6 align-center medium-offset-3 center-element callout">
              <button className="button radius" onClick={handleGetCoords}>Get Current Location</button>
              <p>{locationFound}</p>
            </div>
            <div className="cell small-12 medium-6 align-center medium-offset-3 callout">
              <div className="center-element">
                <label>
                  Filter Categories:
                  <input placeholder="Search for a category" onChange={categoriesChangeHandler}/> 
                </label>
              </div>
              <div>
                <label>
                  Categories:
                  <select className="restaurant-rec-select" value={newRecommendation.category} size={5} onChange={handleCategorySelect}>
                    <option value="" disabled>---Select a Category---</option>
                    {filteredCategories}
                  </select>
                </label>
              </div>
            </div>  
            <div className="cell small-12 medium-6 align-center medium-offset-3 center-element callout">
              Distance:
              <DistanceSlider 
                value={newRecommendation.radius}
                onChange={handleDistanceChange}
              />
            </div>
            <div className="cell small-12 medium-6 align-center medium-offset-3 center-element callout">
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
            
            <input className="cell small-12 medium-6 align-center medium-offset-3 button radius" type="submit" value="Get a Recommendation" />
          </div>
        </div>
      </form>
    )
}

export default RestaurantRecommendation