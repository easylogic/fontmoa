import React, { Component } from 'react';
import './default.css';

class LoadingView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loadingText : '',
      isLoading : this.props.isLoading
    }
  }

  show (title) {
    this.setState({
      loadingText : title,
      isLoading: true
    })
  }

  hide (delay) {
    setTimeout((() => {
      this.setState({ isLoading : false })
    }), delay || 0);

  }

  render() {

    let className = [ 'loading-view' ]

    if (this.state.isLoading) {
      className.push('show');
    }

    return ( 
      <div className={className.join(' ')}>
        <div className="loader"></div>
        <div className="loading-text">{this.state.loadingText}</div>
      </div>
    );
  }
}

export default LoadingView;
