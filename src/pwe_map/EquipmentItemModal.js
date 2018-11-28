import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalHeader } from 'react-bootstrap/lib';
import { connect } from 'react-redux';
import { hideEquipmentItemModal, editEquipmentItem } from './MapActions';

class EquipmentItemModal extends Component {
  constructor(props){
    super(props);
     this.state = {};
  }

  render()  {
    console.log('render ei modal: ', this.props);
    if (!this.props.showIt)
        return null;

    return (
      <div>
      <Modal show={this.props.showIt} onHide={()=>{this.props.onClose()}}>
        <ModalHeader closeButton>
            Edit {this.props.equipmentItem.name}
        </ModalHeader>
        <ModalBody>
        </ModalBody>
          <Modal.Footer>
            <Button onClick={() => {this.props.onClose()}} className="btn btn-primary">Save</Button>
            <Button onClick={() => {this.props.onClose()}}>Cancel</Button>
          </Modal.Footer>
      </Modal>
    </div>)
  }
}

EquipmentItemModal.propTypes = {
    showIt: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

/*
withRouter(EquipmentItemModal);

const mapStateToProps = (state) => {
    let retVal =  {
        equipmentItem: state.equipmentInfo.equipmentItem,
        showEquipmentItemModal: state.equipmentInfo.showEquipmentItemModal,
    };
    console.log('show it: ',   retVal);
    return retVal;
};

const mapDispatchToProps = (dispatch) => {
    console.log('do dispatch: ');
    return {
        clearModal: () => dispatch(hideEquipmentItemModal()),
    };
};
*/

export {EquipmentItemModal};
//export default connect(mapStateToProps, mapDispatchToProps)(EquipmentItemModal);
