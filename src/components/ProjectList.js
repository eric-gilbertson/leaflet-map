/* Description:
 * This file implements the project list view. It is a 'simple' component,
 * eg no state.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getProjectList } from '../actions/ProjectActions';

class ProjectListTable extends Component {
    constructor(state) {
        super(state);
        console.log("construct ProjectList");
    }

    render() {
        let projectList = this.props.projectList;

    console.log('render ProjectListTable: ', projectList);
    if (projectList === undefined || projectList.length === undefined)
        return <p>Loading…</p>;


    return(
            <table className='project-list-table table table-striped'>
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projectList.map((project, index) => {
                         return (
                             <tr key={project.id}>
                                  <td>{project.name}</td>
                                  <td>
                                    <button className="btn btn-primary" onClick={() => this.props.onEditClick(project.id)}>Edit</button>
                                    &nbsp;
                                    <button className="btn btn-primary" onClick={() => this.props.onDeleteClick(project.id)}>Delete</button>
                                  </td>
                             </tr>
                          )
                       })
                    }
                </tbody>
            </table>
        )
    }
}

ProjectListTable.propTypes = {
  projectList: PropTypes.list,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
}

class ProjectList extends Component {
    constructor(state) {
        super(state);

        if (this.state === undefined) {
            console.log("ProjectList init state");
            this.state = {
                projectList : []
            };
        }
    }

    componentDidMount() {
        console.log("xxxxxxxxxx ProjectList::componentDidMount");
        this.props.fetchData();
    }

    _deleteProject(projectId) {
        console.log("deleteProject: ", projectId);
    }

    _showEditProject(projectId) {
        console.log("showEditProject: ", projectId);
        this.props.history.push("/project/" + projectId);
    }

    render() {
        console.log("enter render: ", this.props.projectList);

        return(
          //TODO: build header dynaically from target years & add sort.
          <div className="container">
            <h1 className="app-title">Dashboard Projects</h1>
            <button className="btn btn-primary" onClick={() => {this._showEditProject(-1)}}>Create</button>
            <ProjectListTable onDeleteClick={this._deleteProject.bind(this)} onEditClick={this._showEditProject.bind(this)} projectList={this.props.projectList} />
         </div>
        )
    }
}

withRouter(ProjectList);

ProjectList.propTypes = {
  projectList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
};

const mapStateToProps = (state) => {
    console.log("enter mapStateToProps: ", state.projectList);
    return {
        projectList: state.projectList,
    };
};

const mapDispatchToProps = (dispatch) => {
    console.log("enter mapDispatchToProps: ");
    return {
        fetchData: () => dispatch(getProjectList()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
