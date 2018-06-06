import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React from 'react';
import {mixin as formMixin} from 'focus-components/common/form';
import builder from 'focus-core/util/url/builder';
import {component as Popin} from 'focus-components/application/popin';
import userHelper from 'focus-core/user';
import homeServices from '../../../services/home';
import {component as Button} from 'focus-components/common/button/action';
import Toggle from 'focus-components/components/input/toggle';
import Panel from 'focus-components/components/panel';
import RichTextEditor from '../../../components/rich-text-editor';
import {navigate} from 'focus-core/history';
import adminServices from '../../../services/admin';
import {translate} from 'focus-core/translation';
import ChatHistory from './chat-history';

export default React.createClass({
    displayName: 'NewsView',
    mixins: [formMixin],
    definitionPath: 'admin',
    getInitialState() {
        return {
            
        }
    },
    sendMessage() {
        var valueMessage = this.refs.input.getValue();
        if (valueMessage !== '<p><br></p>' && valueMessage !== '<p></p>') {
            homeServices.addMessageChat({message: valueMessage}).then(this.refs.history.loadChat);
            this.setState({messageInput: undefined});
            this.refs.input.resetInput();
        }
    },
    /** @inheritDoc */
    renderContent() {
        return (
            <div data-focus='chat'>
                <div data-focus='chat-title'>
                    <label>{i18n.t('chat.comment')}</label>
                </div>
                <ChatHistory ref='history' hasLoad={false} />
                <div data-focus='input-chat' className={userHelper.getLogin() && userHelper.getLogin()._id ? '' : 'hide-for-width'}>
                    <RichTextEditor ref='input' value={this.state.messageInput} isEdit={true}/>
                    <Button label='Envoyer' type='button' handleOnClick={this.sendMessage} />
                </div>
        </div>
        );
    }
});
