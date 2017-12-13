import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React from 'react';
import { navigate, views } from 'react-big-calendar/lib/utils/constants';
import {mixin as formMixin} from 'focus-components/common/form';
import builder from 'focus-core/util/url/builder';
import {component as Popin} from 'focus-components/application/popin';
import userHelper from 'focus-core/user';
import homeServices from '../../../services/home';
import {component as Button} from 'focus-components/common/button/action';
import Toggle from 'focus-components/components/input/toggle';
import Panel from 'focus-components/components/panel';
import RichTextEditor from '../../../components/rich-text-editor';
export default React.createClass({
    displayName: 'NewsView',
    mixins: [formMixin],
    definitionPath: 'admin',
    getInitialState() {
        return {
            
        }
    },
    componentWillMount() {
        this.loadChat();
        setInterval( this.loadChat, 60000 );
    },
    scrollView() {
        setTimeout(() => {
            //scroll in half a second
            if (this.refs['chat-view']) {
                this.refs['chat-view'].scrollIntoView(false);
            }
        }, 500);
    },
    loadChat() {
        homeServices.loadChat().then(res => {
            //On vérifie si un nouveau message pour le scroll
            var data = res;
            if (data && !this.state.messages) {
                this.scrollView();
            } else {
                if (data.length > this.state.messages.length) {
                    this.scrollView();
                } else {
                    if (data[0]._id !== this.state.messages[this.state.messages.length-1]._id) {
                        this.scrollView();
                    }
                }
            }
            this.setState({messages : res.reverse()});
        })

    },
    sendMessage() {
        var valueMessage = this.refs.input.getValue();
        if (valueMessage !== '<p><br></p>') {
            homeServices.addMessageChat({message: valueMessage}).then(this.loadChat);
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
                <div data-focus='chat-history'>
                    {this.state.messages && this.state.messages.map(msg => {
                        return <div data-focus='message-chat' ref='chat-view'>
                                <div>
                                    <div>{msg.auteur.prenom + ' ' +msg.auteur.nom}</div>
                                    <div dangerouslySetInnerHTML={{__html: msg.message}}/>
                                </div>
                                <div>
                                    {moment(msg.date, moment.ISO_8601).format('DD/MM/YYYY - HH:mm')}
                                </div>
                            </div>;
                    })}
                </div>
                <div data-focus='input-chat' className={userHelper.getLogin() && userHelper.getLogin()._id ? '' : 'hide-for-width'}>
                    <RichTextEditor ref='input' value={this.state.messageInput} isEdit={true}/>
                    <Button label='Envoyer' type='button' handleOnClick={this.sendMessage} />
                </div>
        </div>
        );
    }
});
