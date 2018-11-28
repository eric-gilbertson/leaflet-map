import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Col, Button, Modal} from 'react-bootstrap/lib';
import { CROP_TYPES } from "./CropTypes";
var DatePicker = require("react-bootstrap-date-picker");

const INITIAL_STATE = {plantingToCopy: 'None', plantingName: '', plantingVarietal: '', cropType:'', plantingDate:'', captureDates: true, harvestDate: "", allowSave: false, cropYear:null, seasonDays:null};

const DAYS_TO_MILLISECONDS = 24 * 60 * 60 * 1000;

class AddPlantingModal extends Component {
    constructor(props) {
        super(props);

        this.state = INITIAL_STATE;

        //Copy of CROP_TYPES indexed by id, not name. 
        //TODO: remove when CROP_TYPES is changed.
        this.CROP_MAP = {};
        for (let key in CROP_TYPES) {
            let crop = CROP_TYPES[key]
            this.CROP_MAP[crop.id] = crop;
        }
         
        this._onInputChange = function(event) {
           let newState = {...this.state};
           let tname = event.target.name;
           let tvalue = event.target.value;
           newState[tname] = tvalue;

           let seasonDaysChange = event.target.name === 'seasonDays';
           let cropTypeChange = event.target.name === 'cropType';
           let crop = this.CROP_MAP[newState.cropType];
           // The 'date planted' can be confusing for perennials
            // you need to specify it for a really new planting (e.g. alfalfa when current crop is corn)
           newState.captureDates = true;  // crop === undefined || !crop.perennial;
           // Note: season_length is not defined for all crops and that it
           // is not persisted, eg it is used only in the dialog to generate
           // the harvest date.
           if (cropTypeChange) {
               newState.cropYear = this._findCropYear(crop);
               let days = crop && crop.season_length ? crop.season_length : null;
               newState.seasonDays = typeof(days) === 'string' ? parseInt(days, 10) : days;
               
           } else if (seasonDaysChange) {
               let val = event.target.value;
               newState.seasonDays = val.length > 0 ? parseInt(val, 10) : 0; 
           }

           if (seasonDaysChange || cropTypeChange || event.target.name === 'plantingDate') {
               let newDate = '';
               if (newState.plantingDate && newState.plantingDate.length > 0) {
                   newDate = new Date(Date.parse(newState.plantingDate) + parseInt(newState.seasonDays, 10) * DAYS_TO_MILLISECONDS).toLocaleDateString();
               }
               newState.harvestDate = newDate;
           }

           //TODO: reevaluate captureDates on crop change.
           //WARNING: datepicker sets plantingDate to null on a clear operation
           let allowSave = newState.plantingName.length !== 0 && 
                           newState.cropType.length !== 0 &&
                           (!newState.captureDates || 
                            (newState.plantingDate !== null && 
                             newState.plantingDate !== undefined && 
                             newState.plantingDate.length !==0));

           newState.allowSave = allowSave;
           this.setState(newState);
        }
        this._onInputChange = this._onInputChange.bind(this);

        this._findCropYear = function(cropInfo) {
            const plantingsList = this.props.plantingsList;
            let lastSeason = null;
            if (plantingsList.length > 0) {
                 lastSeason = plantingsList[0];
            }
            let cropYear = null;

            // Default to last season's values if not a row crop
            if (lastSeason && cropInfo && cropInfo.perennial) {
                let isoDate = lastSeason.db_start_date;
                //Do manually because date parse is not reliable without
                //the time component from the DB.
                if (isoDate && isoDate.indexOf('-') > 0) {
                    let isoAr = isoDate.substring(0, 10).split('-');
                    //manually parse else date is wrong due to TZ stuff.
                    if (isoAr.length > 2) {
                        let curYear = isoAr[0];
                        let nextYearInt = parseInt(curYear, 10) + 1;
                        cropYear = nextYearInt;
                    }
                }
            }
            return cropYear;
        };

        this._setInitialState = function(plantingsList) {
            let newState = {...INITIAL_STATE};
            let lastSeason = null;
            let cropInfo = null
            if (plantingsList.length > 0) {
                 lastSeason = plantingsList[0];
                 cropInfo = this.CROP_MAP[lastSeason.crop_type_id];
            }

            // Default to last season's values if not a row crop
            if (lastSeason && cropInfo && cropInfo.perennial) {
                newState.cropType =  lastSeason.crop_type_id;
                newState.cropVarietal =  lastSeason.crop_varietal;
                newState.plantingToCopy = lastSeason.planting_id;
                let isoDate = lastSeason.db_start_date;
                //Do manually because date parse is not reliable without
                //the time component from the DB.
                if (isoDate && isoDate.indexOf('-') > 0) {
                    let isoAr = isoDate.substring(0, 10).split('-');
                    //manually parse else date is wrong due to TZ stuff.
                    if (isoAr.length > 2) {
                        let curYear = isoAr[0];
                        let nextYearInt = parseInt(curYear, 10) + 1;
                        newState.plantingDate = lastSeason.date_planted;
                        newState.cropYear = nextYearInt;
                        
                        let prevName = lastSeason.name;
                        if (prevName.indexOf(curYear) >= 0) {
                            newState.plantingName = prevName.replace(curYear, nextYearInt);
                            newState.allowSave = true; //got it all.
                        }
                    }
                }
                // Hide the bloom date for perennials.
                newState.captureDates =  false;
            }
            this.setState(newState);
        }
        this._setInitialState = this._setInitialState.bind(this);

    }

    
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.showModal === false && nextProps.showModal === true)  {
             this._setInitialState(nextProps.plantingsList);
        }

        return this.props.showModal || nextProps.showModal;
    }
 
    render() {
        console.log("render app planting: ", this.state.cropType);
    return (
      <div>
        <Modal show={this.props.showModal} onHide={() =>{this.props.onClose(null)}}>
          <Modal.Header closeButton>
            <Modal.Title>Add Season </Modal.Title>
          </Modal.Header>
          <Modal.Body>
             <Form style={{borderBottom:'0'}} horizontal>
                <FormGroup>
                   <Col sm={4}>
                     <label>Season Name</label>
                   </Col>
                   <Col sm={4}>
                     <input className="form-control" onChange={this._onInputChange} name="plantingName" value={this.state.plantingName} />

                   </Col>
                </FormGroup>
                <FormGroup>
                     <Col xs={4}>
                        <label htmlFor="crop-type">Crop Type</label>
                     </Col>
                     <Col sm={4}>
                        <select  onChange={this._onInputChange} className="form-control" value={this.state.cropType} name="cropType">
                           <option value=''>Select Value</option>
                           {Object.keys(CROP_TYPES).map(function (key, index) {
                                let crop = CROP_TYPES[key];
                                return (
                                    <option key={index} value={crop.id}>{crop.name}</option>
                                );
                            })}
                        </select>
                     </Col>
                </FormGroup>
                <FormGroup>
                     <Col xs={4}>
                        <label htmlFor="varietal">Crop Varietal</label>
                     </Col>
                     <Col sm={4}>
                        <input className="form-control" onChange={this._onInputChange} name="cropVarietal" value={this.state.cropVarietal} />
                     </Col>
                </FormGroup>
                <FormGroup>
                     <Col xs={4}>
                        <label>Season to Copy</label>
                     </Col>
                     <Col sm={4}>
                        <select  onChange={this._onInputChange} className="form-control" value={this.state.plantingToCopy} name="plantingToCopy">
                           <option value='None'>None</option>
                           {this.props.plantingsList.map(function (planting, index) {
                                return (
                                    <option key={index} value={planting.planting_id}>{planting.name}</option>
                                );
                            })}
                        </select>
                     </Col>
                </FormGroup>
                {this.state.cropYear &&
                <FormGroup>
                   <Col sm={4}>
                       <label> Season Year</label>
                   </Col>
                   <Col sm={4}>
                       <input className="form-control" type="number" onChange={this._onInputChange} value={this.state.cropYear} name="cropYear" min="2000" max="2050" step="1"></input> 
                   </Col>
                </FormGroup>}
                <FormGroup>
                   <Col sm={4}>
                       <label htmlFor="planting-date"> Planting Date</label>
                   </Col>
                   <Col sm={4}>
                       <DatePicker id="planting-date" className="form-control" type="value"  onChange={(newDate) => {this._onInputChange({target:{name:'plantingDate', value:newDate}})}} showClearButton={false} value={this.state.plantingDate}  name="plantingDate"></DatePicker>
                   </Col>
                </FormGroup>
                {this.state.seasonDays !== null && <div>
                   <FormGroup>
                      <Col sm={4}>
                          <label> Season length (days)</label>
                      </Col>
                      <Col sm={4}>
                          <input type="number" name="seasonDays" className="form-control" min="0" max="365" step="1"   onChange={this._onInputChange} value={this.state.seasonDays}/>
                      </Col>
                   </FormGroup>
                   <FormGroup>
                      <Col sm={4}>
                          <label> Harvest Date</label>
                      </Col>
                      {this.state.harvestDate.length > 0 && 
                           <Col sm={4}>
                                <label>{this.state.harvestDate}</label> (expected)
                           </Col>
                      }
                   </FormGroup>
                </div>}
             </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={!this.state.allowSave} onClick={() => {this.props.onClose(this.state)}} className="btn btn-primary">Save</Button>
            <Button onClick={() => {this.props.onClose(null)}}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
  )
  }
}

/*
                   {this.state.captureDates && <Col sm={4}>
                         <DatePicker id="harvest-date" className="form-control" type="value"  onChange={(newDate) => {this._onInputChange({target:{name:'harvestDate', value:newDate}})}} showClearButton={false} value={this.state.harvestDate}  name="harvestDate"></DatePicker>
                   </Col>
                   }
*/
AddPlantingModal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    plantingsList: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
}

export {AddPlantingModal};
