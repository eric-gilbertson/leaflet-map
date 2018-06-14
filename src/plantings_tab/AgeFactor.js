import React from 'react';
import PropTypes from 'prop-types'


const AgeFactor = ({planting, onInputChange, isReadonly }) => {
    console.log("xxxxxxxx AgeFactor: ", planting.age_factor);
    return(
        <div>
            <label>Tree Age:</label> {planting.age_years}
            , &nbsp;
            <label> Canopy Factor: </label>
            <input style={{width:"60px"}} disabled={isReadonly} type="number" onChange={onInputChange} value={planting.age_factor} name="age_factor"></input>%
        </div>
    )
}

AgeFactor.propTypes = {
  planting: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  isReadonly: PropTypes.bool.isRequired,
  
}

export {AgeFactor};

