import React, {Component} from 'react';
import './default.css';

import { fontdb }  from '../../util'

class DirectoryManager extends Component {

  constructor (props) {
    super(props);

    this.state = { 
      items : [], 
    }

    this.init();
  }

  init = () => {
    fontdb.getDirectories((items) => {
      this.setState({items})
    })
  }

  renderDirectoryType = (it) => {
    
    if (it.type === 'user') {
      return <span className="type-icon"><i className="material-icons">folder_shared</i></span>  
    }

    return <span className="type-icon"><i className="material-icons">folder</i></span>
  }

  refreshFontDirectory = (it) => {
    return (e) => {
      let node = e.target.querySelector('.material-icons');
      node.classList.add('spin');

      fontdb.refreshDirectory(it.directory, () => {
        node.classList.remove('spin');
      })
    } 
  }

  render() {
    return ( 
      <div className="directory-manager">
        <div className="directory-list">
        {this.state.items.map((it, index) => {

          const typeClassName = "type " + it.type; 

          return (
            <div key={index} className="directory-item">
              <div className={typeClassName}>
                {this.renderDirectoryType(it)}
              </div>
              <div className="name">{it.name}</div>
              <div className="directory">{it.directory}</div>
              <div className="tools">
                <span className="tool-item" title="Refresh Directory" onClick={this.refreshFontDirectory(it)}><i className="material-icons">autorenew</i></span>
              </div>
            </div>
          ) 
        })}
        </div>
      </div>
    );
  }
}

export default DirectoryManager;
