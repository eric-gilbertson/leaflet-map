/* Description:
 * This file implements the actions require to get the block,
 * and plantings data from the server detail REST quries.
 */

// Unlike ajax, fetch requires the credentials header.
// Use this global for all our fetch requests.
//import { checkHttpStatus, parseJSON, getCsrfToken } from '../../../utils';

// Set true when working with spoofing server.
const DEV_MODE=true;

const REQUEST_OPTIONS = {
    credentials: "same-origin",
    'Access-Control-Allow-Origin' : '*',
    'content-type': 'application/json',
};

const POST_OPTIONS  = { 
    method: 'POST',
    credentials: "include",
    headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'X-CSRFToken': null,
    },
    body: null
};

const PUT_OPTIONS  = { 
    method: 'PUT',
    credentials: "include",
    headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'X-CSRFToken': null,
    },
    body: null
};

// constants used to identify the block info actions
export const CLEAR_BLOCK_INFO = 'CLEAR_BLOCK_INFO';
export const GET_BLOCK_INFO = 'GET_BLOCK_INFO';

export const UPDATE_BLOCK_INFO = 'UPDATE_BLOCK_INFO';
export const GET_BLOCK_INFO_DONE = 'GET_BLOCK_INFO_DONE';
export const SAVE_BLOCK_INFO_DONE = 'SAVE_BLOCK_INFO_DONE';

