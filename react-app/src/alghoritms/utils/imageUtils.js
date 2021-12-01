// import Jimp from "jimp";

import Jimp from "jimp";
import Bresenham from 'bresenham/generator';

const BLACK_RGBA = {r: 0, g: 0, b: 0, a: 255};

export function getImageRgba(image, rgbaIdx) {
    return {
        r: image.bitmap.data[rgbaIdx + 0],
        g: image.bitmap.data[rgbaIdx + 1],
        b: image.bitmap.data[rgbaIdx + 2],
        a: image.bitmap.data[rgbaIdx + 3]
    };
}

export function isDistanceBetweenColorsLessThenThreshold(firstColor, secondColor, threshold) {
    return getColorDistanceBetweenTwoColors(firstColor, secondColor) < threshold;
}

export function createLineBetweenTwoPoints(image, x1, y1, x2, y2){
    const line = Bresenham(x1, y1, x2, y2);
    do {
        var point = line.next().value;
        if (point !== undefined) {
            image.setPixelColor(Jimp.rgbaToInt(BLACK_RGBA.r, BLACK_RGBA.g, BLACK_RGBA.b, BLACK_RGBA.a), point.x, point.y)
        }
    } while (point);

    return image
}

export function b64toBlob(dataURI) {

    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
}

const getColorDistanceBetweenTwoColors = (c1, c2) => {
    return Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2) + Math.pow(c1.a - c2.a, 2));
}