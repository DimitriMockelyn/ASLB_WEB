//librairies
import React, {PropTypes} from 'react';

import {component as BackButton} from 'focus-components/common/button/back';
import {navigate} from 'focus-core/history';

export default React.createClass({

    render() {
        return <div>
            <div data-focus='cartridge-home'>
                <label>
                Association <div className='blue-aslb'>S</div>portive La Boursidière
                </label>
                <label>
                Le sport loisirs au sein du Centre d'Affaires de La Boursidière
                </label>    
            </div>
            <div data-focus='button-header-cst'>
                <div className='header-tile-click' onClick={() => {navigate('contact', true)}}>
                    <label>
                        Nous rejoindre ?
                    </label>
                </div>
                <div className='header-tile-click' onClick={() => {navigate('contact', true)}}>
                    <label>
                        Nous contacter
                    </label>
                </div>
                <div className='header-tile-click' onClick={() => {navigate('contact', true)}}>
                    <label>
                        Rejoindre l'équipe d'animation ?
                    </label>
                </div>
            </div>
        </div>;
    }
});
