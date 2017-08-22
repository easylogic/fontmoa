import React, { Component } from 'react'
import './default.css';

class ListItem extends Component {

  renderTool = (tool, index, item) => {
    switch (tool.type) {
      case 'arrow' : return (<span className="arrow" key={index}>&gt;</span>);
      case 'reload' : return (<span className="reload" key={index}>r</span>);
      case 'badge' : return (<span className="badge" key={index}>{tool.value}</span>);
      default: return "";
    }
  }

  render() {
    const item = this.props.item; 
    const tools = item.tools || [];
    return (
      <div className="list-item" onClick={(e) => this.props.onClick(e, item)}>
        {item.title}
        <span className="tools">
          {tools.map((t, index) => {
            if (typeof t === 'string') {
              t = { type : 't'}
            }

            return this.renderTool(t, index, item);
          })}
        </span>
      </div>
    ) 
  }
}
  

export default ListItem