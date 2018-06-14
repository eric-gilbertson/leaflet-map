/* Description:
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
//import CROP_TYPES from '../../scripts_legacy/block/CropTypes';
import CROP_TYPES from './CropTypes';

import { Row, Col } from 'react-bootstrap/lib';


class PlantingDetail extends Component {
    constructor(state) {
        super(state);
        console.log("construct PlantingDetail");
    }

    render() {
        console.log('xxxxxxxxx render PlantingDetail: ', CROP_TYPES);
        let cropDetails = this.props.planting.crop_details;
        let rowCropDisplay = cropDetails.crop_class === 'Row';
        let treeCropDisplay = cropDetails.crop_class === 'Orchard';
        let vineCropDisplay = cropDetails.crop_class === 'Vine';

        return(

    <div style={{'marginTop': '0px'}}>
        <Row>
             <Col xs={3}>
                <label htmlFor="cropType">Crop</label>
                <br/>
                <select className="form-control" value={cropDetails.crop_type_name} name="cropType">
                   {Object.keys(CROP_TYPES).map(function (key, index) {
                        let crop = CROP_TYPES[key];
                        return (
                            <option key={index} value={key}>{crop.name}</option>
                        );
                    })}
                </select>
             </Col>
             <Col xs={3}>
                <label htmlFor="varietalType">Varietal</label>
                <input className="form-control" type="text" value={cropDetails.varietal} name="varietalType"></input>
            </Col>
            <Col xs={3}>
                <label htmlFor="plantedDate">Planted</label>
                <input className="form-control" type="value" value={cropDetails.start_date}  name="plantedDate"></input>
            </Col>
            <Col xs={3}>
                <label htmlFor="harvestedDate">Harvested {cropDetails.end_date} </label>
                <input className="form-control" type="value"  value={cropDetails.end_date} name="harvestedDate"></input>
            </Col>
        </Row>
        <Row style={{marginTop:'8px'}}>
             <Col style={{display: rowCropDisplay}} xs={3}>
                <label htmlFor="bedWidth">Bed Width</label>
                <input className="form-control" type="number"  name="bedWidth"></input>
            </Col>
            <Col style={{display:treeCropDisplay}} className="form-group" xs={3}>
                    <label>Tree Spacing (ft)</label>
                    <div className="input-group">
                        <input style={{width:'70px'}} type="number" name="plant-spacing-x" className="form-control"/>
                        <span className="input-group-addon">x</span>
                        <input style={{width:'70px'}} type="number" name="plant-spacing-y" className="form-control" />
                    </div>
            </Col>
            <Col xs={3}>
                <label htmlFor="rowsPerBed">Rows per bed</label>
                <input className="form-control" type="number"  name="rowsPerBed"></input>
            </Col>
            <Col xs={3}>
                <label htmlFor="bedDripTapes">Drip Tapes per bed</label>
                <input className="form-control" type="number" name="bedDripTapes"></input>
            </Col>
            <Col xs={3}>
                <label htmlFor="fieldSets">Sets in Field</label>
                <input className="form-control" type="number" name="fieldSets"></input>
            </Col>
        </Row>
    </div>
        )
    }
}

PlantingDetail.propTypes = {
    planting: PropTypes.object.isRequired,
}

withRouter(PlantingDetail);

const mapStateToProps = (state) => {
    console.log("PlantingDetail.mapStateToProps: ", state)
    let props = {};
    props.planting = state.planting;
    return props;
};

const mapDispatchToProps = (dispatch) => {
    console.log("enter mapDispatchToProps: ");
    return {
    };
};

export {PlantingDetail};

export default connect(mapStateToProps, mapDispatchToProps)(PlantingDetail);

