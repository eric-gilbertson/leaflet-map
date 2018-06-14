import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Col, Button, Modal } from 'react-bootstrap/lib';
var DatePicker = require("react-bootstrap-date-picker");

const INITIAL_STATE = {percentShaded: '', dateMeasured: '', allowSave: false, };

class CanopyShadingModal extends Component {
    constructor(props) {
        super(props);

        this.state = INITIAL_STATE;
 
        this._onInputChange = function(event) {
           let name = event.target.name;
           let value = event.target.value;
           // TODO: figure out why this is needed to get update to work.
           if (name === 'percentShaded') {
               let allowSave = value && this.state.dateMeasured;
               this.setState({'percentShaded': value, 'allowSave':allowSave});
           } else {
               let allowSave = value && this.state.percentShaded;
               this.setState({'dateMeasured': value, 'allowSave':allowSave});
           }
        }
        this._onInputChange = this._onInputChange.bind(this);
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.showModal === false && nextProps.showModal === true)  {
            let shade = Math.round(this.props.percentShaded);
             
            this.setState({...INITIAL_STATE, percentShaded:shade});
        }

        return this.props.showModal || nextProps.showModal;
    }

    render() {

    return (
      <div>
        <Modal show={this.props.showModal}  onHide={() =>{this.props.onClose(null)}}>
          <Modal.Header closeButton>
            <Modal.Title>Canopy Shading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
             <Form style={{borderBottom:'0'}} horizontal>
                <FormGroup>
                   <Col sm={3}>
                     <label>Percent Shaded</label>
                   </Col>
                   <Col sm={4}>
                     <input className="form-control" onChange={this._onInputChange} name="percentShaded" value={this.state.percentShaded} type="number" min='0' max='100'/>

                   </Col>
                </FormGroup>
                <FormGroup>
                   <Col sm={3}>
                       <label htmlFor="date-measured"> Date Measured </label>
                   </Col>
                   <Col sm={4}>
                         <DatePicker id="date-measured" className="form-control" type="value"  onChange={(newDate) => {this._onInputChange({target:{name:'dateMeasured', value:newDate}})}} showClearButton={false} dateFormat="MM/DD/YYYY" value={this.state.dateMeasured}  name="dateMeasured"></DatePicker>
                   </Col>
                </FormGroup>
             </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={!this.state.allowSave} onClick={() => {this.props.onClose(this.state.percentShaded, this.state.dateMeasured)}} className="btn btn-primary">Save</Button>
            <Button onClick={() => {this.props.onClose(null, null)}}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
  )
  }
}

CanopyShadingModal.propTypes = {
    percentShaded: PropTypes.number.isRequired,
    showModal: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

export {CanopyShadingModal};
