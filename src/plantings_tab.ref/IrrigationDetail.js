/* Description:
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Row, Col } from 'react-bootstrap/lib';

class IrrigationDetail extends Component {
    constructor(props, context) {
        super(props);
        console.log("construct IrrigationDetail");

        this.state = {
            irrigationStrategyDisplay: 'block',
            applicationRateGallons: true,
        }
    }

    render() {
        console.log('render IrrigationDetail: ');
        let rowCropDisplay = this.props.isRowCrop ? 'block' : 'none';
        let treeCropDisplay = this.props.isTreeCrop ? 'block' : 'none';
        let orchardDisplay = this.props.orchardDisplay;
        let irrigationStrategyDisplay = 'none';
        let applicationRateGallons = false;
        let irrigationEfficiency = "49";

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
                        <input type="number" name="application_rate" className="form-control" />
                                <label className="text-left" style={{'paddingLeft': '5px'}}>
                                    <input type="radio" name="application_rate_units_orchard" value="gal_per_hr_per_tree" defaultChecked={ (applicationRateGallons ? 'true' : 'false')} /> gal / hr
                                </label>
                                <label className="text-left" style={{"paddingLeft": "5px"}}>
                                    <input type="radio" name="application_rate_units_orchard" value="in_per_hr_per_acre" defaultChecked={ (applicationRateGallons ? 'false' : 'true') } /> in / hr
                                </label>
                </Col>
                <Col className="form-group" xs={3}>
                    <label>Irrigation Efficiency</label>
                    <input type="number" name="irrigation_efficiency" className="form-control" min="0" max="100" step="1" defaultValue={{irrigationEfficiency}}/>
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
}


IrrigationDetail.propTypes = {
    isTreeCrop: PropTypes.bool.isRequired,
    isRowCrop: PropTypes.bool.isRequired,
}

withRouter(IrrigationDetail);

const mapStateToProps = (state) => {
    console.log("IrrigationDetail.mapStateToProps: ", state)
    let props = {};
    props.isTreeCrop = state.isTreeCrop;
    props.isRowCrop = state.isRowCrop;
    return props;
};

const mapDispatchToProps = (dispatch) => {
    console.log("IrrigationDetail.mapDispatchToProps: ");
    return {};
};

export {IrrigationDetail};

export default connect(mapStateToProps, mapDispatchToProps)(IrrigationDetail);

