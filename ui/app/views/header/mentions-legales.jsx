import React from 'react';

export default React.createClass({
    displayName: 'MentionLegales',

    render() {
        return (
            <div data-focus="mention-legales-text">
                {i18n.t('mentions.content').split('\n').map(value => {
                    if (value.trim().startsWith('|TITLE|')) {
                        return <div data-focus="mention-title">
                            {value.trim().substring(7)}
                        </div>;
                    }
                    if (value.trim().startsWith('|BIG-TITLE|')) {
                        return <div data-focus="mention-big-title">
                            {value.trim().substring(11)}
                        </div>;
                    }
                    return <div data-focus="mention-content">{value.trim()}</div>;
                } )}
                <div data-focus="mention-title"></div>
            </div>
        );
    }
});
