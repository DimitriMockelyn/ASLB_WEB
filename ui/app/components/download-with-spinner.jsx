//libraries
import React, {Component, PropTypes} from 'react';
import Checkbox from 'focus-components/components/input/checkbox';
import {component as Button} from 'focus-components/common/button/action';
import message from 'focus-core/message';
import {component as Label} from 'focus-components/common/label';
export default React.createClass({
    idALink : undefined,
    componentWillMount() {
      this.idALink = this.randId();
    },
    randId() {
        return Math.random().toString(36).substr(2, 10);
    },
    getInitialState() {
      return {process: false};
    },
    _performDownload() {
        const that = this;
        if (!this.props.validateData || this.props.validateData()) {
            const xhr = new XMLHttpRequest();
            xhr.open(this.props.requestType,this.props.url,true);
            xhr.responseType = 'blob';
            xhr.onload = function() {
                if (this.status === 200) {
                    // Create a new Blob object using the response data of the onload object
                    const blob = new Blob([this.response], {type: that.props.typeResponse});
                    if (navigator.appVersion.toString().indexOf('.NET') > -1) {
                        // for IE browser
                        window.navigator.msSaveBlob(blob, that.props.fileName());
                    } else {
                        // for other browsers
                        //Create a link element, hide it, direct it towards the blob, and then 'click' it programatically
                        const a = document.getElementById(that.idALink);
                        document.body.appendChild(a);
                        //Create a DOMString representing the blob and point the link element towards it
                        const url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = that.props.fileName();
                        //programatically click the link to trigger the download
                        a.click();
                    }
                    that.setState({process: false});
                }else{
                    that.setState({process: false});
                    const reader = new FileReader();
                    reader.onload = function(){
                        let errorMessage  = null;
                        try {
                            errorMessage = JSON.parse(reader.result).globalErrors[0];
                        } catch (exception) {
                            errorMessage = 'Erreur inconnue';
                        }
                        if (errorMessage) {
                            message.addErrorMessage(errorMessage);
                        } else {
                            message.addErrorMessage('application.internalError');
                        }
                    };
                    reader.readAsText(this.response);
                }
            };

            xhr.send('value='+JSON.stringify(this.props.getData()));
            this.setState({process: true});
        }
    },
    render() {
        return <div>
            <Button  type='button'
                     handleOnClick={this._performDownload}
                     label={this.props.label}  />
            <div data-focus="display-none">
                <a id={this.idALink} />
            </div>
            {this.state.process &&
            <div data-focus="loading-import" >
                <div data-focus="white-background">
                    <Label name={this.props.messagePending || 'process.loading'} />
                    <div data-focus="gears" />
                </div>
            </div>}
        </div>;
    }
});

