import Jimp from "jimp";

export function getImageRgba(image, rgbaIdx) {
    return {
        r: image.bitmap.data[rgbaIdx + 0],
        g: image.bitmap.data[rgbaIdx + 1],
        b: image.bitmap.data[rgbaIdx + 2],
        a: image.bitmap.data[rgbaIdx + 3]
    };
}