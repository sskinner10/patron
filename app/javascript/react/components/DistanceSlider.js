import React from "react";

const DistanceSlider = (props) => {
    return (
      <label>
        <input 
          value={props.value} 
          onChange={props.onChange} 
          min={0} 
          max={20} 
          step={0.5} 
          type="range"
        />
        <br/>
        <output>{props.value} miles</output>
      </label>
    )
}

export default DistanceSlider