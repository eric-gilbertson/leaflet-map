import React, { Component }  from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import  PlantingsTab  from './PlantingsTab';
import { getBlockInfoDone } from './PlantingsActions';


const REQUEST_OPTIONS = {
    credentials: "same-origin",
    'Access-Control-Allow-Origin' : '*',
    'content-type': 'application/json',
};

class PlantingsRoot extends Component {
    constructor(props) {
        super(props);

        this.state = {
            blockInfo: {active_planting:{}},
            plantingInfo: {},
        };

        this.onBlockChange = function(event) {
           console.log('block change: ', event.target.value);
           this.fetchBlock(event.target.value);
           //this.props.fetchBlock(event.target.value);
        }
        this.onBlockChange = this.onBlockChange.bind(this);

        this.fetchBlock = function(blockId) {
            let that = this;
            let url = `http://localhost:8080/farm/blocks/${blockId}`;
            console.log('fetch block: ', blockId);
                 fetch(url, REQUEST_OPTIONS)
                     .then((response) => {
                         if (!response.ok) {
                             throw Error(response.statusText);
                         }
                         return response;
                     })
                     .then((response) => response.json())
                     .then(function(block) {
                         console.log(' update block info');
                         //renderPlantingsTab(block);
                         that.props.updateBlock(block);
                         that.setState({plantingInfo: block.active_planting, blockInfo: block});
                         console.log('xxxxxx');
                     }).catch((ex) => {
                         console.log("Error: fetching blockInfo ", ex);
                         //dispatch(clearBlockInfo());
                     });
            }

   }
   shouldComponentRender() {
      console.log('shouldComponentRender');
      return true;
   }

   render () {
    console.log("xxxxxxxx PlantingsRoot: ");
    return(
      <div>
        <span>Block:</span>
        <select onChange={this.onBlockChange}>
            <option value='440'>E-40</option>
            <option value='1034'>Bottom Avos</option>
        </select>
        <PlantingsTab />
      </div>
    )
   }
}

withRouter(PlantingsRoot);

PlantingsRoot.propTypes = {
}


const mapStateToProps = (state) => {
    return {};
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateBlock: (blockInfo) => dispatch(getBlockInfoDone(blockInfo)),
    }
}
export {PlantingsRoot};
console.log("xxxxxxxx call connect");
export default connect(mapStateToProps, mapDispatchToProps)(PlantingsRoot);
