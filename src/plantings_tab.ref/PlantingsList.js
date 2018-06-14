/* Description:
 * This file implements the project list view. It is a 'simple' component,
 * eg no state.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Button } from 'react-bootstrap/lib';

class PlantingsList extends Component {
    constructor(props, context) {
        super(props, context);
        console.log("construct PlantingsList");
    }

    render() {
        console.log('render PlantingsList: ', this.props);

        return(
            <table className="table table-bordered margin-bottom">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Crop</th>
                        <th>Varietal</th>
                        <th>Planted</th>
                        <th>Harvested</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody> 
                { 
                    this.props.plantingsList.map((planting, index) => {
                       return (
                           <tr key={index}>
                              <td>{planting.name}</td>
                              <td>{planting.crop_type_name}</td>
                              <td>{planting.varietal}</td>
                              <td>{planting.start_date}</td>
                              <td>{planting.end_date}</td>
                              <td>
                                  <Button onClick={() => this.props.onPlantingSelect(index)} bsSize="xsmall">
                                     <i className="fa fa-pencil fa-fw" ></i>
                                  </Button>
                                  &nbsp;
                                  <Button bsSize="xsmall">
                                     <i className="fa fa-trash fa-fw" ></i>
                                  </Button>
                              </td>
                           </tr>
                      )
                    })
                } 
                </tbody>
            </table>
        )
    }
}

PlantingsList.propTypes = {
    onPlantingSelect: PropTypes.func.isRequired,
    plantingsList: PropTypes.array.isRequired,
}

withRouter(PlantingsList);

const mapStateToProps = (state) => {
    console.log("xxxxxxxxxxxxxx PlantingsList.mapStateToProps: ", state);
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    console.log("enter mapDispatchToProps: ");
    return {
    };
};

export {PlantingsList};

export default connect(mapStateToProps, mapDispatchToProps)(PlantingsList);

