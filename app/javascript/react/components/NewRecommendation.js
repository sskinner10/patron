import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";

const NewRecommendation = (props) => {
    const [recommendation, setRecommendation] = useState({})
    const [shouldRedirect, setShouldRedirect] = useState(false)

    useEffect(() => {
        if (props.location.state) {
            setRecommendation(props.location.state.restaurant)
        } else {
            setShouldRedirect(true)
        }
    }, [])

    if (shouldRedirect) {
        return (
            <Redirect push to="/restaurants/recommendation"/>
        )
    }

    return (
        <div>
          <div className="grid-container show-page-margin">
            <div className="grid-x grid-margin-x">
              <div className="cell">
                <h3 className="header-show-page center-element">You should try:</h3>
                <h4 className="header-show-page center-element">{recommendation.name}</h4>
                <p className="center-element">{recommendation.address}</p>
                <div className="center-element"><a className="yelp-url-anchor" href={recommendation.url}>{recommendation.url}</a></div>
                <img className="recommendation-image" src={recommendation.image_url} />
                <div className="center-element"><Link to="/restaurants/recommendation">Try a different recommendation</Link></div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default NewRecommendation