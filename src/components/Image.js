import {React, Component} from 'react';
import '../styles/image.css';
import '../styles/mainPage.css';

class Image extends Component {
    render () {
        return (
            <>
                <img src = {this.props.src} className = {this.props.className} style={this.props.style}/>
            </>
        )
    }
}

export default Image;