import React, {Component} from 'react';
import fetch from 'isomorphic-fetch';

import Project from './Project';

class ProjectContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {repos: [], hasError: false};
    }

    componentDidMount() {
        fetch("https://api.github.com/users/adorow/repos")
            .then(response => {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then(
                jsonResponse =>
                    jsonResponse.map(
                        ghRepo => ({
                            name: ghRepo.name,
                            url: ghRepo.html_url,
                            description: ghRepo.description,
                            homepage: ghRepo.homepage,
                            language: ghRepo.language,
                            forks: ghRepo.forks_count,
                            stargazers: ghRepo.stargazers_count,
                            watchers: ghRepo.watchers_count,
                            score: ghRepo.stargazers_count + ghRepo.forks_count
                        })
                    )
            )
            .then(repos => repos.sort((a, b) => b.score - a.score))
            .then(repos => this.setState({repos: repos}))
            .catch(error => {
                console.log(error);
                this.setState({hasError: true});
            });
    }

    render() {
        if (this.state.hasError) {
            return <FetchError />;
        }

        if (this.state.repos.length === 0) {
            return <LoadingImage />;
        }

        return (
            <div>
                { this.state.repos.map((repo, i) => <Project key={repo.name} repo={repo} index={i}/>) }
            </div>
        );
    }

}

class FetchError extends Component {

    render() {
        return (<div>
            <div id="projects-error-wrapper" className="wrapper-error-content">
                <div id="error-box" role="main" className="page-error-content">
                    <p>
                        <span>There was an error retrieving the projects from GitHub, try again later.</span><br />
                        <span>If the errors persist, I would appreciate if you contact me about it in the links in the footer.</span>
                    </p>
                </div>
            </div>
        </div>);
    }

}

class LoadingImage extends Component {

    render() {
        return <div className="loading loading-projects"/>;
    }

}

export default ProjectContainer;