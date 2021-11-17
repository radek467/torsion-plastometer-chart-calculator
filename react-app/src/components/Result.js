import React, { Component } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import '../styles/mainPage.css'
import image from '../assets/images/foto.png'


class Result extends Component{
    state = {
        crop: {
            unit: 'px', // default, can be 'px' or '%'
            x: 130,
            y: 50,
            width: 200,
            height: 200
          }
          
    }

    onCropChange = crop => {
        this.setState({ crop });
      };

    render() {
        return(
            <>
                <ReactCrop src = {image} style = {{height: "600px"}}crop = {this.state.crop}onChange={this.onCropChange} />
            </>
        )
    }
}

export default Result;