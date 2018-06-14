/* Description:
 * Top level container for block dialog's configuration tab.
 * Note that the blockInfo struct is inherited from the parent
 * page, e.g no Ajax request for it.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Alert, ButtonToolbar, Panel, PanelGroup, Button, Grid, Row, Col } from 'react-bootstrap/lib';

import { BlockName } from './BlockName';
import { KCTable } from './KCTable';
import { PlantingsList } from './PlantingsList';
import { CanopyShadingModal } from './CanopyShadingModal';
import { AgeFactor } from './AgeFactor';
import { MaxCanopyMeasure } from './MaxCanopyMeasure';
import { BloomDateModal } from './BloomDateModal';
import { AlfalfaCuttingsModal } from './AlfalfaCuttingsModal';
import { AddPlantingModal } from './AddPlantingModal';
import PlantingDetail from './PlantingDetail';
import {
  updatePlantingBloomDate, saveCanopyPercentShading, getPlantingInfoDone, 
  getPlantingInfo, savePlantingInfo, saveCuttingsInfo, updatePlantingInfo,
  clearPlantingInfoStatusMsg, deletePlantingInfo,
} from './PlantingsActions';
import {CROP_TYPES} from "./CropTypes";


const DELETE_PLANTING_MSG="Are you sure that you want to delete ";
const CROP_CHANGE_WARNING="Changing the crop type for the current season will require a complete recalcuation of the crop stage data. Are you sure that you want to make this change?"; 

class PlantingsTab extends Component {
    constructor(props) {
      super(props);
 
      this.handleSelect = this.handleSelect.bind(this);
      this.handleCropChange = this.handleCropChange.bind(this);

      this.state = {
        expandedPanelAr: [true, false], 
        blockInfo: props.blockInfo,
        blockInfoChanged: false,
        plantingInfo: {},
        showCanopyShadingModal: false,
        showBloomDateModal: false,
        showAlfalfaCuttingsModal: false,
        showAddPlantingModal: false,
      };

      //Needed only to squelch React warning.
      this._togglePanel = function() {
      }

      // Sets flag used by KO to confirm exit with pending changes
      this._setConfigDirty = function() {
          if (this.state.blockInfo.setConfigDirty !== undefined) {
              this.state.blockInfo.setConfigDirty(true);
          }
      }

      this._onBloomDateClose = function(bloomDate) {
          console.log("bloom date close: ", bloomDate);
          this.setState({showBloomDateModal: false});
          if (bloomDate) {
              this.props.updatePlantingBloomDate(bloomDate);
              this._setConfigDirty();
          }
      }
      this._onBloomDateClose = this._onBloomDateClose.bind(this);

      this._onAlfalfaCuttingsClose = function(cuttingsList) {
          if (cuttingsList != null) {
              this.props.updateAlfalfaCuttings(this.props.plantingInfo, cuttingsList);
          }
          this.setState({showAlfalfaCuttingsModal: false});
         
      }
      this._onAlfalfaCuttingsClose = this._onAlfalfaCuttingsClose.bind(this);


      this._onUpdateCanopyShadingClose = function(percentShade, dateMeasured) {
          console.log("update canopy shading :", percentShade, ", ", dateMeasured);
          if (percentShade && dateMeasured)
              this.props.updateCanopyShading(this.props.plantingInfo, percentShade, dateMeasured);

          this.setState({showCanopyShadingModal: false});
      }
      this._onUpdateCanopyShadingClose = this._onUpdateCanopyShadingClose.bind(this);

      this._onAddPlantingClose = function(plantingInfo) {
          //Clear out the stuff that user has to provide for a new planting.
          console.log("add planting: ", plantingInfo);
          if (plantingInfo) {
              let planting = Object.assign({}, this.props.plantingInfo);
              planting.name = plantingInfo.plantingName;
              planting.data.name = planting.name;
              planting.date_planted = plantingInfo.plantingDate;
              planting.data.date_planted = plantingInfo.plantingDate;
              planting.data.date_harvested = plantingInfo.harvestDate;
              planting.planting_to_copy = plantingInfo.plantingToCopy;
              planting.data.planting_to_copy = planting.planting_to_copy;
              planting.planting_id = -1;
              planting.data.planting_id = planting.planting_id;
              planting.block_id = this.state.blockInfo.blocks[0].id
              planting.data.block_id = planting.block_id;
              planting.crop_varietal = plantingInfo.cropVarietal;
              planting.data.crop_varietal = plantingInfo.cropVarietal;
              planting.crop_type_id = plantingInfo.cropType;
              planting.data.crop_type_id = plantingInfo.cropType;
              planting.year_to_create = plantingInfo.cropYear;
              planting.data.year_to_create = plantingInfo.cropYear;
              
              //NOTE: must make new array here else corrupt current planting
              let dummyStage = {...this.props.plantingInfo.crop_stage_list[0]};
              dummyStage.date_this_season = plantingInfo.plantingDate;
              planting.crop_stage_list = [dummyStage];
              planting.data.crop_stage_list = planting.crop_stage_list;
              this.props.updatePlanting(planting);
          } else {
              this.setState({showAddPlantingModal: false});
          }
      }
      this._onAddPlantingClose = this._onAddPlantingClose.bind(this);

      this._onDeletePlanting = function(arg) {
          let srcPlanting = this.props.plantingInfo;
          let plantingId = srcPlanting.planting_id;
          let plantingName = srcPlanting.name;
          let msg = DELETE_PLANTING_MSG + plantingName + '?';
          if (!window.confirm(msg)) {
              return;
          }

          //NOTE: assumes user cant delete last planting, e.g always another.
          let plantings = this.state.blockInfo.plantings;
          let isFirst  = plantings[0].planting_id == plantingId;
          let replacementPlanting = plantings[isFirst ? 1 : 0];
          this.props.deletePlanting(plantingId);
          let blockId = this.state.blockInfo.blocks[0].id;
          this.props.fetchPlanting(replacementPlanting.planting_id, blockId);
      }
      this._onDeletePlanting = this._onDeletePlanting.bind(this);

      this._onKCChange = function(event) {
          let name = event.target.name;
          let value = event.target.value;
          console.log("KC change: ", rowNum, ", ", name, ", ", value);

          // Usually get row from target but it is provided directly for 
          // the date picker.
          let rowNum = null;
          if (event.target.getAttribute) {
             rowNum = event.target.getAttribute('data-row');
          } else  {
             rowNum = event.target.row;
          }

          let plantingInfo = {...this.props.plantingInfo};
          plantingInfo.crop_stage_list[rowNum][name] = value;
          this.setState({plantingInfo:plantingInfo});

          if (this.state.blockInfo.setConfigDirty !== undefined) {
              this.state.blockInfo.setConfigDirty(true);
          }
      }

      this._onCancel = function(event) {
          //Must close through here, else map overlays won't work
          this.state.blockInfo.reactCloseCallback(true);
      }

      this._onSave = function(event) {
          let plantingInfo = {...this.props.plantingInfo};
          plantingInfo.block_id = this.props.plantingInfo.block_id;
          plantingInfo.data.block_id = this.props.plantingInfo.block_id;
          let blockInfo = {};
          if (this.state.blockInfoChanged) {
              blockInfo.block_id = plantingInfo.data.block_id;
              blockInfo.block_name = plantingInfo.data.block_name;
              blockInfo.ranch_id = plantingInfo.data.ranch_id;
              blockInfo.et_source_id = plantingInfo.data.et_source_id;
          }
          this.props.updatePlanting(plantingInfo, blockInfo);

          if (this.state.blockInfo.setConfigDirty !== undefined) {
              this.state.blockInfo.setConfigDirty(false);
          }
      }

      // Sets block info dirty and delegates data value to planting
      this._onBlockInfoChange = function(event) {
          this.setState({blockInfoChanged: true});
          this._onPlantingInputChange(event);
      }

      this._onBannerDismiss  = function(event) {
           console.log("close banner:");
           this.props.dismissStatusBanner();
      }

      // Called when a item in the planting details panel is updated.
      this._onPlantingInputChange = function(event) {
          if (!event || !event.target) {
              console.log("ignoring input change for: ", event);
              return;
          }

          if (this.state.blockInfo.setConfigDirty !== undefined) {
              this.state.blockInfo.setConfigDirty(true);
          }

          let target = event.target;
          let newInfo = Object.assign({}, this.props.plantingInfo);
          let newValue = target.value
          //Must special case checkboxes.
          if (target.name === 'using_partial_irrigation') {
              newValue = target.checked;
          }

          newInfo[target.name] = newValue;
          newInfo.data[target.name] = newValue;

          // update stuff derived from crop type.
          if (target.name === 'crop_type_name') {
              if (!window.confirm(CROP_CHANGE_WARNING)) return;

              let info = CROP_TYPES[target.value.toLowerCase()];
              newInfo['crop_type_id'] = info.id;
              newInfo['crop_class'] = info.crop_class;
              newInfo['crop_varietal'] = '';
              newInfo['date_planted'] = '';
              newInfo['date_harvested'] = '';
              newInfo['name'] = ''

              newInfo.data['crop_type_id'] = newInfo['crop_type_id'];
              newInfo.data['crop_class'] = newInfo['crop_class'];
              newInfo.data['crop_varietal'] = '';
              newInfo.data['date_planted'] = '';
              newInfo.data['date_harvested'] = '';
              newInfo.data['name'] = ''
          }

          // Flood takes only inches per hour.
          if (target.name === 'irrigation_system_type' && 
              target.value === 'flood') {
              newInfo['application_rate_units'] = "in_per_hr_per_acre";
              newInfo.data['application_rate_units'] = "in_per_hr_per_acre";
          }

          //this.setState({plantingInfo: newInfo});
          this.props.updatePlantingInfo(newInfo);
      }
      this._onPlantingInputChange = this._onPlantingInputChange.bind(this);

      this._onPlantingSelect = function(event) {
          let plantingId =  event.target.value;
          let newPlanting = null;
          let plantings =  this.state.blockInfo.plantings;
          for (let i=0; !newPlanting && i < plantings.length; i++) {
              if (plantings[i].planting_id == plantingId) {
                  newPlanting = plantings[i];
              }
          }

          let epa = this.state.expandedPanelAr.slice();
          epa[0] = true;
          let newState = {
            expandedPanelAr: epa,
            plantingId: plantingId,
          };
          this.setState(newState);
          

          let blockId = this.state.blockInfo.blocks[0].id;
          this.props.fetchPlanting(plantingId, blockId);
      }
    } // end constructor

    handleCropChange(event) {
        console.log("crop change: ", event.target.value);
        let newVal = event.target.value;
    }

    handleSelect(activeKey) {
      console.log('set active: ', activeKey);
      if (activeKey === undefined)
          return;

      let epar = this.state.expandedPanelAr.slice();
      epar[activeKey] = !epar[activeKey];
      console.log("set visibility: ", activeKey, ", ", epar);
      this.setState({expandedPanelAr: epar});

    }

    componentWillReceiveProps(nextProps) {
        let nextId = nextProps.blockInfo.blocks[0].id;
        let currId =  this.state.blockInfo.blocks[0].id;
        if (nextId != currId) {
            console.log("update block: ", nextId, ", ", nextId);
            this.setState({blockInfo : nextProps.blockInfo});
        }

        if (nextProps.plantingInfo.saveDone) {
            this.setState({showAddPlantingModal: false});
        }

        
    }

    render() {
       let myBlockInfo = this.props.blockInfo ? this.props.blockInfo : this.props.blockInfo;
       if (!myBlockInfo || !myBlockInfo.blocks || myBlockInfo.blocks.length == 0 || myBlockInfo.blocks[0].name === undefined) {
           return (`Loading.... `);
       }

       let myBlock = myBlockInfo.blocks[0];
       let myPlantings = myBlockInfo.plantings;
       let myRanches = myBlockInfo.ranches;
       let plantingInfo = this.props.plantingInfo ? this.props.plantingInfo : {};

       let isOrchardCrop = plantingInfo.crop_class === 'Orchard';
       let isVineCrop = plantingInfo.crop_class === 'Vine';
       let cropStageList = plantingInfo.crop_stage_list;
       let isIrrigationConfigured = myBlock.is_irrigation_config_finished;
       //let isReadonly = plantingInfo.planting_id != myPlantings[0].planting_id;
       //TODO: figure out rule for this flag.
       let isReadonly = false;

       let bloomDateUS = '';
       let bloomDateLbl = 'Bloom';
       let cn = plantingInfo.crop_type_name;
       let cropNameLc = cn ? cn.toLowerCase() : "";
       let cuttingsShow = cropNameLc === 'alfalfa' && plantingInfo.cuttings !== undefined;

       let cropInfo = CROP_TYPES[cropNameLc];
       let bloomDateShow = cropInfo.show_bloom;
       let shadingsShow = cropInfo.show_canopy;
       if (cropStageList.length > 0) {
           //NOTE: add 1 second else JS clips to previous day
           bloomDateUS = cropStageList[0].date_this_season;
           if (bloomDateUS && bloomDateUS.indexOf('-') > 0) {
               let dtsAr = bloomDateUS.substring(0, 10).split('-');
               if (dtsAr.length > 2) {
                  bloomDateUS = `${dtsAr[1]}/${dtsAr[2]}/${dtsAr[0]}`;
               }
           }
           bloomDateLbl = cropStageList[0].name;
       }
       
       let showStagesPanel = myBlock.is_active || cuttingsShow || bloomDateShow || shadingsShow || isOrchardCrop;

       let allowSave = plantingInfo.data.date_planted.length > 0 && 
                       plantingInfo.data.name.length > 0;

       // Reformat server dates to US style.
       let plantingsDateList = myBlockInfo.plantings.map(function (p, index) {
           let startStr = '';
           if (p.db_start_date) {
               let startAr = p.db_start_date.split('-');
               if (startAr.length === 3)
                   startStr = `${startAr[1]}/${startAr[2]}/${startAr[0]}`;
           }

           let endStr = '';
           if (p.db_end_date) {
               let endAr = p.db_end_date.split('-');
               if (endAr.length === 3)
                   endStr = `${endAr[1]}/${endAr[2]}/${endAr[0]}`;
           }
 
           let nameDateStr = `${p.name} (${startStr} - ${endStr})`;
           return {id:p.planting_id, nameDate: nameDateStr}
       });

        return(
            <Grid fluid={true}>
                <AddPlantingModal plantingsList={myBlockInfo.plantings} showModal={this.state.showAddPlantingModal} onClose={this._onAddPlantingClose}></AddPlantingModal>
                {cuttingsShow && <AlfalfaCuttingsModal showModal={this.state.showAlfalfaCuttingsModal} cuttingsList={plantingInfo.cuttings} onClose={this._onAlfalfaCuttingsClose}></AlfalfaCuttingsModal>}

                {bloomDateShow && <BloomDateModal firstStage={cropStageList[0]} showModal={this.state.showBloomDateModal} onClose={this._onBloomDateClose}></BloomDateModal>}
                {shadingsShow && <CanopyShadingModal percentShaded={plantingInfo.current_canopy_measure} showModal={this.state.showCanopyShadingModal} onClose={this._onUpdateCanopyShadingClose}></CanopyShadingModal>}
                {this.props.showUpdateBanner &&
                   <Alert style={{marginTop:"0.5em"}} onDismiss={this._onBannerDismiss.bind(this)} bsStyle={this.props.showUpdateError ? 'danger' : 'success'}>
                       {this.props.showUpdateError ? "An error occured while saving your changes." : "Your changes have been saved."}
                   </Alert>
                }
                <BlockName onInputChange={this._onBlockInfoChange.bind(this)} blockInfo={myBlockInfo} planting={plantingInfo.data} ></BlockName>
                <PanelGroup id="plantings-panel">
                      <Panel eventKey="0" onToggle={() => this.togglePanel(0)} expanded={this.state.expandedPanelAr[0]}>
                        <Panel.Heading>
                            <span className='h4' onClick={() => this.handleSelect(0)} className="panel-title">
                                <i className={'fa fa-fw fa-chevron-' + (this.state.expandedPanelAr[0] ? 'down' : 'right')}></i>Season Details:&nbsp;
                           </span>
                           <select  onChange={this._onPlantingSelect.bind(this)} className="form-control" style={{width:'400px', display:'inline-block'}} value={plantingInfo.data.planting_id} name="new_planting">
                                {plantingsDateList.map(function (planting, index) {
                                     return (
                                         <option key={index} value={planting.id}>{planting.nameDate}</option>
                                     );
                                 })}
                             </select>
                             <div style={{marginTop:'8px'}} className="pull-right">
                                 <Button  bsSize="small" onClick={() => {this.setState({showAddPlantingModal: true})}} bsStyle='primary' className={"btn-primary-ref"}> Add Season...</Button>
                                 &nbsp;
                                 {this.props.blockInfo.plantings.length > 1 &&
                                     <Button bsSize="small" className={'fa fa-trash'} onClick={this._onDeletePlanting}></Button>
                                 }
                              </div>
                        </Panel.Heading>
                        <Panel.Body id="planting-details" collapsible>
                            <PlantingDetail isReadonly={isReadonly} onInputChange={this._onPlantingInputChange} cropType={cropInfo} planting={plantingInfo.data}></PlantingDetail>
                        </Panel.Body>
                      </Panel>

                      {showStagesPanel &&
                      <Panel eventKey="1" onToggle={() => this.togglePanel(1)} expanded={this.state.expandedPanelAr[1] && myBlock.is_active}>
                        <Panel.Heading style={{minHeight:'40px'}}>
                            {myBlock.is_active && 
                                <span className="h4" onClick={() => this.handleSelect(1)} className="panel-title"><i className={'fa fa-fw fa-chevron-' + (this.state.expandedPanelAr[1] ? 'down' : 'right')}></i>Crop Stages</span>
                            }
                            <div className="pull-right">
                                 {bloomDateShow && 
                                    <label onClick={() => this.setState({showBloomDateModal: true})} > {bloomDateLbl} Date: {bloomDateUS} <span className="fa fa-calendar"></span> </label>}
                                &nbsp; &nbsp;
                                {shadingsShow && <Button className='btn-primary-ref' bsSize="small" bsStyle="primary" onClick={() => this.setState({showCanopyShadingModal: true})} >Set Shading...</Button>}
                                &nbsp; &nbsp;
                                {cuttingsShow && <Button className='btn-primary-ref' bsSize="small" bsStyle="primary" onClick={() => this.setState({showAlfalfaCuttingsModal: true})} >Set Cuttings...</Button>}
                            </div>
                            {isOrchardCrop && 
                                 <AgeFactor onInputChange={this._onPlantingInputChange} isReadonly={isReadonly} planting={plantingInfo.data} />
                            }
                            {isVineCrop && 
                                 <MaxCanopyMeasure onInputChange={this._onPlantingInputChange} isReadonly={isReadonly} maxCanopyMeasure={plantingInfo.data.max_canopy_measure} />
                            }
                        </Panel.Heading>
                        <Panel.Body collapsible>
                             <div style={{maxHeight:"220px", overflowX:"auto"}}>
                                 <KCTable cropInfo={cropInfo} isReadonly={isReadonly} planting={plantingInfo.data} onPlantingChange={this._onPlantingInputChange} onChange={this._onKCChange.bind(this)} ></KCTable>
                             </div>
                        </Panel.Body>
                      </Panel>}
               </PanelGroup>
               <Row>
                   <div className="pull-right" style={{marginRight: '16px'}}>
                       <Button disabled={!allowSave} onClick={this._onSave.bind(this)} bsStyle="success">Save</Button>
                       &nbsp;
                       <Button onClick={this._onCancel.bind(this)}>Cancel</Button>
                   </div>
               </Row>
                       &nbsp;
            </Grid>
        )
    }
}

withRouter(PlantingsTab);

PlantingsTab.propTypes = {
}

const mapStateToProps = (state) => {
    let showUpdateBanner = state.plantingInfo.saveDone;

    // Block IDs will differ when a new block is selected from the parent
    // page. In that case we get the data passed down. Otherwise use the
    // current data. Must test all permutations of view,edit,save & cancel
    // if this logic is changed (on both the current and old plantings).
    let pi = state.plantingInfo;
    if (pi.block_id != state.blockInfo.blocks[0].id) {
        console.log(`load new block: -${pi.block_id}-, -${state.blockInfo.blocks[0].id}-`);
        pi =  state.blockInfo.active_planting;
        pi.block_id = state.blockInfo.blocks[0].id;
        showUpdateBanner = false;
        state.blockInfo.setConfigDirty && state.blockInfo.setConfigDirty(false);
        state.plantingInfo = pi;
    }
        
    // Copy over the stuff needed to render. Note that the user editable
    // block data is copied into the planting struct thereby keeping all
    // dynamic data in a single location.

    //Scale up to show as percentage. Do reverse on save.
    if (isNaN(pi.irrigation_efficiency)) {
        pi.irrigation_efficiency = -1;
    } else {
       //depending upon the flow this may, or may not have been scaled.
       let scaler = pi.irrigation_efficiency < 1.0 ? 100 : 1;
       pi.irrigation_efficiency = Math.round(pi.irrigation_efficiency * scaler);
    }

    //squelch react warnings about null values
    for (let key in pi) {
        if (pi[key] === null) pi[key] = '';
    }


    // convert slashes in dates to dash so datepicker parse not fail.
    // TODO: remove when server provides date in standard format.
    for (let i=0; i < pi.crop_stage_list.length; i++) {
        let stage = pi.crop_stage_list[i];
        let dateStr = stage.date_this_season;
        if (dateStr.indexOf('/') > 0) {
            let date = Date.parse(dateStr + ' 00:01');
            dateStr = new Date(date).toISOString().split('T')[0];
            stage.date_this_season = dateStr;
        }
    }

    // Can be removed when it is provided by the server
    pi.block_id = state.blockInfo.blocks[0].id;
    pi.ranch_id = state.blockInfo.blocks[0].ranch_id;
    pi.block_name = state.blockInfo.blocks[0].name
    pi.et_source_id = state.blockInfo.blocks[0].et_source_id;
    pi.et_source_id = pi.et_source_id === null ? '' : pi.et_source_id;
    pi.data = Object.assign({}, pi);
        
    //Must substitute, else picker not set to none
    if (state.blockInfo.blocks[0].et_source_id === null) {
        state.blockInfo.blocks[0].et_source_id = '';
    }
    
    let retVal = {
        blockInfo : state.blockInfo,
        plantingInfo: pi,
        showUpdateBanner: showUpdateBanner,
        showUpdateError: false, //Alert is used to show errors
    }
    return  retVal;
};

const mapDispatchToProps = (dispatch) => {
    return {
        deletePlanting: (id) => dispatch(deletePlantingInfo(id)),
        fetchPlanting: (id, blockId) => dispatch(getPlantingInfo(id, blockId)),
        updateAlfalfaCuttings: (planting, cuttingsList) => dispatch(saveCuttingsInfo(planting, cuttingsList)),
        updatePlantingInfo: (planting) => dispatch(updatePlantingInfo(planting)),
        updatePlanting: (planting, block) => dispatch(savePlantingInfo(planting, block)),
        updatePlantingBloomDate: (bloomDate) => dispatch(updatePlantingBloomDate(bloomDate)),
        updateCanopyShading: (planting, percentShade, date) => dispatch(saveCanopyPercentShading(planting, percentShade, date)),
        dismissStatusBanner: () => dispatch(clearPlantingInfoStatusMsg()),
    }
};

export {PlantingsTab};
export default connect(mapStateToProps, mapDispatchToProps)(PlantingsTab);
