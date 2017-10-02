import React, {Component} from 'react';
import FocusFile from 'focus-file';
import store from 'focus-file/store/built-in-store';
import Panel from 'focus-components/components/panel';
import {addErrorMessage,addSuccessMessage} from 'focus-core/message';

export default React.createClass({
    displayName: 'SousmissionFile',

    getInitialState(){
      return {files : []};
    },

    componentDidMount() {
      this.refs.focusFile.dropzone.on('error',this._onFilesChange);
      if (this.props.onFilesAdd) {
          this.refs.focusFile.dropzone.on('addedfile', this.props.onFilesAdd);
      }
    },

    _onFilesChange(error) {
      const errorJson = JSON.parse(error.xhr.response);
      for (let i =0;i<errorJson.globalErrors.length;i++){
        addErrorMessage(errorJson.globalErrors[i]);
      }
    },
    _onFileSuccess() {
      if (this.props.onFileSuccess) {
        this.props.onFileSuccess();
      }
    },

    render() {
        return (
          <div>
            <FocusFile data-focus='file-upload' paramName='file' ref='focusFile' url={this.props.url} onFileSuccess={this._onFileSuccess}>
                <div>
                    <i className="material-icons">{'cloud_upload'}</i>
                </div>
            </FocusFile>
          </div>
        );
    }
});
