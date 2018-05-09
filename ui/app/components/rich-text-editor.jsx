//libraries
import React, {Component, PropTypes} from 'react';
import userHelper from 'focus-core/user';
import Input from 'focus-components/components/input/text';
import RichTextEditor from 'react-rte-image';
import ReactQuill from 'react-quill';
export default React.createClass({
    modules: {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          ['clean']
        ],
      },
    
      formats: [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image',
        'color', 'background', 'font'
      ],
    getValue(){
        return this.state.value.toString('html');
    },
    getInitialState() {
        let value = this.props.value;

        return {value: value};
    },
    resetInput() {
        this.setState({value: RichTextEditor.createEmptyValue()});
    },
    onChangeValue(value) {
        console.log(value);
        this.setState({value});
        if (this.props.onChange) {
          // Send the changes up to the parent component as an HTML string. 
          // This is here to demonstrate using `.toString()` but in a real app it 
          // would be better to avoid generating a string on each change. 
          /*this.props.onChange(
            value.toString('html')
          );*/
        }
      },
    componentWillReceiveProps(newProps) {
        this.setState({value :  newProps.value ? RichTextEditor.createValueFromString(newProps.value, 'html') : RichTextEditor.createEmptyValue()})
    },
    render() {
        
        if (!this.props.isEdit) {
            return  <div dangerouslySetInnerHTML={{ __html: this.state.value.toString('html') }} />
        }
        return (
            <ReactQuill
            theme='snow'
            modules={this.modules}
                    formats={this.formats}
                value={this.state.value}
                onChange={this.onChangeValue}
                />);
    }
});

