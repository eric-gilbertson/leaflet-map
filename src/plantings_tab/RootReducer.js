import { combineReducers } from 'redux'
import { plantingInfo, blockInfo } from './PlantingsReducers'

const rootReducer = combineReducers({
    plantingInfo,
    blockInfo,
})


export default rootReducer;
