import React, {Component, PropTypes} from 'react';
import {navigate} from 'focus-core/history';
import {component as Button} from 'focus-components/common/button/action';

const MenuItems = React.createClass({
    getInitialState() {
        return {};
    },
    _renderButton(menuButton, LinkComponent, navigate) {
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
    },
    _computeLink(menuButton, LinkComponent, navigate, idx) {
        const that = this;
        return () => {
            that.setState({active: idx});
            navigate(menuButton.route, true);
        }
    },
    _renderItemsList(items, LinkComponent, navigate) {
        const that = this;
        return items.map((link, idx) => {
            return (
                <li key={idx} className={that.state.active === idx ? 'active-menu' : ''} onClick={this._computeLink(link, LinkComponent, navigate, idx)}>
                    {this._renderButton(link, LinkComponent, navigate)}
                    <span>{link.name}</span>
                </li>
            );
        })
    },
    render() {
        const {items, LinkComponent, navigate} = this.props;
        return (
            <div>{this._renderItemsList(items, LinkComponent, navigate)}</div>
        );
    }
});


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
