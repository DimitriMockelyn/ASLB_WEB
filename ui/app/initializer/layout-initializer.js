import React from 'react';
import FocusCore from 'focus-core';
import FocusComponents from 'focus-components';
import render from 'focus-core/application/render';
import Layout from 'focus-components/components/layout';
import MenuLeft from '../views/menu/menu-left';
import MessageCenter from '../components/message-center';
import Footer from '../views/header/footer';
import PopinMessageCenter from '../components/popin-message-center';
import ProfileComponent from '../components/layout/profile-component';
import Back from '../components/back'
export default () => {
    const customLayout = () => {
        return (
            <div>
                <div data-focus="background-logo"/>
                <Layout
                    MenuLeft={MenuLeft}
                    Footer={Footer}
                    MessageCenter={() => {
                        return <MessageCenter ttlWarning={6000000000} ttlError={9000000000000} ttlSuccess={5000}/>;
                        }
                    }
                    OtherRootComponent={() => {
                        return <div><div data-focus='back-button-root'><Back /></div><PopinMessageCenter/><ProfileComponent hasLoad={false}/></div>;
                        }
                    } />
            </div>);
    };
    render(customLayout, '.app');
};
