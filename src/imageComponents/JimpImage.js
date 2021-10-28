import Jimp from 'jimp';
import ReplaceColor from 'replace-color'
import React, { Component } from 'react';
import image from './obr.png'


class Binarization extends Component {

    getGraphImg = () => {

        const lightRed =  {r: 176, g: 127, b: 141, a: 255};
        const red = {r: 176, g: 127, b: 141, a: 255};  // Color you want to replace
        const darkRed =  {r: 191, g: 68, b: 112, a: 255};
        const blue =  {r: 75, g: 92, b: 159, a: 255};
        const white = {r: 255, g: 255, b: 255, a: 255};  // Color you want to replace with
        const black = {r: 0, g: 0, b: 0, a: 0};
        const colorDistance = (c1, c2) => Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2) + Math.pow(c1.a - c2.a, 2));  // Distance between two colors
        const darkRedThreshold = 0;  // Replace colors under this threshold. The smaller the number, the more specific it is.
        const redTreshold = 60;
        const lightRedTreshold = 60;
        const blueThreshold = 50;

        const img = Jimp.read(image)
            .then(image => {
                return image
                .quality(100) // set JPEG quality
                .scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
                    const thisColor = {
                    r: image.bitmap.data[idx + 0],
                    g: image.bitmap.data[idx + 1],
                    b: image.bitmap.data[idx + 2],
                    a: image.bitmap.data[idx + 3]
                    };
                    if(colorDistance(blue, thisColor) <= blueThreshold) {
                    image.bitmap.data[idx + 0] = black.r;
                    image.bitmap.data[idx + 1] = black.g;
                    image.bitmap.data[idx + 2] = black.b;
                    image.bitmap.data[idx + 3] = black.a;
                    } else if (colorDistance(darkRed, thisColor) <= darkRedThreshold) {
                        image.bitmap.data[idx + 0] = white.r;
                        image.bitmap.data[idx + 1] = white.g;
                        image.bitmap.data[idx + 2] = white.b;
                        image.bitmap.data[idx + 3] = white.a;
                    } else if(colorDistance(red, thisColor) <= redTreshold) {
                        image.bitmap.data[idx + 0] = white.r;
                        image.bitmap.data[idx + 1] = white.g;
                        image.bitmap.data[idx + 2] = white.b;
                        image.bitmap.data[idx + 3] = white.a;
                    } else if (colorDistance(lightRed, thisColor) <= lightRedTreshold) {
                        image.bitmap.data[idx + 0] = white.r;
                        image.bitmap.data[idx + 1] = white.g;
                        image.bitmap.data[idx + 2] = white.b;
                        image.bitmap.data[idx + 3] = white.a;
                    }
                })
                .getBase64(Jimp.MIME_JPEG)
            })
            .catch(err => {
                console.error(err);
            });

        return <img src={img} alt="dziala"/>
    }


    render(){
        return(
            <>
                <div>
                    {this.getGraphImg()}
                </div>
            </>
        )
    }
}

export default Binarization;