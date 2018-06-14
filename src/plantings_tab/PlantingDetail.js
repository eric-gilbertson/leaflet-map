/* Description:
 * Dislays the details associated with the active planting.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormGroup, Button, Alert, Row, Col } from 'react-bootstrap/lib';
import {CROP_TYPES} from "./CropTypes";
import CROP_INFO from "./CropClassIrrigationMappings";
var DatePicker = require("react-bootstrap-date-picker");



const ConfigureIrrigationBanner = ({blockId, plantingId}) => {
    console.log("blockId: ", blockId, " PlantingId ", plantingId);
    return(
    <Row style={{marginTop:'16px', display:'flex', alignItems:'center'}}>
        <Col xs={12}>
            <Alert className={'warning" clearfix'}>
                <label style={{marginTop:"4px"}}>
                    Irrigation has not been configured for this field.
                </label>
                <a href={'/irrigation/configuration/wizard/' + blockId + '/planting/' + plantingId}  style={{marginTop:'-4px'}}  className="btn btn-success pull-right">Configure Irrigation</a>
            </Alert>
        </Col>
    </Row>
    )
}

ConfigureIrrigationBanner.propTypes = {
    blockId: PropTypes.number.isRequired,
}

const BaseGroup = ({isReadonly, planting, onInputChange}) => {
    return(
       <div>
                     <Col className="form-group" xs={3}>
                        <label className='required-field' htmlFor="cropType">Crop</label>
                        <br/>
                        <select  disabled={isReadonly} onChange={onInputChange} className="form-control" value={planting.crop_type_name} name="crop_type_name">
                           {Object.keys(CROP_TYPES).map(function (key, index) {
                                let crop = CROP_TYPES[key];
                                return (
                                    <option key={index} value={crop.name}>{crop.name}</option>
                                );
                            })}
                        </select>
                     </Col>
                     <Col className="form-group" xs={3}>
                        <label htmlFor="varietalType">Varietal</label>
                        <input disabled={isReadonly} className="form-control" type="text"  onChange={onInputChange} value={planting.crop_varietal} name="crop_varietal"></input>
                    </Col>
                    <Col className="form-group" xs={3}>
                        <label className="required-field" htmlFor="date_planted">
                            <span className="fa fa-calendar"></span>
                            &nbsp;Planted
                        </label>
                        <DatePicker disabled={isReadonly} className="form-control" type="value"  showClearButton={false} dateFormat="MM/DD/YYYY" onChange={(newDate) => {onInputChange({target:{name:'date_planted', value:newDate}})}} value={planting.date_planted}  name="date_planted">
                        </DatePicker>
                    </Col>
                    <Col className="form-group" xs={3}>
                        <label htmlFor="date_harvested">
                            <span className="fa fa-calendar"></span>
                            &nbsp;Harvest End
                        </label>
                        <DatePicker disabled={isReadonly} className="form-control" type="value"  showClearButton={false} dateFormat="MM/DD/YYYY" onChange={(newDate) => {onInputChange({target:{name:'date_harvested', value:newDate}})}} value={planting.date_harvested}  name="date_harvested"></DatePicker>
                    </Col>
                    <Col className="form-group" xs={3}>
                        <label className="required-field" htmlFor="name">Planting Name</label>
                        <input disabled={isReadonly} className="form-control"  onChange={onInputChange} value={planting.name} name="name"></input>
                    </Col>
    </div>
)
}

BaseGroup.propTypes = {
    isReadonly: PropTypes.bool.isRequired,
    onInputChange: PropTypes.func.isRequired,
    planting: PropTypes.object.isRequired,
}

const IrrigationGroup = ({isReadonly, cropType, planting, onInputChange}) => {
    let isTreeCrop = planting.crop_class === 'Orchard';
    let isVineCrop = planting.crop_class === 'Vine';
    let isRowCrop = planting.crop_class === 'Row';
    let rowCropDisplay = isRowCrop ? 'block' : 'none';
    let showIrrigation = planting.is_configuration_finished;
    let applicationRateIsGallons = planting.application_rate_units.indexOf('gal_per_hr_per_') === 0;
    let showIrrigationStrategy = false;
    let canSchedule = cropType.can_schedule;
    let irrigationType = planting.irrigation_system_type;
    let showDripTapes = irrigationType === 'drip' || irrigationType === 'subsurface_drip' && isRowCrop;
    let showGallonsPerHour = irrigationType !== 'flood';

    let irrigationTypes = CROP_INFO[planting.crop_class.toLowerCase()];
    if (irrigationTypes === undefined) {
        console.log("WARNING: Unsupported crop type: ", planting.crop_class);
        irrigationTypes = [];
    }

    let showSpacing = isTreeCrop || isVineCrop;
    let spacingLabelType = isTreeCrop ? "Tree" : "Vine";
    let treeRateSuffix = isTreeCrop ? ' / tree' : ' / 100ft';

    return(canSchedule && <div>
        <Col style={{'display': rowCropDisplay}} xs={3}>
            <label htmlFor="bedWidth">Row Spacing</label>
            <input disabled={isReadonly} className="form-control" type="number"   onChange={onInputChange} value={planting.bed_width} name="bed_width" min="0" max="100" step="1"></input>
        </Col>
        {showSpacing && 
        <Col className="form-group" xs={3}>
            <label>{spacingLabelType} Spacing (ft)</label>
            <div className="input-group"> 
                <input disabled={isReadonly} style={{width:'70px'}} type="number"  onChange={onInputChange} value={planting.tree_spacing_x} name="tree_spacing_x" className="form-control" min="0" max="100" step="1" />
                <span className="input-group-addon">x</span>
                <input disabled={isReadonly} style={{width:'70px'}}  onChange={onInputChange} value={planting.tree_spacing_y} type="number" name="tree_spacing_y" className="form-control" min="0" max="100" step="1" />
            </div>
        </Col>}
        <Col className="form-group" xs={3} style={{'display':(isRowCrop ? 'block' : 'none')}}>
            <label htmlFor="rowsPerBed">Plant rows per bed</label>
            <input disabled={isReadonly} className="form-control"  onChange={onInputChange} value={planting.rows_per_bed} type="number"  name="rows_per_bed" min="0" max="100" step="1" ></input>
        </Col>
            <Col className="form-group" xs={3}>
            <label htmlFor="fieldSets">Sets in Field</label>
            <input disabled={isReadonly} className="form-control"  onChange={onInputChange} value={planting.number_of_sets} type="number" name="number_of_sets" min="0" max="100" step="1" ></input>
        </Col>
        <Col className="form-group" xs={3}>
            <label>Irrigation System</label>
            <select disabled={isReadonly} name="irrigation_system_type" className="form-control"  onChange={onInputChange} value={planting.irrigation_system_type}>
                {irrigationTypes.map(function (itype, index) {
                    return (
                        <option key={index} value={itype.value}>{itype.text}</option>
                    );
                })}
            </select>
        </Col>
        <Col className="form-group" xs={3} style={{'display':(showDripTapes ? 'block' : 'none')}}>
            <label htmlFor="bedDripTapes">Drip tapes per row </label>
            <input disabled={isReadonly} className="form-control"  onChange={onInputChange} value={planting.drip_tapes_per_bed} type="number" min="0" max="100" step="1" name="drip_tapes_per_bed"></input>
        </Col>
        <Col className="form-group" xs={3}>
            <label>Application Rate</label>
            <input disabled={isReadonly} type="number" name="application_rate" onChange={onInputChange} value={planting.application_rate} className="form-control" min="0" max="100" step="1" />
            {showGallonsPerHour && 
                <label className="text-left" style={{'paddingLeft': '5px'}}>
                    <input disabled={isReadonly} onChange={onInputChange} type="radio" name="application_rate_units"   onChange={onInputChange} value="gal_per_hr_per_tree" checked={ (applicationRateIsGallons ? true : false)} /> gal / hr{treeRateSuffix}
                </label>
            }
            <label className="text-left" style={{"paddingLeft": "5px"}}>
                <input disabled={isReadonly} type="radio" name="application_rate_units"   onChange={onInputChange} value="in_per_hr_per_acre" checked={ (applicationRateIsGallons ? false : true) } /> in / hr
            </label>
        </Col>
        <Col className="form-group" xs={3}>
            <label>Irrigation Efficiency (%)</label>
            <input disabled={isReadonly} type="number" name="irrigation_efficiency" className="form-control" min="0" max="100" step="1"   onChange={onInputChange} value={planting.irrigation_efficiency}/>
        </Col>
        {showIrrigationStrategy && 
            <Col className="form-group" xs={4}>
                <label>Irrigation Strategy</label>
                <select disabled={isReadonly} name="irrigation_strategy" className="form-control">
                    <option>TBD</option>
                </select>
            </Col>
        }
    </div>)
}

IrrigationGroup.propTypes = {
    onInputChange: PropTypes.func.isRequired,
    isReadonly: PropTypes.bool.isRequired,
    cropType: PropTypes.object.isRequired,
    planting: PropTypes.object.isRequired,
}

const IrrigationSummary = ({planting}) => {
    //Always parse so that we get an int.
    let rateVal = parseInt(planting.rate_gpm);
    rateVal = isNaN(rateVal) ? 'Unknown' : rateVal;

   return(
    <Row>
        <Col xs={6} className="">
            <label>24 hour application rate (inches): </label>
            <span>{planting.application_rate_24_hours}</span>
        </Col>
        <Col xs={6} className="text-right">
            <label>Pump Load (gpm): </label>
            <span>{rateVal}</span>
        </Col>
    </Row>
  )
}

IrrigationSummary.propTypes = {
    planting: PropTypes.object.isRequired,
}

const PlantingDetail = ({isReadonly, cropType, planting, onInputChange}) => {
   if (!planting)
       return ("Loading - no data");

   let haveIrrigation = planting.is_configuration_finished;

   return(<div>
       <Row>
           <BaseGroup isReadonly={isReadonly} onInputChange={onInputChange} planting={planting}/>
           {haveIrrigation && 
               <IrrigationGroup cropType={cropType} isReadonly={isReadonly} onInputChange={onInputChange} planting={planting}/>
           }
       </Row>
       {haveIrrigation && <IrrigationSummary planting={planting} />}

       {!haveIrrigation && !isReadonly &&
           <ConfigureIrrigationBanner blockId={planting.block_id} plantingId={planting.planting_id}/>
       }
       <label className="required-field-footnote">Required field</label>
    </div>)
}

PlantingDetail.propTypes = {
    planting: PropTypes.object.isRequired,
    cropType: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
}

export default PlantingDetail;

