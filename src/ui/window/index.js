
import { Component } from 'react'
import ReactDOM from 'react-dom'
import './default.css';

class Window extends Component {

  componentDidMount () {
    this.node = ReactDOM.findDOMNode(this); 
  }

  show = () => {
    if (this.node) {
      this.node.classList.toggle('hide', false);
    }

  }

  hide = () => {
    if (this.node) {
      this.node.classList.toggle('hide', true);
    }
  }
}

export default Window; 
