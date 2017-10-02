import React from 'react';
import FocusComponents from 'focus-components';
import {component as Select} from  'focus-components/common/select/radio';
export default React.createClass({
    componentWillReceiveProps(newProps) {
        if (newProps.value !== undefined) {
            this.setState({value: newProps.value});
        }
    },
    getInitialState() {
        return {disabled: false, value: this.props.value};
    },
    getValue(){
        return this.state.value;
    },
    onChange(value){
        this.setState({value});
        if(this.props.onChange){
            this.props.onChange(value);
        }
    },
    componentDidMount() {
      if (this.props.afterMount) {
          this.props.afterMount(this);
      }
    },
    render() {
        return <div>
            <Select disabled={this.state.disabled} onChange={this.onChange} value={this.state.value} values={this.props.values}/>
        </div>;
    }
});