export const CLEAR_PLANTING_INFO_STATUS_MSG = 'CLEAR_PLANTING_INFO_STATUS_MSG';

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
        let url = `/farm/blocks?block_id=${id}&include_irrigation_config_status=true&include_growing_seasons=true`;

        if (DEV_MODE) {
            url = `http://localhost:8080/farm/blocks/${id}`
        }
            fetch(url, REQUEST_OPTIONS)
                .then((response) => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response;
                })
                .then((response) => response.json())
                .then(function(block) {
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

export const ADD_PLANTING_INFO_DONE = 'ADD_PLANTING_INFO_DONE';
export const GET_PLANTING_INFO_DONE = 'GET_PLANTING_INFO_DONE';
export const DELETE_PLANTING_INFO_DONE = 'DELETE_PLANTING_INFO_DONE';
export const SAVE_PLANTING_INFO_DONE = 'SAVE_PLANTING_INFO_DONE';
export const UPDATE_PLANTING_KC_INFO = 'UPDATE_PLANTING_KC_INFO';
export const UPDATE_PLANTING_BLOOM_DATE = 'UPDATE_PLANTING_BLOOM_DATE';

export function updatePlantingBloomDate(bloomDate) {
    console.log('bloom: ', bloomDate);
    return {
        type: UPDATE_PLANTING_BLOOM_DATE,
        bloomDate: bloomDate,
    };
}

export function updatePlantingInfo(planting) {
    return {
        type: 'UPDATE_PLANTING_INFO',
        plantingInfo: planting,
    };
}

 export function updateBlockInfo(block) {
    return {
        type: UPDATE_BLOCK_INFO,
        blockInfo: block,
    }
}

export function updatePlantingKCInfo(plantingId, stageList) {
    return {
        type: UPDATE_PLANTING_KC_INFO,
        plantingId: plantingId,
        stageList: stageList,
    };
}

export function getPlantingInfoDone(planting) {
    return {
        type: GET_PLANTING_INFO_DONE,
        plantingInfo: planting,
    };
}

// Invoked when a new planting has been added.
export function addPlantingInfoDone(planting) {
    return {
        type: ADD_PLANTING_INFO_DONE,
        plantingInfo: planting,
    };
}

export function clearPlantingInfo() {
    return {
        type: CLEAR_PLANTING_INFO,
    };
}

// Clears the save status from the plantingInfo struct
export function clearPlantingInfoStatusMsg() {
    return {
        type: CLEAR_PLANTING_INFO_STATUS_MSG,
    };
}

export function savePlantingInfoDone(planting) {
    return {
        type: SAVE_PLANTING_INFO_DONE,
        plantingInfo: planting,
    };
}

export function deletePlantingInfoDone(plantingId) {
    return {
        type: DELETE_PLANTING_INFO_DONE,
        plantingId: plantingId,
    };
}

//NOTE: these actions are duplicated in PlantingsTab.mapStateToProps
//TODO: normalize by moving to an action.
function populatePlantingData(planting) {
    // Supress REACT warning, map null to string.
    for (let key in planting) {
        if (planting[key] === null) planting[key] = '';
    }

    // Datepicker requires date in ISO format, else crash.
    // TODO: remove when server provides standard date format.
    for (let i=0; i < planting.crop_stage_list.length; i++) {
        let stage = planting.crop_stage_list[i];
        stage.date_this_season = getISODate(stage.date_this_season);
    }

    if (planting.date_harvested && planting.date_harvested.indexOf('/') > 0)
         planting.date_harvested = getISODate(planting.date_harvested);

    if (planting.date_planted && planting.date_planted.indexOf('/') > 0)
         planting.date_planted = getISODate(planting.date_planted);

    // Needed to keep server from rejecting the dates, see
    // irrigation/models.py", line 612 for more info.
    //make copy, this is the struct that the state is actually updated into.
    planting.data = Object.assign({}, planting);
}

export function getPlantingInfo(id, blockId) {
    return (dispatch, getState) => {
        let url = `/irrigation/plantings/${id}/`;

        if (DEV_MODE) {
             url = `http://localhost:8080/irrigation/planting/${id}`;
        }
            fetch(url, REQUEST_OPTIONS)
                .then((response) => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response;
                })
                .then((response) => response.json())
                .then(function(planting) {
                    //TODO: server should inject block_id
                    planting.block_id = blockId;
                    populatePlantingData(planting);
                    dispatch(getPlantingInfoDone(planting));
                }).catch((ex) => {
                    console.log("Error: fetching plantingInfo ", ex);
                    dispatch(clearPlantingInfo());
                });
   }
}


function getISODate(dateStr) {
    if (dateStr.length > 0 && dateStr.indexOf('/') > 0) {
        try {
            let date = new Date(Date.parse(dateStr + ' 00:01'));
            dateStr = date.toISOString().split('T')[0];
        } catch (error) {
            console.log("Error parsing date to ISO: ", dateStr, ", ", error);
            dateStr = '';
        }
    }
    return dateStr;
}

function getUSDate(dateStr) {
    let gotIt = false;
    if (dateStr.indexOf('-') > 0) {
        let isoAr = dateStr.substring(0, 10).split('-');
        //manually parse else date is wrong due to TZ stuff.
        if (isoAr.length > 2) {
            gotIt = true;
            dateStr = `${isoAr[1]}/${isoAr[2]}/${isoAr[0]}`;
        }
    }
    if (!gotIt) {
        console.log("Unexpected date string: ", dateStr);
    }

    return dateStr;
}

export function savePlantingInfo(plantingInfo, blockInfo) {
    let myPlanting = plantingInfo.data;
    let plantingId = myPlanting.planting_id; // -1 indicates new planting.
    let blockId = myPlanting.block_id;

    //Undo the up scaling done on the way in.
    myPlanting.irrigation_efficiency = myPlanting.irrigation_efficiency / 100;

    let plantingUpdate = Object.assign({}, myPlanting);
    for (let key in plantingUpdate) {
        if (plantingUpdate[key] === '') plantingUpdate[key] = null;
    }

    let stages = myPlanting.crop_stage_list;
    let haveSlash = stages.length > 0 && stages[0].date_this_season.indexOf('/') > 0;
    for (let i=0; !haveSlash && i < stages.length; i++) {
        stages[i].date_this_season = getUSDate(stages[i].date_this_season);
    }

    // server requires date as MM/DD/YYYY.
    if (myPlanting.date_harvested)
         plantingUpdate.date_harvested = getUSDate(myPlanting.date_harvested);

    if (myPlanting.date_planted)
         plantingUpdate.date_planted = getUSDate(myPlanting.date_planted);

    //Downstream code expects this as a number for comparision purposes.
    let ieff = myPlanting.irrigation_efficiency;
    if (typeof(ieff) === 'string' && ieff.length > 0) {
         myPlanting.irrigation_efficiency = parseFloat(ieff);
    }

    // Needed to keep server from rejecting the dates, see
    // irrigation/models.py", line 612 for more info.
    plantingUpdate.start_date = plantingUpdate.date_planted;
    plantingUpdate.end_date = plantingUpdate.date_harvested;

    let updateData = {planting: plantingUpdate, block:blockInfo};
    let targetId = plantingId;
    return (dispatch) => {
        let url = `/irrigation/plantings/${targetId}/`;
        let  options = {...POST_OPTIONS};
        options.method = "PUT";
        options.headers['X-CSRFToken'] = getCsrfToken();
        options.body = JSON.stringify(updateData);

        if (targetId === -1) {
            targetId = blockId;
            url = `/irrigation/plantings/block/${targetId}/`;
            options.method = "POST";
        }

        if (DEV_MODE) {
            url = `http://localhost:8080/irrigation/planting/${targetId}`;
            options = { 
                method: 'POST',
                body: JSON.stringify(updateData),
            };
        }


        fetch(url , options).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }).then((response) => response.json())
        .then(function(newPlanting) {
            if (newPlanting.errors) {
                let msg = `Planting was not saved: ${newPlanting.errors}`;
                console.log(msg);
                //TODO: dispatch error msg and show in page header.
                alert(msg);
            } else {
                // Server should provide the block ID
                newPlanting.block_id = blockId;
                populatePlantingData(newPlanting);
                dispatch(savePlantingInfoDone(newPlanting));
                if (blockInfo) {
                    dispatch(updateBlockInfo(blockInfo));
                }
             
                if (plantingId === -1) {
                    console.log("addplantingdone");
                    dispatch(addPlantingInfoDone(newPlanting));
                }
            }
        }).catch(function(ex) {
            let msg = `Error: planting not saved: ${ex}`;
            console.log(msg);
            //TODO: dispatch error msg and show in page header.
            alert(msg);
        });
    };
}


