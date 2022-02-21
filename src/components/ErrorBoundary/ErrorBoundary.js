import { Component } from "react";

class ErrorBoundary extends Component {
    constructor() {
        super();
        this.state = {hasError: false};
    }

    componentDidCatch(error) {
        console.log(error);
        this.setState({hasError: true});
    }

    render() {
        if(this.state.hasError) {
            return <p aria-label="alert">Something went wrong. I am sorry. Please refresh the page and try again or, if you can reproduce the bug, please create an issue <a title="GitHub Issue link" target="_blank" rel="noopener" href="https://github.com/Jsnxyz/react-autocomplete/issues">here</a></p>
        }
        return this.props.children;
    }
}

export default ErrorBoundary;