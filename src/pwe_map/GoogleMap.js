import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
const AnyReactComponent = ({ text }) => <div>{ text }</div>;

function createMapOptions(maps) {
  // next props are exposed at maps
  // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
  // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
  // "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
  // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
  // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
  return {
    zoomControlOptions: {
      position: maps.ControlPosition.RIGHT_CENTER,
      style: maps.ZoomControlStyle.SMALL
    },
    mapTypeControlOptions: {
      position: maps.ControlPosition.BOTTOM_RIGHT
    },
    mapTypeControl: true,
    mapTypeId: maps.MapTypeId.HYBRID
  };
}

export default class GoogleMap extends Component {
  static defaultProps = {
    center: [36.6777, -121.6555 ],
    zoom: 22
  }

  constructor(props) {
      super(props);

      this.drawMarkers = function() {
          console.log('xxxxxxxxxxxxx draw markers');
      }
  }

  render() {
      return (
        <div className='pwe-map'>
          <GoogleMapReact
            bootstrapURLKeys={{key:'AIzaSyC7Y5R8tIWSHu7qWpmE3RbugSYK8JFYnxM'}}
            defaultCenter={ this.props.center }
            defaultZoom={ this.props.zoom }
            options={createMapOptions}
            onGoogleApiLoaded={this.drawMarkers.bind(this)}
            yesIWantToUseGoogleMapApiInternals={true}>
            <AnyReactComponent
              lat={ 40.7473310 }
              lng={ -73.8517440 }
              text={ 'Where is Waldo?' }
            />
          </GoogleMapReact>
        </div>
      )
    }
}
