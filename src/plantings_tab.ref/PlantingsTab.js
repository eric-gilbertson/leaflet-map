/* Description:
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import JSONPretty from 'react-json-pretty';


import { ButtonToolbar, Panel, PanelGroup, Button, Grid, Row, Col } from 'react-bootstrap/lib';

import { PlantingsList } from './PlantingsList';
import { PlantingDetail } from './PlantingDetail';
import { IrrigationDetail } from './IrrigationDetail';
import * as actionCreators from './PlantingsActions';

class PlantingsTab extends Component {
    constructor(state) {
      super(state);
 
      console.log("xxxxxxxx init PlantingsTab: ", state);

      this.handleSelect = this.handleSelect.bind(this);
      this.handleCropChange = this.handleCropChange.bind(this);

      this.state = {
        expandedPanelAr: [false, true, false], 
        blockInfo: state.blockInfo2,
        activePlanting: null,
        showIrrigation: false,
      };

      this._addPlanting = function() {
          console.log("add planting");
          let epa = this.state.expandedPanelAr.slice();
          epa[0] = true;
          this.setState({expandedPanelAr: epa});
      }

      this._onPlantingSelect = function(index) {
          let epa = this.state.expandedPanelAr.slice();
          epa[0] = true;
          let activePlanting =  this.props.blockInfo.plantings[index];
          let newState = {
            activePlanting: activePlanting,
            expandedPanelAr: epa,
          };
          this.setState(newState);
         
          console.log("set state: ", index, ", ", this.props)
          //this.props.actions.getPlantingInfo(activePlanting.id);
          //this.props.actions.getBlockInfo(activePlanting.id);
      }
    } // end constructor

    shouldComponentUpdate(nextProps, nextState) {
        console.log("shouldComponentUpdate");
        return true;
    }
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

    render() {
       console.log("xxxxx plantings_tab enter render: props:", this.state);
       let myBlockInfo = this.state.blockInfo ? this.state.blockInfo : this.props.blockInfo;
       if (!myBlockInfo) {
           return (`Loading.... `);
       }

       let myBlock = myBlockInfo.blocks[0];
       let myPlantings = myBlockInfo.plantings;
       let myRanches = myBlockInfo.ranches;
       let activePlanting = myBlockInfo.plantings[0];

       //TODO: get this from the DB.
       let isRowCrop = false;
       let isTreeCrop = false;
       let isVineCrop = false;


        return(
            <Grid fluid={true}>
                <Row>
                    <JSONPretty style={{maxHeight:"200px"}} id="json-pretty" json={this.props.blockInfo}></JSONPretty>
                </Row>
                <Row>
                   <Col xs={6}>
                    <span className='visible-xs-block'>XS</span>
                    <span className='visible-sm-block'>SM</span>
                    <span className='visible-md-block'>MD</span>
                    <span className='visible-lg-block'>LG</span>
                    </Col>
                </Row>
                <Row style={{'marginBottom' : '8px'}}>
                    <Col xs={6}>
                        <label htmlFor="blockName">Name</label>
                        <input className="form-control" type="text" defaultValue={myBlock.name}  name="blockName"></input>
                    </Col>
                    <Col xs={6}>
                        <label htmlFor="blockRanch">Ranch</label>
                        <br/>
                        <select defaultValue={myBlock.ranch.id} className="form-control" name="blockRanch">
                            {myBlockInfo.ranches.map(function (ranch, index) {
                                return (
                                    <option key={index} value={ranch[0]}>{ranch[1]}</option>
                                );
                            })}
                        </select>
                    </Col>
                </Row>

                <PanelGroup id="plantings-panel">
                      <Panel eventKey="0" expanded={this.state.expandedPanelAr[0]}>
                        <Panel.Heading>
                            <h4 onClick={() => this.handleSelect(0)} className="panel-title"><i className={'fa fa-fw fa-chevron-' + (this.state.expandedPanelAr[0] ? 'down' : 'up')}></i>Planting Details</h4>
                        </Panel.Heading>
                        <Panel.Body id="planting-details" collapsible>
                            { false && 
                            <PlantingDetail planting={activePlanting}></PlantingDetail>
                            }
                            { this.state.showIrrigation &&
                                <IrrigationDetail isTreeCrop={isTreeCrop} isRowCrop={isRowCrop}></IrrigationDetail>
                            }
                        </Panel.Body>
                      </Panel>

                      <Panel eventKey="1" expanded={this.state.expandedPanelAr[1]}>
                        <Panel.Heading>
                            <h4 onClick={() => this.handleSelect(1)} className="panel-title"><i className={'fa fa-fw fa-chevron-' + (this.state.expandedPanelAr[1] ? 'down' : 'up')}></i>Plantings - {activePlanting.name}</h4>
                            <Button style={{marginTop: '-24px'}} className="pull-right" bsSize="small" onClick={this._addPlanting.bind(this)} bsStyle="primary">Add Planting...</Button>
                        </Panel.Heading>
                        <Panel.Body collapsible>
                            <PlantingsList plantingsList={myBlockInfo.plantings} onPlantingSelect={this._onPlantingSelect.bind(this)} ></PlantingsList>
                        </Panel.Body>
                      </Panel>
                      <Panel eventKey="2" expanded={this.state.expandedPanelAr[2]}>
                        <Panel.Heading>
                            <h4 onClick={() => this.handleSelect(2)} className="panel-title"><i className={'fa fa-fw fa-chevron-' + (this.state.expandedPanelAr[2] ? 'down' : 'up')}></i>Crop Stages & KC Table</h4>
                        </Panel.Heading>
                        <Panel.Body collapsible>
                            <div> KC table here</div>
                        </Panel.Body>
                      </Panel>
               </PanelGroup>
               <Row>
                   <Col smOffset={4} sm={4}>
                       <Button bsStyle="success">Save</Button>
                       &nbsp;
                       <Button >Cancel</Button>
                   </Col>
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
    console.log("xxxxxxxxxxxxxxx exit mapStateToProps: ", state);
    let ap = state.blockInfo.plantings ? state.blockInfo.plantings[0] : {};
    let retVal = {
        blockInfo : state.blockInfo2,
        activePlanting: ap,
    }
    return  retVal;
};

const mapDispatchToProps = (dispatch) => {
    console.log("enter mapDispatchToProps: ");
    return {
        actions: bindActionCreators(actionCreators, dispatch)
   };
};

export {PlantingsTab};
export default connect(mapStateToProps, mapDispatchToProps)(PlantingsTab);
