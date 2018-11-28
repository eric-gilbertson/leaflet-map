/* Description:
 * Top level container for block dialog's configuration tab.
 * Note that the blockInfo struct is inherited from the parent
 * page, e.g no Ajax request for it.
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {AddPumpPanel} from './AddPumpPanel';
import {EquipmentItemModal} from './EquipmentItemModal';
import {MapContainer} from './MapContainer';
import {hideEquipmentItemModal, getEquipmentList} from './MapActions';


class MapTab extends Component {
    constructor(props) {
      super(props);
 
      this.state = {
          mapType: 'leaflet',
      }

      this.pickMap = function(mapType, event) {
          console.log("pick map: ", mapType);
      }

      this._handleMapType = function(mapType, event) {
        //this.setState({mapType: mapType});
        console.log("handle map type: ", mapType);
      }
      this._handleMapType = this._handleMapType.bind(this);

    } // end constructor

    //NOTE: must return true in order to render.
    shouldComponentUpdate(nextProps, nextState) {
       return true;
    }

    componentDidMount() {
        console.log('xxxxxxxxxx MapTab::componentDidMount');
        this.props.fetchEquipment();
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        return(
          <div className='mapTab'>
           <EquipmentItemModal equipmentItem={this.props.equipmentItem} showIt={this.props.showEquipmentItemModal} onClose={this.props.clearModal} className='myModal' />
           <MapContainer equipmentList={this.props.equipmentList} mapType={this.state.mapType} mapTypeCallback={this._handleMapType} />
          </div>
        )
    }
}

withRouter(MapTab);

MapTab.propTypes = {
}

const mapStateToProps = (state) => {
    console.log('MapTab, mstp: ',    state.equipmentInfo);
    return {
        equipmentList: state.equipmentInfo.equipmentList,
        equipmentItem: state.equipmentInfo.equipmentItem,
        showEquipmentItemModal: state.equipmentInfo.showEquipmentItemModal,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchEquipment: () => dispatch(getEquipmentList()),
        clearModal: () => dispatch(hideEquipmentItemModal()),
    };
};

export {MapTab};
export default connect(mapStateToProps, mapDispatchToProps)(MapTab);
