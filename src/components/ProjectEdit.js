/* Description:
 * This file implements the project property edit view which allows
 * user to edit the project name and the associated ranches. Upon 
 * save the updates are save to a dummy store implemented in localstorage.
 */

//TODO: make this a pure container by implemeting the list and name
//      editor as components.

import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProjectInfo, saveProjectInfo } from '../actions/ProjectActions'
import { withRouter } from 'react-router-dom';
import RanchSelectList from './RanchSelectList';
import ProjectName from './ProjectName';

class ProjectEdit extends Component {
    constructor(state) {
        super(state);
        console.log("construct ProjectEdit");
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        console.log("ProjectEdit::componentDidMount: ", params.projectId);
        this.props.fetchProject(params.projectId);
    }

    // Called when a RanchSelect item checkbox is clicked.
    _onRanchClick(ranchIndex) {
        console.log("index: ", this, ", ", ranchIndex);
        let newState = Object.assign({}, this.props.projectInfo);
        let ranch = newState.ranches[ranchIndex];
        ranch.selected = !ranch.selected;
        console.log(`state: ${ranchIndex}, ${ranch.selected}, ${this.state}`);
        this.setState({projectInfo: newState});
        //this.setState(newState);
    }

    // Called when the proejct name is changed.
    _updateName(event) {
        let value = event.target.value;
        let newState = Object.assign({}, this.props.projectInfo);
        newState.name = value;
        console.log("updateName: ", value, ", ", this.state);
        this.setState({projectInfo: newState});
    }

    _saveProject() {
        let saveObj = this.state === null ? this.props.projectInfo : this.state.projectInfo;
        console.log("saving project: ", saveObj);
        this.props.storeProject(saveObj);
        this.props.history.push('/');
    }

    _cancelProject() {
        console.log("cancel project edit");
        this.props.history.push('/');
    }

    render() {
        console.log("ProjectEdit:render: ", this.props)

        if (this.props.projectInfo.ranches === undefined) {
            return <p>Loading… {this.props.isLoading} </p>;
        }

        let ranches = this.props.projectInfo.ranches;
        console.log("ProjectEdit:ranches:: ", ranches.length);

        return (
          <div className="container" style={{width:'500px'}}>

            <div className="row"  style={{margin:'20px'}}>
                <h1 className="app-title">{this.props.name} Configuration</h1>
             </div>

            <div className="row">
              <div className="col-xs-12">
              <label className="h4" >Project:</label>
              <ProjectName updateName={this._updateName.bind(this)} name={this.props.projectInfo.name} />
                <div style={{float:'right'}}>
                    <button  className="btn btn-primary"  onClick={this._saveProject.bind(this)}>Save</button>
                    &nbsp;
                    <button  className="btn btn-primary" onClick={this._cancelProject.bind(this)}>Cancel</button>
                </div>
              </div>
            </div>
            <h4>Ranches:</h4>
                <RanchSelectList ranchAr={ranches} onRanchSelectClick={this._onRanchClick.bind(this)} />
          </div>
        )
    }
}

withRouter(ProjectEdit);

const mapStateToProps = (state) => {
    console.log("ProjectEdit.mapStateToProps: ", state);
    let ranches = state.projectInfo.ranches;
    for (let i=0; ranches !== undefined && i < ranches.length; i++) {
        state.projectInfo.ranches[i].selected = true;
    }

    return {
        projectInfo: state.projectInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    console.log("enter mapDispatchToProps: ");
    return {
        fetchProject: (projectId) => dispatch(getProjectInfo(projectId)),
        storeProject: (projectInfo) => dispatch(saveProjectInfo(projectInfo))
    };
};

export default connect( mapStateToProps, mapDispatchToProps )(ProjectEdit);
