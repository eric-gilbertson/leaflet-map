import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

export default class LeafletMap extends Component {
  static defaultProps = {
    mapAttribution: "&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors",
    mapUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    mapUrlEsri: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',

  }

  state = {
    center: { lat: 36.6777, lng: -121.6555 },
    zoom: 22,
  }

  render() {
    return (
      <Map onZoomStart={() => {console.log('zoomed')}} center={this.state.center} zoom={this.state.zoom}>
        <TileLayer
          attribution={this.props.mapAttribution}
          url={this.props.mapUrlEsri}
        />
        <Marker position={this.state.center}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Map>
    )
  }
}
