import { combineReducers } from 'redux'
import { projectList, projectInfo } from './ProjectReducers'
import { plantingInfo, blockInfo } from '../plantings_tab/PlantingsReducers'
import { equipmentInfo } from '../pwe_map/MapReducers'

const rootReducer = combineReducers({
  equipmentInfo,
  blockInfo,
  plantingInfo,
  projectInfo,
  projectList,
})

export default rootReducer;
