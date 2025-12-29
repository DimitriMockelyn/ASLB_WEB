import React from 'react';
import Layout from 'focus-components/components/layout';
import MenuLeft from '../../views/menu/menu-left';
import Footer from '../../views/header/footer';
function appLayout(props) {
    return (
        <div>
            <Layout MenuLeft={MenuLeft} Footer={Footer}>
                {props.children}
            </Layout>
        </div>
    );
}

export default appLayout;
