/* Description:
 * Top level container for block dialog's configuration tab.
 * Note that the blockInfo struct is inherited from the parent
 * page, e.g no Ajax request for it.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Alert, DropdownButton, MenuItem, ButtonToolbar, Panel, PanelGroup, Button, Grid, Row, Col } from 'react-bootstrap/lib';

import GoogleMap from './GoogleMap';
import LeafletMap from './LeafletMap';

export const MapContainer = ({mapType, mapTypeCallback}) => {
        return(
          <div className="pwe-map">
            {mapType === 'leaflet' && <LeafletMap></LeafletMap>}
            {mapType === 'google' && <GoogleMap></GoogleMap>}

            <div className='pwe-map-menu'>
              <DropdownButton title="Options" bsStyle="default">
                <MenuItem onSelect={mapTypeCallback} eventKey="google">Google</MenuItem>
                <MenuItem onSelect={mapTypeCallback} eventKey="leaflet">Leaflet</MenuItem>
              </DropdownButton>
            </div>
          </div>
        )
}

MapContainer.propTypes = {
    mapType: PropTypes.string.isRequired,
    mapChangeCallback: PropTypes.func,
}

const mapStateToProps = (state) => {
};

