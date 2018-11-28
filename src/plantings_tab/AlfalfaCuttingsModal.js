/* Description:
 * This modal manages the alfalfa cutting dates. Alfalfa is ususally cut
 * several times during a growing season and this in turn drives a reset of
 * the KC table.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal} from 'react-bootstrap/lib';
var DatePicker = require("react-bootstrap-date-picker");

// list of date/number pairs.
const INITIAL_STATE = {rowCount:0, cuttingsList:[]};
const ROW_AR = [1,2,3,4,5,6,7,8,9];

class AlfalfaCuttingsModal extends Component {
    constructor(props) {
        super(props);

        this.state = INITIAL_STATE;

        this.componentWillReceiveProps = function() {
            let newState = {...INITIAL_STATE};
            //Must do deep copy here, 
            let cuttingsList = [];
            for(let i = 0; i < this.props.cuttingsList.length; i++) {
                let cut = this.props.cuttingsList[i];
                cuttingsList.push({drying_days:cut.drying_days, cut_date: cut.cut_date});
            }
            newState.cuttingsList = cuttingsList;
            newState.rowCount = cuttingsList.length;
            this.setState(newState);
        }

        this._onRowCountChange  = function(event) {
            let newCuttings = this.state.cuttingsList.slice();
            let newCount = event.target.value;
            if (newCount < newCuttings.length) {
                newCuttings.length = newCount;
            } else if (newCount > newCuttings.length) {
                for(let i=newCuttings.length; i < newCount; i++) {
                    newCuttings.push({drying_days: 0, cut_date: null});
                }
            }
            this.setState({rowCount: newCount, cuttingsList: newCuttings});
        }
        this._onRowCountChange = this._onRowCountChange.bind(this);

 
        this._onRowInputChange = function(event) {
           let newCuttings = this.state.cuttingsList.slice();
           let tname = event.target.name;
           let tvalue = event.target.value;

           let rowNum = event.target.getAttribute ? event.target.getAttribute('data-row') : event.target.row;

           // value must be an int or null, else React complains
           if (tname === 'drying_days') {
               tvalue = tvalue === '' ? null : parseInt(tvalue, 10);
           }

           newCuttings[rowNum][tname] = tvalue;
           this.setState({cuttingsList: newCuttings});
        }
        this._onRowInputChange = this._onRowInputChange.bind(this);
    }

    

    render() {
        let cuttingsList = this.state.cuttingsList;
        if (cuttingsList === undefined) {
           return null;
        }

        return (
          <div>
            <Modal show={this.props.showModal} onHide={() =>{this.props.onClose(null)}}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Cuttings</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <label>Season Cuttings:</label>
                  <select style={{width:"70px", display:"inline-block"}} className="form-control" onChange={this._onRowCountChange} value={this.state.rowCount}>
                      {ROW_AR.map(function(rowNum,index) {
                           return(<option key={index} value={rowNum}>{rowNum}</option>);
                      })}
                  </select>
                </div>
                <br/>
    
                <table className="table table-bordered margin-bottom header-fixed">
                  <thead>
                    <tr>
                        <th>Date</th>
                        <th>Drying Days</th>
                    </tr>
                </thead>
                {cuttingsList && 
                    <tbody>{cuttingsList.map((cutting, index) => { 
                        return(
                            <tr key={index}>
                              <td>
                                <DatePicker className={"form-control"} type="value"  showClearButton={false} dateFormat="MM/DD/YYYY" onChange={(newDate) => {this._onRowInputChange({target:{name:'cut_date', value:newDate, row:index}})}} value={cutting.cut_date}  name="cut_date"></DatePicker>
                              </td>
                              <td>
                                <input type="number" name="drying_days" className="form-control" min="0" max="30" step="1"   onChange={(event) => {this._onRowInputChange({target:{name:'drying_days', value:event.target.value, row:index}})}} value={cutting.drying_days}/>
                              </td>
                            </tr>)})
                    }</tbody>
                 }
              </table>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => {this.props.onClose(this.state.cuttingsList)}} className="btn btn-primary">Save</Button>
                <Button onClick={() => {this.props.onClose(null)}}>Cancel</Button>
              </Modal.Footer>
            </Modal>
          </div>
      )
    }
}

AlfalfaCuttingsModal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    cuttingsList: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
}

export {AlfalfaCuttingsModal};
