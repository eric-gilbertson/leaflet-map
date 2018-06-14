import React from 'react';
import PropTypes from 'prop-types'


const MaxCanopyMeasure = ({maxCanopyMeasure, onInputChange, isReadonly }) => {
    console.log("xxxxxxxx MaxCanopyMeasure: ", maxCanopyMeasure);
    return(
        <div>
            <label> Max Canopy Measure: </label>
            <input style={{width:"60px"}} disabled={isReadonly} type="number" onChange={onInputChange} value={maxCanopyMeasure} name="max_canopy_measure"></input>
        </div>
    )
}

MaxCanopyMeasure.propTypes = {
  maxCanopyMeasure: PropTypes.number.isRequired,
  onInputChange: PropTypes.func.isRequired,
  isReadonly: PropTypes.bool.isRequired,
  
}

export {MaxCanopyMeasure};

