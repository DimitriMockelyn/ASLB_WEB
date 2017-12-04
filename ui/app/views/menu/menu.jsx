import React, {Component, PropTypes} from 'react';
import {navigate} from 'focus-core/history';
import {component as Button} from 'focus-components/common/button/action';

function MenuItems(props) {
    const {items, LinkComponent, navigate} = props;
    return (
        <div>{_renderItemsList(items, LinkComponent, navigate)}</div>
    );
}
MenuItems.propTypes = {
    items: PropTypes.array
}

function _renderItemsList(items, LinkComponent, navigate) {
    return items.map((link, idx) => {
        return (
            <li key={idx} onClick={_computeLink(link, LinkComponent, navigate)}>
                {_renderButton(link, LinkComponent, navigate)}
                <span>{link.name}</span>
            </li>
        );
    });
}

function _computeLink(menuButton, LinkComponent, navigate) {
    return () => {
        navigate(menuButton.route, true);
    }
}

//Todo: refactor into component
function _renderButton(menuButton, LinkComponent, navigate) {
    menuButton.shape = 'icon';
    menuButton.type = 'button';

    const buttonProps = {
        shape: 'icon',
        type: 'button'
    }

    const {route, option, ...otherProps} = menuButton;
    const menuButtonProps = {...buttonProps, ...otherProps};
    let clickHandler;

    if(menuButton.route !== undefined) {
        //React router case
        if(LinkComponent){
            //Todo: check menButton onClick use
            return <LinkComponent to={menuButton.route} style={{color: 'white'}}><Button  {...menuButtonProps}/></LinkComponent>
        }
        //Backbone case
        clickHandler = () => {
            if(menuButton.onClick) menuButton.onClick();
            navigate(menuButton.route, true);
        };
        return <Button {...menuButtonProps} onClick={clickHandler}/>

    }
    //No route => Both the same treatement.
    return <Button {...menuButtonProps} onClick={menuButton.onClick}/>
}

// default props
const defaultProps = {
    items: [],
    LinkComponent: undefined,
    MenuItems,
    navigate
};

// props types
const propTypes = {
    navigate: PropTypes.func,
    items: PropTypes.array,
    handleBrandClick: PropTypes.func,
    LinkComponent: PropTypes.func,
    MenuItems: PropTypes.func
};

function MenuLeft(props) {
    const {direction, handleBrandClick, position, children, items, LinkComponent, navigate, MenuItems, ...otherProps} = props;
    const itemRenderProps = {LinkComponent, navigate};
    const hasBrandClickHandler = !!handleBrandClick;

    return (
        <nav data-focus='menu-left' {...otherProps}>
            <div data-focus='menu-brand' data-click={hasBrandClickHandler} onClick={() => handleBrandClick && handleBrandClick()} />
            <ul data-focus='menu-items'><MenuItems items={items} {...itemRenderProps}/></ul>
            {children}
        </nav>
    );
}

// Static props.
MenuLeft.defaultProps = defaultProps;
MenuLeft.propTypes = propTypes;

export default MenuLeft;
