import React from 'react';
import PropTypes from 'prop-types'


const RanchSelect = ({onClick, name, id, selected}) => {
    console.log("make RanchSelect: ", selected);
    return(
        <td>
            <input type='checkbox' defaultChecked={selected} name={id} onClick={onClick}/> {name}
        </td>
    )
}

RanchSelect.propTypes = {
  selected: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired
}

export default RanchSelect;

