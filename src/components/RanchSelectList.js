import React from 'react'
import PropTypes from 'prop-types'
import RanchSelect from './RanchSelect'

const RanchSelectList = ({ ranchAr, onRanchSelectClick }) => (
  <table className="table table-striped">
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th>Ranch Name</th>
      </tr>
    </thead>
                <tbody>
                    {ranchAr.map((ranch, index) => {
                         return (
                             <tr key={index}>
                                <RanchSelect key={index} id={index} selected={ranch.selected} name={ranch.name} onClick={() => onRanchSelectClick(index)} />
                             </tr>
                          )
                       })
                    }
                </tbody>
    </table>
)

RanchSelectList.propTypes = {
  ranchAr: PropTypes.arrayOf(
    PropTypes.shape({
      selected: PropTypes.bool.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onRanchSelectClick: PropTypes.func.isRequired
}

export default RanchSelectList
