import React, { Component } from 'react';
import './default.css';

import { db} from '../../../util'

class LabelInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fontObj: this.props.fontObj,
            prefixLabels: this.props.prefixLabels || [],
            labels : this.props.labels || [],
            readonly : this.props.readonly || false,
        }
    }

    updateLabels = (labels, callback) => {
        const fileId = this.state.fontObj._id;
        db.updateLabels(fileId, labels, () => {
            callback && callback();
        })
    }

    deleteLabel = (e) => {
        const label = e.target.getAttribute('data-label');

        const labels = this.state.labels.filter((l) => {
            return l !== label; 
        })

        this.updateLabels(labels, () => {
            this.setState( { labels })
        })
    }    

    onKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            const label = this.refs.labelInput.textContent.trim();

            if (!this.state.labels.includes(label)) {
                const labels = this.state.labels.concat([label]);
                this.refs.labelInput.textContent = "";
                this.updateLabels(labels, () => {
                    this.setState({ labels })
                });

            }
            return;
        }
    }

    getReadOnlyLabel = (label, index) => {

        let attrs = { className : 'label', key : index }

        return ( <span {...attrs} >{label}</span> )
    }

    getEditableLabel = (label, index) => {

        let attrs = { 
            className : 'label editable',
            key : index,
            'data-label' : label, 
            title: 'Click if delete it',
            onClick : this.deleteLabel
        }
       
        return ( <span {...attrs} >{label}</span> )
    }

    render() {
        return (
            <div className="label-list">

                { this.state.prefixLabels.map((label, index) => {
                    return this.getReadOnlyLabel(label, index);
                })}

                { this.state.labels.map((label, index) => {

                    if (this.state.readonly) {
                        return this.getReadOnlyLabel(label, index);
                    } else {
                        return this.getEditableLabel(label, index);
                    }
                })}
                {
                    this.state.readonly ? "" : <span className="label input" title="Type a label" contentEditable={true} ref="labelInput" onKeyDown={this.onKeyDown} data-placeholder="label"></span>
                }
                
            </div>
        )
    }
}

export default LabelInput
