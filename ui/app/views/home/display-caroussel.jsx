//librairies
import React, {PropTypes} from 'react';
import Carousel from 'nuka-carousel';
export default React.createClass({
    mixins: [Carousel.ControllerMixin],
    render() {
        return <div data-focus='caroussel-home'>
            <Carousel autoplay={true} autoplayInterval={5000} speed={5000} easing='linear' dragging={false} wrapAround={true} slidesToShow={2}>
                <img src="http://www.laboursidiere.com/sites/default/files/BOURSI_PARVIS_V02_02_HD.jpg"/>
                <img src="https://www.noveos.fr/galerie/originales/2016/10/14/png/img_5800ebb881812.png"/>
                <img src="http://www.mentalgiantscrossfit.com/uploads/2/9/0/8/29083963/mental_giants_crossfit_104.jpg"/>
            </Carousel>
        </div>;
    }
});
