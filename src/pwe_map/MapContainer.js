/* Description:
 * Top level container for block dialog's configuration tab.
 * Note that the blockInfo struct is inherited from the parent
 * page, e.g no Ajax request for it.
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MenuItem, DropdownButton } from 'react-bootstrap/lib';
import {AddPumpPanel} from './AddPumpPanel';


import GoogleMap from './GoogleMap';
import LeafletMap from './LeafletMap';

//export const MapContainer = ({mapType, mapTypeCallback, equipmentList}) => {
class MapContainer extends Component {
    constructor(props) {
      super(props);

      this.state = {
          mapType: 'leaflet',
          showAddPump: false,
      }
    }

      render() {
        let mapType = 'leaflet';
        return(
          <div className="pwe-map">
            {mapType === 'leaflet' && <LeafletMap equipment={[]}></LeafletMap>}
            {mapType === 'google' && <GoogleMap equipment={[]}></GoogleMap>}

            <div className='pwe-map-menu'>
              <DropdownButton id='map-type' title="Options" bsStyle="default">
                <MenuItem onSelect={()=>{console.log('xxx'); this.setState({showAddPump:true})}} eventKey="addPump">Add Pump</MenuItem>
                <MenuItem eventKey="google">Google</MenuItem>
                <MenuItem eventKey="leaflet">Leaflet</MenuItem>
              </DropdownButton>
           <AddPumpPanel showIt={this.state.showAddPump} />
            </div>
          </div>
        )
    }
}

withRouter(MapContainer);

MapContainer.propTypes = {
    mapType: PropTypes.string.isRequired,
    mapChangeCallback: PropTypes.func,
}

const mapStateToProps = (state) => {
    console.log("MapContainer, mstp: ", state.equipmentInfo);
    return {};
};

const mapDispatchToProps = (dispatch) => {
   return {};
};

export {MapContainer};
export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);

