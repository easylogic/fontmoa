import intl from 'react-intl-universal'
import React, {Component} from 'react';
import './default.css';

import { db }  from '../../util'

const { dialog, shell } = window.require('electron').remote;


class DirectoryManager extends Component {

  constructor (props) {
    super(props);

    this.state = { 
      items : [], 
    }

    this.refresh();
  }

  refresh = () => {
    db.getDirectories((items) => {
      this.setState({items})
    })
  }

  renderDirectoryType = (it) => {
    
    if (it.type === 'user') {
      return <span className="type-icon user"><i className="material-icons">folder_shared</i></span>  
    }

    return <span className="type-icon system"><i className="material-icons">folder</i></span>
  }

  refreshFontDirectory = (it) => {
    return (e) => {

      this.props.app.showLoading('Updating font list in folder');

      db.refreshDirectory(it.directory, () => {
        this.props.app.hideLoading(1000);
      })
    } 
  }

  addDirectory = (e) => {

    if (this.open) return;

    this.open = true; 
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }, (path) => {

        if (path) {
          db.addDirectory(path[0], () => {
            this.open = false; 
            this.refresh();
          });
        }


    });
  }

  openDirectory = (it) => {
    return () => {
      shell.openItem(it.directory)
    }
  }

  render() {
    return ( 
      <div className="directory-manager">
        <div className="directory-title">
          <span className="tools">
            <span className="tool-item add-directory" onClick={this.addDirectory}>
              <i className="material-icons">create_new_folder</i> {intl.get('directorymanager.title.addDirectory')}
            </span>
          </span>
        </div>
        <div className="directory-list">
        {this.state.items.map((it, index) => {

          const typeClassName = "type " + it.type; 

          const openDir = this.openDirectory(it);

          return (
            <div key={index} className="directory-item">
              <div className="name" onClick={openDir} title="Open directory">
                <div className={typeClassName}>
                  {this.renderDirectoryType(it)}
                </div>
                {it.name}                
              </div>
              <div>
                <div className="directory-tree">
                  <div className="root-node">{it.directory}</div>                  
                  {it.subDirectories.map((dir, i) => {
                    return (
                      <div className="node" key={i} data-level={dir.level}>
                        <span className="directory-name" title={dir.directory}  onClick={this.openDirectory(dir)}>{dir.name}</span>
                        <span className="tool-item" title="Refresh Directory" onClick={this.refreshFontDirectory(dir)}><i className="material-icons">autorenew</i> {intl.get('directorymanager.title.refresh')}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="tools">
                <span className="tool-item" title="Refresh Directory" onClick={this.refreshFontDirectory(it)}><i className="material-icons">autorenew</i> {intl.get('directorymanager.title.refresh')}</span>
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
