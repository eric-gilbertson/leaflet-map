import React, { Component } from 'react'
import { Modal, ModalBody, ModalHeader } from 'react-bootstrap/lib';
import { Popup, Tooltip, Polyline, Map, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {mapClick, editEquipmentItem} from './MapActions';
import { connect } from 'react-redux';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconSize: new L.Point(24, 24),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    /* iconUrl: require('leaflet/dist/images/marker-icon.png'), */
    iconUrl: 'http://localhost:8080/images/pump-selected.png',
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


class LeafletMap extends Component {
    constructor(props) {
      super(props);
      this._onMarkerClick = function(ei) {
          console.log('maker click: ', ei);
          this.props.showEquipmentItemModal(ei);
          //this.setState({showModal:true});
      }
      this._onMarkerClick = this._onMarkerClick.bind(this);
    }

  static defaultProps = {
    mapAttribution: "&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors",
    mapUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    mapUrlEsri: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',

  }

  state = {
    center: { lat: 36.602799, lng: -120.124584 },
    zoom: 13,
    showModal: false,
  }

  render() {
    let equipment_list = this.props.equipment;
    let clickHandler = this._onMarkerClick;
    console.log("render leaflet: ");

    let map = <Map onClick={(arg)=>{console.log("map click", arg.latlng); this.props.sendMapClick({lat:arg.latlng.lat,lng:arg.latlng.lng}) }} onZoomStart={() => {console.log('zoomed')}} center={this.state.center} zoom={this.state.zoom}>


        <TileLayer
          attribution={this.props.mapAttribution}
          url={this.props.mapUrlEsri}
        />

        {equipment_list.map(function(ei, index) {
                let lat = ei.location.lat;
                let lng = ei.location.lng;
                let marker =  <Marker onClick={() => clickHandler(ei)} key={ei.id} id={ei.id} position={[lat, lng]}>
                        <Tooltip> 
                            <span>{ei.name}</span>
                        </Tooltip>
                    </Marker>;
                return(marker);
            })
        }
      </Map>;
    return (map);
  }
}

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showEquipmentItemModal: (ei) => dispatch(editEquipmentItem(ei)),
        sendMapClick: (location) => dispatch(mapClick(location)),
    };
};

export {LeafletMap};
export default connect(mapStateToProps, mapDispatchToProps)(LeafletMap);
