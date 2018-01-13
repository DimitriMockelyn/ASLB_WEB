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
import Back from '../components/back';
import agendaService from '../services/agenda';
export default () => {
    const customLayout = () => {
        agendaService.loadTypeEvenements().then( types => {
            types.map(data => {
                if (data.color) {
                    if (!document.getElementById('STYLE-'+data.code) ) {
                        var style = document.createElement('style');
                        style.id = 'STYLE-'+data.code;
                        style.type = 'text/css';
                        style.innerHTML = '.rbc-event.'+data.code+' { background-color: '+data.color+'; border: 1px solid '+data.color+'; } '+ 
                        '[data-focus=\'event-consult-card\'] .'+data.code + ' { color: '+data.color+';}';
                        document.getElementsByTagName('head')[0].appendChild(style);
                    }
                }
            })
        })
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
                        return <div><PopinMessageCenter/><ProfileComponent hasLoad={false}/></div>;
                        }
                    } />
            </div>);
    };
    render(customLayout, '.app');
};
