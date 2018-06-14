/* Description:
 * Initalize react & define routes to the two 
 * views: enerty lising  & project edit.
 */
import React from 'react';
import { Provider } from 'react-redux'
import { render } from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import configureStore from './store/configureStore';
import ProjectEdit from './components/ProjectEdit';
import ProjectList from './components/ProjectList';
import {PumpPicker} from './components/PumpPicker';
import { getBlockInfoDone }  from './plantings_tab/PlantingsActions';
import MapTab from './pwe_map/MapTab';
import PlantingsTab from './plantings_tab/PlantingsTab';
import PlantingsRoot from './plantings_tab/PlantingsRoot';
//import {IrrigationConfigWizardApp} from './config_wizard/irrigationConfigurationWizard';
import {BLOCK_INFO} from './plantingsDB';

let store = configureStore({blockInfo:BLOCK_INFO});

export function renderPlantingsTab(blockInfo) {
    console.log("planting_update: ", blockInfo.header_string);
    store.dispatch(getBlockInfoDone(blockInfo));
}


console.log("map store: ", store);
render(
    <Provider store={store}>
      <Router>
        <div>
          <Route exact path='/' render={() => <PlantingsRoot />}/>
          <Route exact path='/tab' render={() => <PlantingsTab />}/>
          <Route exact path='/projects' component={ProjectList} />
          <Route exact path='/pumps' component={PumpPicker} />
          <Route exact path='/map' component={MapTab} />
          <Route path='/project/:projectId' component={ProjectEdit} />
        </div>
      </Router>
    </Provider>,
    document.getElementById('app')
);
registerServiceWorker();

//<Route exact path='/wizard' render={() => <IrrigationConfigWizardApp />}/>
