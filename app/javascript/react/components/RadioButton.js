import React from "react";

const RadioButton = (props) => {
    return (
      <div className="radio">
        <label>
          <input checked={props.checked} type="radio" value={props.value} onChange={props.onChange}/>
          {props.label}
        </label>
      </div>
    )
}

export default RadioButton