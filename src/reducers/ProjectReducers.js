/* Description:
 * This file implments the reducers for the projectList and projectInfo
 * actions.
 */
export function projectListGet(state = [], action) {
    //console.log("enter projectHasErrored");
    switch (action.type) {
        case 'PROJECT_HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
}

export function projectList (state = [], action) {
  //console.log("enter projectList reducer: ", action.type, ', ', state);
  switch (action.type){
    case 'GET_PROJECT_LIST_DONE':
        //console.log("xxxxx get projectListGetDone success: ", action.projectList);
        return action.projectList;

    default:
        return state;
  }
}

export function projectInfo (state = {}, action) {
  //console.log("enter projectInfo reducer: ", action.type, ', ', state);

  switch (action.type){
    case 'SAVE_PROJECT':
        let newState = Object.assign({}, state);
        newState.project = action.project;
        return [ newState, ];

    case 'GET_PROJECT_INFO_DONE':
        //console.log("get projectInfoDone");
        return action.project;

    default:
        return state;
  }
}


