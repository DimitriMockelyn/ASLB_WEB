//librairies
import React, {PropTypes} from 'react';
import {component as Button} from 'focus-components/common/button/action';
import {component as BackButton} from 'focus-components/common/button/back';
import {component as Label} from 'focus-components/common/label';
import historic from 'focus-core/history';
export default React.createClass({
    handleOnClick() {
        if (this.props.beforeBack) {
            this.props.beforeBack();
        }
        historic.history.back();
    },
    render() {
        return <div>
            <Button
                handleOnClick={this.handleOnClick}
                icon='keyboard_backspace'
                label={'button.back'}
                shape={null}
                type='button' /><div>{this.props.backbutton}</div>
        </div>;
    }
});
