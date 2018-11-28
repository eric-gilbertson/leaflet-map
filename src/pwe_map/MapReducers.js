/* Description:
 * This file implments the reducers for equipment list.
 */

import { HIDE_EQUIPMENT_ITEM_MODAL, EDIT_EQUIPMENT_ITEM, GET_EQUIPMENT_LIST_DONE, CLEAR_EQUIPMENT_LIST, MAP_CLICK } from './MapActions';

//NOTE: must match signature of the server REST response.
const DUMMY_EQUIPMENT_INFO = {showEquipmentItemModal: false, equipmentItem:null, equipmentList:[]};
export function equipmentInfo(state = DUMMY_EQUIPMENT_INFO, action) {
  console.log("dispatch ei: ", action.type);
  switch (action.type){
    case GET_EQUIPMENT_LIST_DONE: {
        console.log("equipmentListDone: ", action.equipmentList.length);
        let newState = Object.assign({}, state);
        newState.equipmentList = action.equipmentList;
        return newState
    }

    case EDIT_EQUIPMENT_ITEM: {
        console.log("edit ei: ", action.equipmentItem);
        let newState = Object.assign({}, state);
        newState.showEquipmentItemModal = true;
        newState.equipmentItem = action.equipmentItem;
        return newState
    }

    case HIDE_EQUIPMENT_ITEM_MODAL: {
        console.log("clear ei: ");
        let newState = Object.assign({}, state);
        newState.showEquipmentItemModal = false;
        return newState
    }

    case CLEAR_EQUIPMENT_LIST: {
        let newState = Object.assign({}, state);
        newState.equipmentList = [];
        return newState
    }

    case MAP_CLICK: {
        console.log('add latlng: ', action.latlng);
        let newState = Object.assign({}, state);
        newState.latlng = action.latlng;
        return newState
    }

    default:
        return state;
  }
}

