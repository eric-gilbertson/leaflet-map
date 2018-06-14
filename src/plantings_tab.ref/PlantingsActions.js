/* Description:
 * This file implements the actions require to get the block,
 * and plantings data from the server detail REST quries.
 */

// Unlike ajax, fetch requires the credentials header.
// Use this global for all our fetch requests.
//import { checkHttpStatus, parseJSON, getCsrfToken } from '../../../utils';

const REQUEST_OPTIONS = {
    credentials: "same-origin",
    'Access-Control-Allow-Origin' : '*',
    'content-type': 'application/json',
};

// constants used to identify the block info actions
export const CLEAR_BLOCK_INFO = 'CLEAR_BLOCK_INFO';
export const GET_BLOCK_INFO = 'GET_BLOCK_INFO';

export const GET_BLOCK_INFO_DONE = 'GET_BLOCK_INFO_DONE';
export const SAVE_BLOCK_INFO_DONE = 'SAVE_BLOCK_INFO_DONE';

export function getCsrfToken(name) {
  let match = document.cookie.match(new RegExp('(^| )csrftoken=([^;]+)'));
  if (match) return match[2];
}

export function getBlockInfoDone(block) {
    return {
        type: GET_BLOCK_INFO_DONE,
        blockInfo:block,
    };
}

export function clearBlockInfo() {
    return {
        type: CLEAR_BLOCK_INFO,
    };
}
export function saveBlockInfoDone() {
    return {
        type: SAVE_BLOCK_INFO_DONE,
    };
}

export function getBlockInfo(id) {
    return (dispatch) => {
        const url = `/farm/blocks?block_id=${id}&include_irrigation_config_status=true&include_growing_seasons=true`;
        //const url = `http://localhost:8080/farm/blocks/1`

            fetch(url, REQUEST_OPTIONS)
                .then((response) => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response;
                })
                .then((response) => response.json())
                .then(function(block) {
                    console.log('xxxxxxxxxxxxxxxxxx got data');
                    dispatch(getBlockInfoDone(block));
                }).catch((ex) => {
                    console.log("Error: fetching blockInfo ", ex);
                    dispatch(clearBlockInfo());
                });
   }
}

// constants used to identify the planting info actions
export const CLEAR_PLANTING_INFO = 'CLEAR_PLANTING_INFO';
export const GET_PLANTING_INFO = 'GET_PLANTING_INFO';

export const GET_PLANTING_INFO_DONE = 'GET_PLANTING_INFO_DONE';
export const SAVE_PLANTING_INFO_DONE = 'SAVE_PLANTING_INFO_DONE';

export function getPlantingInfoDone(planting) {
    return {
        type: GET_PLANTING_INFO_DONE,
        plantingInfo: planting,
    };
}

export function clearPlantingInfo() {
    return {
        type: CLEAR_PLANTING_INFO,
    };
}
export function savePlantingInfoDone() {
    return {
        type: SAVE_PLANTING_INFO_DONE,
    };
}

export function getPlantingInfo(id) {
    return (dispatch, getState) => {
        const url = `/irrigation/planting?planting_id=${id}`;
        //const url = `http://localhost:8080/irrigation/planting/1`;

            fetch(url, REQUEST_OPTIONS)
                .then((response) => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response;
                })
                .then((response) => response.json())
                .then(function(planting) {
                    console.log('xxxxxxxxxxxxxxxxxx got data');
                    dispatch(getPlantingInfoDone(planting));
                }).catch((ex) => {
                    console.log("Error: fetching plantingInfo ", ex);
                    dispatch(clearPlantingInfo());
                });
   }
}


/*
export function getBlockList() {
    return (dispatch) => {

        let url = '/dashboard/api/blocks/';
        fetch(url, REQUEST_OPTIONS).then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response;
            })
            .then((response) => response.json())
            .then(function (blockList) {
               dispatch(getBlockListDone(blockList));
            }).catch(function(ex) {
               console.log("dispatch blockListErrored: ", ex); 
            });
    };
}

export function deleteBlock(blockId) {
    return (dispatch) => {
        const url = `/dashboard/api/blocks/${blockId}/`;
        const options = {
            method: 'DELETE', 
            credentials: "include",
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'X-CSRFToken': getCsrfToken(),
            },
        };

        fetch(url, options).then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response;
        }).then(function () {
            dispatch(getBlockList());
        }).catch(function(ex) {
            console.log("Block delete error: ", ex); 
        });
    };
}


export function savePlantingInfo(blockInfo) {
    return (dispatch) => {
        let asset_keys = [];
        for (let i=0; i < blockInfo.ranches.length; i++) {
            if (blockInfo.ranches[i].selected) {
                asset_keys.push(blockInfo.ranches[i].asset_key);
            }
        }
        blockInfo.asset_keys = asset_keys;

        const options = { 
            method: 'POST', 
            credentials: "include",
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'X-CSRFToken': getCsrfToken(),
            },
            body: JSON.stringify(blockInfo),
        };
        const url = `/dashboard/api/blocks/${blockInfo.id}/create_or_update/`;
        fetch(url , options).then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response;
        }).then(function() {
            // must clear & refetch to get the updates
            dispatch(clearPlantingInfo());
            dispatch(getBlockList());
        }).catch(function(ex) {
            let msg = `Error: block not saved: ${ex}`;
            console.log(msg);
            //TODO: dispatch error msg and show in page header.
            alert(msg);
        });
    };
}
*/

