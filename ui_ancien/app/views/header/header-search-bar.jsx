import React from 'react';
import history from 'focus-core/history';
import {forEach} from 'lodash';

import searchHeaderMixin from 'focus-components/page/search/search-header/mixin';
import {component as Button} from 'focus-components/common/button/action';
import searchService from '../../services/search';
import actionWrapper from 'focus-components/page/search/search-header/action-wrapper';
import userHelper from 'focus-core/user';
import {component as SearchBar} from 'focus-components/search/search-bar';
const mixin = {
    mixins: [searchHeaderMixin],

    getDefaultProps() {
        return {
            service: searchService,
            inline: true,
            noFamily: true,
            displayEmptyCartridge: false
        };
    },
    getInitialState() {
        return {classDirty: ''};
    },

    _onSearchCriteriaChangeCst() {
        this.setState({classDirty: this.props.store.getQuery() ? 'is-very-dirty' : this.state.classDirty === 'is-very-dirty'? 'is-actually-not-dirty': ''});
    },
    componentDidMount() {
        forEach(window.document.getElementsByTagName('input'), elt=> {
            if (elt.id === 'searchbarinput') {
                elt.addEventListener('keyup', event => {
                    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                        this._navigateAdvancedSearch();
                    }
                    if (!event.code && event.keyCode === 13 ) {
                        this._navigateAdvancedSearch();
                    }
                });
            }
        });
        this.props.store.addQueryChangeListener(this._onSearchCriteriaChangeCst);
    },

    _navigateAdvancedSearch() {
        setTimeout(() => {
            return history.navigate('#search', true);
        }, 500);
    },

    render() {
        const {helpTranslationPath, minChar, onSearchCriteriaChangeByUser, store} = this.props;
        const {isLoading,placeholder, reference: {scopes}} = this.state;
        return (
            <div data-focus="cartridge">
                <div data-focus="header-search-bar">
                    {this.props.noFamily ?
                        <div data-focus="header-logo">
                            <div data-focus="logo-img"/>
                            <span data-focus="app-name">
                                {i18n.t('application.name')}
                            </span>
                        </div>
                    :
                        this.props.inline ?
                            <div data-focus="header-logo">
                                <div data-focus="logo-img"/>
                                <span data-focus="app-family">
                                    {i18n.t('application.family')}
                                </span> - <span data-focus="app-name">
                                    {i18n.t('application.name')}
                                </span>
                            </div>
                        :
                            <div data-focus="header-logo">
                                <div data-focus="logo-img"/>
                                <div>
                                    <div data-focus="app-family">
                                        {i18n.t('application.family')}
                                    </div><div data-focus="app-name">
                                        {i18n.t('application.name')}
                                    </div>
                                </div>
                            </div>
                    }
                    {!userHelper.hasRole(['OF']) &&
                    <div data-focus="search-bar" className={this.state.classDirty}>
                        <SearchBar
                            action={this._action}
                            helpTranslationPath={helpTranslationPath}
                            loading={isLoading}
                            minChar={minChar}
                            placeholder={placeholder}
                            ref='searchBar'
                            scopes={scopes}
                            store={store}
                            onSearchCriteriaChangeByUser={onSearchCriteriaChangeByUser} />
                        <Button
                            onClick={this._navigateAdvancedSearch}
                            data-focus="button-search"
                            type="button"
                            shape="raised"
                            label=""
                            icon="search"
                            ref="search-button"
                        />
                    </div>}
                </div>
                {this.renderCartridge()}
            </div>
        );
    }
};
export default mixin;

export const component = React.createClass({
    displayName: 'Header search bar',

    mixins: [mixin],

    renderCartridge() {
        if (this.props.displayEmptyCartridge) {
            return (
                <div data-focus="cartridge-content">
                </div>
            );
        }
        return null;
    }
});
