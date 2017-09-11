import React, { Component } from 'react';
import './default.css';

class VariantsRadio extends Component {
    constructor(props) {
        super(props);

        this.state = {
            labels : this.props.labels || [],
            index: 0,
        }
    }

    checkLabel = (index) => {
        return () => {
            this.setState({ index })
            this.props.onChange(index)
        }
    }

    render() {
        return (
            <div className="variants-list">
                { this.state.labels.map((label, index) => {
                    let realLabel = [label]; 
                    if (label.includes('italic')) {
                        realLabel = [label.replace('italic', ''), <i className="material-icons" key={label}>format_italic</i>]; 
                    }

                    let attrs = {
                        className : 'label ' + (index === this.state.index ? ' active ' : ''),
                        key : index, 
                        onClick : this.checkLabel(index)
                    }
                    
                    return ( 
                        <span {...attrs} >{realLabel}</span> )
                })}                
            </div>
        )
    }
}

export default VariantsRadio
