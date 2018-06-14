export function getProjectInfoDone(project) {
    console.log("enter getProjectInfo: ", project);

    return {
        type: 'GET_PROJECT_INFO_DONE',
        project: project
    };
}

export function getProjectListDone(projectList) {
    console.log("enter getProjectListDone: ", projectList);

    return {
        type: 'GET_PROJECT_LIST_DONE',
        projectList: projectList
    };
}

export function getProjectList() {
    return (dispatch) => {
        console.log("************** getProjectList");

        fetch('http://localhost:8080/projects')
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response;
            })
            .then((response) => response.json())
            .then(function (projectList) {
               console.log("dispatch getProjectListDone"); 
               dispatch(getProjectListDone(projectList));
            }).catch(function(ex) {
               console.log("dispatch projectListErrored: ", ex); 
            });
    };
}

export function getProjectInfo(id) {
    const EMPTY_PROJECT = {name:"New Project", ranches:[]};
    console.log("Action::getProjectInfo: ", id);

    return (dispatch) => {
        if (id < 0) {
            console.log("create project");
            dispatch(getProjectInfoDone(EMPTY_PROJECT));
        } else {
            console.log("fetch project: ", id);
            fetch('http://localhost:8080/project/' + id)
                .then((response) => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response;
                })
                .then((response) => response.json())
                .then(function(project) {
                    // in case server didn't give it to us.
                    if (project.id === undefined)
                        project.id = id;
    
                    console.log("dispatch getProjectInfoDone");
                    dispatch(getProjectInfoDone(project));
                }).catch((ex) => console.log("Error: projectInfo ", ex));
       }
   }
}

export function saveProjectInfo(projectInfo) {
    console.log("xxxxxxxxx: enter saveProject: ", projectInfo);

    return (dispatch) => {
        console.log("xxxxxxxxxxxxxx to server saveProject: ");
        let args = { method: 'post', body: JSON.stringify(projectInfo)};
        let url = 'http://localhost:8080/project/' + projectInfo.id;
        fetch(url , args).then((response) => {
                console.log("Save status: ", response.statusText);
                return response;
            })
    };
}

