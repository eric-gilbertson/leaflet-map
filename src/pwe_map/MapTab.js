/* Description:
 * Top level container for block dialog's configuration tab.
 * Note that the blockInfo struct is inherited from the parent
 * page, e.g no Ajax request for it.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Alert, DropdownButton, MenuItem, ButtonToolbar, Panel, PanelGroup, Button, Grid, Row, Col } from 'react-bootstrap/lib';

import {MapContainer} from './MapContainer';

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
        this.setState({mapType: mapType});
        console.log("handle map type: ", mapType);
      }
      this._handleMapType = this._handleMapType.bind(this);

    } // end constructor

    //NOTE: must return true in order to render.
    shouldComponentUpdate(nextProps, nextState) {
       return true;
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        return(
           <MapContainer mapType={this.state.mapType} mapTypeCallback={this._handleMapType} />
        )
    }
}

withRouter(MapTab);

MapTab.propTypes = {
}

const mapStateToProps = (state) => {
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export {MapTab};
export default connect(mapStateToProps, mapDispatchToProps)(MapTab);
