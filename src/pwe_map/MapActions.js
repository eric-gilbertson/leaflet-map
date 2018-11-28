/* Description:
 * This file implements the actions require to get the equipment
 * data from the server detail REST quries.
 */

// Set true when working with spoofing server.
const DEV_MODE=true;
const REQUEST_OPTIONS = {};

// constants used to identify the block info actions
export const GET_EQUIPMENT_LIST = 'GET_EQUIPMENT_LIST';
export const CLEAR_EQUIPMENT_LIST = 'CLEAR_EQUIPMENT_LIST';
export const GET_EQUIPMENT_LIST_DONE = 'GET_EQUIPMENT_LIST_DONE';
export const EDIT_EQUIPMENT_ITEM = 'EDIT_EQUIPMENT_ITEM';
export const HIDE_EQUIPMENT_ITEM_MODAL = 'HIDE_EQUIPMENT_ITEM_MODAL';
export const MAP_CLICK = 'MAP_CLICK';

export function mapClick(location) {
    console.log('mapClick event: ', location);
    return {
        type: MAP_CLICK,
        latlng: location,
    };
}
export function getEquipmentListDone(equipmentList) {
    return {
        type: GET_EQUIPMENT_LIST_DONE,
        equipmentList
    };
}

export function clearEquipmentList() {
    return {
        type: CLEAR_EQUIPMENT_LIST,
    };
}
export function editEquipmentItem(ei) {
    console.log("create ei: ", ei);
    return {
        type: EDIT_EQUIPMENT_ITEM,
        equipmentItem: ei,
    };
}
export function hideEquipmentItemModal() {
    return {
        type: HIDE_EQUIPMENT_ITEM_MODAL,
    };
}

export function getEquipmentList(id) {
    return (dispatch) => {
        let url = 'http://localhost:8080/equipment';

            fetch(url, REQUEST_OPTIONS)
                .then((response) => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response;
                })
                .then((response) => response.json())
                .then(function(elist) {
                    console.log("elist: ", elist.length);
                    dispatch(getEquipmentListDone(elist));
                }).catch((ex) => {
                    console.log("Error: equipment list", ex);
                    dispatch(clearEquipmentList());
                });
   }
}

