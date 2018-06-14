import { combineReducers } from 'redux'
import { projectList, projectInfo } from './ProjectReducers'
import { plantingInfo, blockInfo } from '../plantings_tab/PlantingsReducers'

const rootReducer = combineReducers({
  blockInfo,
  plantingInfo,
  projectInfo,
  projectList,
})

export default rootReducer;