export function saveCuttingsInfo(planting, cuttingsList) {
    let uploadData = {...planting};
    let plantingId = planting.planting_id;
    uploadData.cuttings = cuttingsList;

    //Must remove time portion of date, else server throws invalid format ex
    for (let i=0; i < cuttingsList.length; i++) {
        let cut_date = cuttingsList[i].cut_date;
        if (cut_date && cut_date.length > 0)
            cuttingsList[i].cut_date = cut_date.split('T')[0];
    }

    return (dispatch) => {
        let url = `/irrigation/plantings/${plantingId}/update_cuttings/`;

        let  options = {...PUT_OPTIONS};
        options.headers['X-CSRFToken'] = getCsrfToken();
        options.body = JSON.stringify(uploadData);

        if (DEV_MODE) {
            url = `http://localhost:8080/irrigation/update_cuttings/${plantingId}`;
            options = { 
                method: 'POST',
                body: JSON.stringify(uploadData),
            };
        }


        fetch(url , options).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }).then((response) => response.json())
        .then(function(newPlanting) {
            newPlanting.block_id = planting.block_id;
            populatePlantingData(newPlanting);
            dispatch(getPlantingInfoDone(newPlanting));
            //TODO: send done event & show a banner.
            alert("Your changes have been saved.");
        }).catch(function(ex) {
            let msg = `Error: planting not saved: ${ex}`;
            console.log(msg);
            //TODO: dispatch error msg and show in page header.
            alert(msg);
        });
    };
}
export function saveCanopyPercentShading(planting, percentShade, startDate) {
    let plantingId = planting.planting_id;
    let url = `/irrigation/plantings/${plantingId}/update_crop_stages/`;

    let localDate = new Date(startDate).toLocaleDateString('en-US');

    let shadeData =  {
        'stage_index' : -1,
        'current_crop_stages' : planting.crop_stage_list,
        'field_updated': 'new',
        'new_canopy_measure': parseInt(percentShade, 10),
        'date_updated': localDate
    };

    let  options = {...PUT_OPTIONS};
    options.headers['X-CSRFToken'] = getCsrfToken();
    options.body = JSON.stringify(shadeData);

    if (DEV_MODE) {
        url = 'http://localhost:8080' + url;
        delete options.credentials;
        delete options.headers['X-CSRFToken'];
    }

    return (dispatch) => {
        fetch(url , options).then((response) => {
            if (!response.ok) throw Error(response.statusText);
                return response;
        }).then((response) => response.json())
        .then(function(respStr) {
            //NOTE: extra level of decoding
            let respObj = JSON.parse(respStr);
            let newStages = respObj.new_crop_stages;
            dispatch(updatePlantingKCInfo(plantingId, newStages));
        }).catch(function(ex) {
            let msg = `Error: percent shading not saved: ${ex}`;
            console.log(msg);
            //TODO: dispatch error msg and show in page header.
            alert(msg);
        });
    }
}

export function deletePlantingInfo(plantingId) {
    return (dispatch) => {
        const url = `/irrigation/plantings/${plantingId}`;
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
            dispatch(deletePlantingInfoDone(plantingId));
        }).catch(function(ex) {
            let msg = `Could not delete planting ${plantingId}, ${ex}`;
            console.log(msg);
            alert(msg);
        });
    };
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


*/

