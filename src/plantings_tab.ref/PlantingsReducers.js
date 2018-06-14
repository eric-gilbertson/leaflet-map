/* Description:
 * This file implments the reducers for the planting, aka block
 * actions.
 */

// NOT USED but require so that the blockInfo export below
// does not through an illegal export exception.
export function blockInfoGet_XXXXX(state = [], action) {
    switch (action.type) {
        case 'BLOCK_INFO_HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
}

//NOTE: must match signature of the server REST response.
const DUMMY_BLOCK_INFO = {};
export function blockInfo(state = DUMMY_BLOCK_INFO, action) {
  switch (action.type){
    case 'GET_BLOCK_INFO_DONE': {
        console.log("blockInfoDone: ", action.blockInfo);
        return action.blockInfo;
    }

    case 'CLEAR_BLOCK_INFO':
        return DUMMY_BLOCK_INFO; //purge current data

    default:
        return state;
  }
}


