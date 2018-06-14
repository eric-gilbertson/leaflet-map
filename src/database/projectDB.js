/* Description:
 * This file emulates the store functionality provided by Redux for test purposes.
 * It should be replaced with a Redux implementation using actions and reducers.
 */

// Mashup of the range and ranch_energy tables.
let _ranchAr =  [
    {'ranch_id': 'ranch-0', 'name': 'Southeast', 'selected':false, 'energy_2016': 140, 'energy_2017': 12},
    {'ranch_id': 'ranch-1', 'name': 'Southwest', 'selected':false, 'energy_2016': 360, 'energy_2017': 34},
    {'ranch_id': 'ranch-2', 'name': 'Northeast', 'selected':false, 'energy_2016': 75, 'energy_2017': 19},
    {'ranch_id': 'ranch-3', 'name': 'Northeast', 'selected':false, 'energy_2016': 55, 'energy_2017': 33},
];

// Project table.
let _projectAr = [
    { 'id' : 'proj-1', 'name':'Example1', 'project_ranches':['ranch-1', 'ranch-2'], 'ranches':_ranchAr},
];


// Reload last state (if any)
if (window.localStorage['projectAr'] !== undefined) {
    let dataStr = localStorage.getItem('projectAr');
    _projectAr = JSON.parse(dataStr);
}

export function saveProject(newProject) {
    _projectAr[0] = newProject;
    let dataStr = JSON.stringify(_projectAr);
    window.localStorage.setItem("projectAr", dataStr);
}

export function getProject(name) {
    let project = _projectAr[0];
    return project;
}
