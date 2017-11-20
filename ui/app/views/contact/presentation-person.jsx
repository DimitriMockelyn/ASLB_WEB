import React from 'react';
import Panel from 'focus-components/components/panel';
import ScrollspyContainer from 'focus-components/components/scrollspy-container';
import fr from '../../i18n/fr-FR/fr-FR';
export default React.createClass({
    displayName: 'PersonView',

    componentWillMount() {
        this.setState({toggled : false});
    },
    /** @inheritDoc */
    render() {
        let  that = this;
        return (
                <div data-focus='presentation-personne'>
                    <div data-focus='title' onClick={() => {this.setState({toggled: !this.state.toggled})}}>
                        <label>{i18n.t(this.props.baseFr+'.titre')}</label>
                        <i className='material-icons'>{this.state.toggled ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
                    </div>
                    {this.state.toggled && <div data-focus='presentation-box'>
                        <label>{i18n.t('contact.presentationTitre')}</label>
                        {this.props.portrait && <img src={this.props.portrait} />}
                        <div data-focus='interview'>
                            {Object.keys(fr.contact.interview).map(function(key) {
                                    return (<div data-focus='interview-bloc'>
                                        <div data-focus='interview-question'>
                                            {i18n.t('contact.interview.'+key)}
                                        </div>
                                        <div data-focus='interview-reponse'>
                                            {i18n.t(that.props.baseFr+'.'+key).split('\\n').map(data => {
                                                return <div>{data}</div>
                                            })}
                                        </div>
                                    </div>
                                    )
                                }) 
                            }
                        </div>
                    </div>}
                </div>
                
        );
    }
});
