//librairies
import React, {PropTypes} from 'react';

import {component as BackButton} from 'focus-components/common/button/back';

export default React.createClass({

    render() {
        return <div>
            <label>
            Bienvenue sur le site de l'ASLB !
            </label>
            <label>
                Cette interface vous permets de vous inscrire aux différentes activités proposés par l'association. 
            </label>
        </div>;
    }
});
