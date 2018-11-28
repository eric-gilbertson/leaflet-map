import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalHeader } from 'react-bootstrap/lib';

class AddPumpPanel extends Component {
  constructor(props){
    super(props);
     this.state = {
         haveLocation: false
     };
  }

  render()  {
    console.log('render addpump  panel: ', this.props);
    if (!this.props.showIt)
        return null;

     let errMsg = null;
     let hdrMsg = this.state.haveLocation ? "Enter pump details" : "Click to place your pump";
    return (
        <div style={{position:'absolute', right:'110px', top:'0px', height:'100px', width:'220px', border: '1px solid gray' }} className="panel-success">
            <div className="panel-heading">
                <span>
                    <i className="fa icon-with-right-margin fa-plus-circle fa-lg"></i>
                    <span> {hdrMsg}, {this.props.latlng} </span>
                </span>
            </div>
            <div style={{backgroundColor:'white'}} className="panel-body">
                <Button className='btn btn-default'>Cancel</Button>
            </div>
        </div>
    )}
}

AddPumpPanel.propTypes = {
    showIt: PropTypes.bool.isRequired,
};

withRouter(AddPumpPanel);

const mapStateToProps = (state) => {
    let retVal =  {
        latlng: state.equipmentInfo.latlng
    };
    console.log('add pump, map state to props: ',   retVal);
    return retVal;
};

const mapDispatchToProps = (dispatch) => {
    console.log('do dispatch: ');
    return {
    };
};

export {AddPumpPanel};
export default connect(mapStateToProps, mapDispatchToProps)(AddPumpPanel);
