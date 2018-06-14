/* Description:
 * This file implments the reducers for the planting, aka block
 * actions.
 */

import {  CLEAR_BLOCK_INFO, GET_PLANTING_INFO_DONE,  SAVE_PLANTING_INFO_DONE, SAVE_BLOCK_INFO_DONE, GET_BLOCK_INFO_DONE, UPDATE_PLANTING_BLOOM_DATE, UPDATE_PLANTING_KC_INFO, ADD_PLANTING_INFO_DONE, CLEAR_PLANTING_INFO_STATUS_MSG, DELETE_PLANTING_INFO_DONE }from './PlantingsActions';

//NOTE: must match signature of the server REST response.
const DUMMY_BLOCK_INFO = {};
export function blockInfo(state = DUMMY_BLOCK_INFO, action) {
  //console.log("xxxx enter blockInfo reducer: ", action.type);
  switch (action.type){
    case GET_BLOCK_INFO_DONE: {
        console.log("blockInfoDone: ", action.blockInfo);
        return action.blockInfo;
    }

    case SAVE_BLOCK_INFO_DONE: {
        console.log("saveBlockInfoDone: ", action.hasErrors);
        let bi = { ...action.state, hasErrors: action.hasErrors};
        return bi;
    }

    // Called after a planting update if it included block changes.
    case 'UPDATE_BLOCK_INFO': {
        let bi = action.blockInfo;
        if (bi && bi.block_name) {
            let newBlock = {...state};
            newBlock.blocks[0].name = bi.block_name;
            newBlock.blocks[0].ranch_id = bi.ranch_id;
            newBlock.blocks[0].et_source_id = bi.et_source_id;
            return newBlock;
        } else {
            return state;
        }
    }

    // Called after updating KC params for active planting, eg canopy shading.
    case UPDATE_PLANTING_KC_INFO: {
        let blockInfo = {...state};
        blockInfo.active_planting.crop_stage_list = action.stageList;
        return blockInfo;
    }

    case ADD_PLANTING_INFO_DONE: {
        let blockInfo = Object.assign({}, state);
        let refPlanting =blockInfo.plantings[0];
        let newPlanting = {};
        for (let key in refPlanting) {
            newPlanting[key] = action.plantingInfo[key];
        }
        //Assume that the added item is the most recent.
        blockInfo.plantings.unshift(newPlanting);
        return blockInfo;
    }

    case DELETE_PLANTING_INFO_DONE: {
        console.log("delete plainting info: ", action.plantingId);
        let blockInfo = Object.assign({}, state);
        let newPlantings = [];
        blockInfo.plantings = newPlantings;
        let refPlantings = state.plantings;
        for (let i=0; i < refPlantings.length; i++) {
            if (refPlantings[i].planting_id !== action.plantingId) {
                newPlantings.push(refPlantings[i]);
            }
        }
        return blockInfo;
    }

    case CLEAR_BLOCK_INFO:
        return DUMMY_BLOCK_INFO; //purge current data

    default:
        return state;
  }
}

// Clear flag that controls display of save done banner.
function clearSaveDoneFlag(curState) {
    let retVal = Object.assign({}, curState, {saveDone:null});
    return retVal;
}

const DUMMY_PLANTING_INFO = {};
export function plantingInfo(state = DUMMY_PLANTING_INFO, action) {
  switch (action.type){
    case GET_PLANTING_INFO_DONE: {
        let newPlantings = {...action.plantingInfo};
        console.log("enter getPlantingInfoDone: ", action.plantingInfo.name);
        return newPlantings;
    }

        
    case UPDATE_PLANTING_BLOOM_DATE: {
        let oldDate = state.crop_stage_list[0].date_this_season;
        let newInfo = {...state};
        let delta = new Date(action.bloomDate) - new Date(oldDate);
        let stages = newInfo.crop_stage_list;
        for (let i=0; i < stages.length; i++) {
            let oldTime = new Date(stages[i].date_this_season).getTime();
            stages[i].date_this_season = new Date(oldTime + delta).toISOString().split('T')[0];
        }

        if (newInfo.crop_class === 'Row') {
             console.log("Update date_planted for row crop");
             newInfo.date_planted = stages[0].date_this_season;
        }
             
            console.log("new date: ", newInfo.crop_stage_list[0].date_this_season);
        return newInfo;
    }

    case SAVE_PLANTING_INFO_DONE: {
        let retVal = Object.assign({}, action.plantingInfo, {saveDone: {hasErrors: false}});
        console.log("enter savePlantingInfoDone: ", action.plantingInfo.crop_varietal);
        return retVal;
    }

    case GET_BLOCK_INFO_DONE: {
        return clearSaveDoneFlag(state);
    }

    case CLEAR_PLANTING_INFO_STATUS_MSG: {
        return clearSaveDoneFlag(state);
    }

    case 'CLEAR_PLANTING_INFO':
        return DUMMY_PLANTING_INFO; //purge current data

    case 'UPDATE_PLANTING_INFO':
        let retVal = {...action.plantingInfo};
        return retVal;

    default:
        return state;
  }
}


