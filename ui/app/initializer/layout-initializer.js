import React from 'react';
import FocusCore from 'focus-core';
import FocusComponents from 'focus-components';
import render from 'focus-core/application/render';
import Layout from 'focus-components/components/layout';
import DemoMenuLeft from '../views/menu/menu-left';
import MessageCenter from '../components/message-center';
import Footer from '../views/header/footer';
import PopinMessageCenter from '../components/popin-message-center';
import ProfileComponent from '../components/layout/profile-component';
export default () => {
    const customLayout = () => {
        return (
            <div>
                <Layout
                    MenuLeft={DemoMenuLeft}
                    Footer={Footer}
                    MessageCenter={() => {
                        return <MessageCenter ttlWarning={6000000000} ttlError={9000000000000} ttlSuccess={5000}/>;
                        }
                    }
                    OtherRootComponent={() => {
                        return <div><PopinMessageCenter/><ProfileComponent hasLoad={false}/></div>;
                        }
                    } />
            </div>);
    };
    render(customLayout, '.app');
};
