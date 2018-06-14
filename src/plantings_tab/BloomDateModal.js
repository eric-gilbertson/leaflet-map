import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Col, Button, Modal} from 'react-bootstrap/lib';
var DatePicker = require("react-bootstrap-date-picker");

const INITIAL_STATE = {bloomDate:'', bloomName:''};
class BloomDateModal extends Component {
    constructor(props) {
        super(props);

        this.state = INITIAL_STATE;
 
        this.componentWillReceiveProps = function() {
            let newState = {...INITIAL_STATE};
            if (this.props.firstStage !== undefined) {
                newState.bloomDate = this.props.firstStage.date_this_season;
                newState.bloomName = this.props.firstStage.name;
            }
            this.setState(newState);
        }

        this._onInputChange = function(event) {
           let value = event.target.value;
           this.setState({'bloomDate': value});
        }
        this._onInputChange = this._onInputChange.bind(this);
    }
    

    render() {
        let bloomName = this.state.bloomName;
    return (
      <div>
        <Modal show={this.props.showModal}  onHide={() =>{this.props.onClose(null)}}>
          <Modal.Header closeButton>
            <Modal.Title>{bloomName} Date</Modal.Title>
          </Modal.Header>
          <Modal.Body>
             <Form style={{borderBottom:'0'}} horizontal>
                <FormGroup>
                   <Col sm={3}>
                       <label htmlFor="bloom-date"> *{bloomName} Date </label>
                   </Col>
                   <Col sm={4}>
                         <DatePicker id="bloom-date" className="form-control" type="value"  onChange={(newDate) => {this._onInputChange({target:{name:'bloomDate', value:newDate}})}} showClearButton={false} dateFormat="MM/DD/YYYY" value={this.state.bloomDate}  name="bloom-date"></DatePicker>
                   </Col>
                </FormGroup>
                <label>*</label> Date when crop is 25% in {bloomName.toLowerCase()}.
             </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={!this.state.bloomDate} onClick={() => {this.props.onClose(this.state.bloomDate)}} className="btn btn-primary">Update</Button>
            <Button onClick={() => {this.props.onClose(null, null)}}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
  )
  }
}

BloomDateModal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    firstStage: PropTypes.object.isRequired,
}

export {BloomDateModal};
