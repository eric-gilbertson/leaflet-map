/* Description:
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Row, Col } from 'react-bootstrap/lib';

const IrrigationDetail = ({planting, onInputChange}) => {
   if (!planting.crop_details)
       return('Loading....');

   console.log('render IrrigationDetail: ', planting);

   let cropDetails = planting.crop_details;
   let irrigationCfg = planting.irrigation_configuration;
   let irrigationProps = irrigationCfg.irrigation_properties;
   let isTreeCrop = cropDetails.crop_class === 'Orchard';
   let isRowCrop = cropDetails.crop_class === 'Row';
   let isVineCrop = cropDetails.crop_class === 'Vine';
    let irrigationStrategyDisplay = 'none';
    // Rate is either gallons/day or inches/hr
    let applicationRateHours = irrigationProps.application_rate_then_units[0] === 24

    return(
        <div style={{'marginTop': '8px'}}>
            <Row>
                <Col className="form-group" xs={3}>
                    <label>Irrigation System</label>
                    <select name="irrigation_system" className="form-control">
                        <option>Subsurface Drip</option>
                    </select>
                </Col>
                <Col className="form-group" xs={3}>
                    <label>Application Rate</label>
                        <input type="number" name="application_rate" value={irrigationCfg.application_rate_24_hours} className="form-control" />
                                <label className="text-left" style={{'paddingLeft': '5px'}}>
                                    <input type="radio" name="application_rate_units_orchard" value="gal_per_hr_per_tree" defaultChecked={ (applicationRateHours ? 'true' : 'false')} /> gal / hr
                                </label>
                                <label className="text-left" style={{"paddingLeft": "5px"}}>
                                    <input type="radio" name="application_rate_units_orchard" value="in_per_hr_per_acre" defaultChecked={ (applicationRateHours ? 'false' : 'true') } /> in / hr
                                </label>
                </Col>
                <Col className="form-group" xs={3}>
                    <label>Irrigation Efficiency</label>
                    <input type="number" name="irrigation_efficiency" className="form-control" min="0" max="100" step="1" defaultValue={irrigationProps.irrigation_efficiency}/>
                </Col>
            </Row>
            <Row>
                <Col xs={6} className="">
                    <label>24 hour application rate: </label>
                    <span>XXXX inches </span>
                </Col>
                <Col xs={6} className="text-right">
                    <label>Pump Load</label>
                    <span>XXXX gallons/minute</span>
                </Col>
            </Row>
            <Row style={{display:irrigationStrategyDisplay}}>
                <Col className="form-group" xs={4}>
                    <label>Irrigation Strategy</label>
                    <select name="irrigation_strategy" className="form-control">
                        <option>TBD</option>
                    </select>
                </Col>
            </Row>
        </div>
        )
}


IrrigationDetail.propTypes = {
    planting: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
}

export default IrrigationDetail;


