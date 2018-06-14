import React from 'react';
import PropTypes from 'prop-types'


const ProjectName = ({updateName, name }) => {
    console.log("make ProjectName: ", name);
    return(
        <input type="text" name="projectName" value={name} placeholder="Name" onChange={updateName} />
    )
}

ProjectName.propTypes = {
  name: PropTypes.string.isRequired,
  updateName: PropTypes.func.isRequired,
}

export default ProjectName;

