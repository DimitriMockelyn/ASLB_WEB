import React from 'react';

export default React.createClass({
    displayName: 'Ribbon',
    getInitialState() {
       return {
           _id: this.props.id || this.props._id,
           text: '',
           color_ribbon : 'rgba(0,138,59,1)',
           color_ribbon_light : 'rgba(0,114,45,1)',
           color_ribbon_dark : 'rgba(0,86,28,1)',
           color_ribbon_darker : 'rgba(15,51,10,1)'
        };
    },
    componentDidMount() {
        this.setState(this.props); 
    },
    componentWillReceiveProps(newProps) {
        this.setState(newProps);
    },
    /** @inheritDoc */
    render() {
        var {color_ribbon , color_ribbon_light , color_ribbon_dark , color_ribbon_darker, text } = this.state;
        return (
            <div data-focus='user-ribbon' >
                <style dangerouslySetInnerHTML={{__html: `
                    
                    [id='${this.state._id || 'new_ribbon'}'][data-focus='corner-ribbon'] > div > div:after {
                        background: linear-gradient(to bottom,  ${color_ribbon_darker} 55%,${color_ribbon} 99%);
                    }
                    [id='${this.state._id || 'new_ribbon'}'][data-focus='corner-ribbon'] > div > div > div {
                        box-shadow         : inset 0px 0px 0px 3px ${color_ribbon_light} ,inset 0px 0px 0px 4px rgba(0,0,0,0.5),inset 0px 0px 0px 5px rgba(255,255,255,0.4), 0px 21px 5px -18px rgba(0,0,0,0.8); 
                        background: linear-gradient(to right,  ${color_ribbon_light}  0%,${color_ribbon} 51%,${color_ribbon_dark} 100%);
                    }
                    [id='${this.state._id || 'new_ribbon'}'][data-focus='corner-ribbon'] > div > div:before {
                        background: linear-gradient(to right,  ${color_ribbon} 1%,${color_ribbon_darker} 45%);
                    }
                
                `}}/>
                <div data-focus="corner-ribbon" id={this.state._id || 'new_ribbon'}>
                <div>
                <div>
                  <div><div>{this.state.text}</div></div>
                </div>
              </div>
            </div>
            </div>
        );
    }
});
