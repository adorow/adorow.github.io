import React, {Component} from 'react';

class Project extends Component {

    render() {
        return (
            <div
                className={"project project-tile project-stack" + ((this.props.index % 3 === 2) ? " last-in-row" : "")}>
                <ProjectName name={this.props.repo.name} url={this.props.repo.url}/>
                <ProjectData repo={this.props.repo}/>
                {
                    this.props.repo.homepage && <ProjectPage homepage={this.props.repo.homepage}/>
                }
            </div>);
    }
}

class ProjectName extends Component {

    render() {
        return (
            <div className="project-item header-link">
                <h5>
                    <a href={this.props.url} target="_blank">{this.props.name}</a>
                </h5>
            </div>
        );
    }

}

class ProjectData extends Component {

    render() {
        return (
            <div className="project-item">
                <div className="repo-info">
                    <span><i className="octicon octicon-star"/>{this.props.repo.stargazers}</span>
                    <span><i className="octicon octicon-repo-forked"/>{this.props.repo.forks}</span>
                    <span className={ "language " + this.props.repo.language}>{this.props.repo.language}</span>
                </div>
                <p>{this.props.repo.description}</p>
            </div>
        );
    }

}

class ProjectPage extends Component {

    render() {
        return (
            <div className="project-item bottom-links">
                <a href={this.props.homepage} target="_blank">
                    <i className="octicon octicon-browser"/>
                    <span>Go to</span>
                </a>
            </div>
        );
    }

}

export default Project;