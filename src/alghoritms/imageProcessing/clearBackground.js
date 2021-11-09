import Jimp from 'jimp';
import {createLineBetweenTwoPoints, isDistanceBetweenColorsLessThenThreshold} from '../utils/imageUtils'

const LIGHT_RED_RGBA = {r: 176, g: 127, b: 141, a: 255}; // Color to replace - color of background lines
const RED_RGBA = {r: 176, g: 127, b: 141, a: 255};  // Color to replace - color of background lines
const DARK_RED_RGBA = {r: 191, g: 68, b: 112, a: 255}; //Color to replace - color of background lines
const BLUE_RGBA = {r: 75, g: 92, b: 159, a: 255};  //Color to replace - color of chart
const WHITE_RGBA = {r: 255, g: 255, b: 255, a: 255};  // Color to replace red lines of background
const BLACK_RGBA = {r: 0, g: 0, b: 0, a: 255};  // Color to replace blue chart
const DARK_RED_THRESHOLD = 45;  // Replace colors under this threshold. The smaller the number, the more specific it is.
const RED_THRESHOLD = 60;  // Replace colors under this threshold. The smaller the number, the more specific it is.
const LIGHT_RED_THRESHOLD = 170;  // Replace colors under this threshold. The smaller the number, the more specific it is.
const BLUE_THRESHOLD = 50;  // Replace colors under this threshold. The smaller the number, the more specific it is.
const BLACK_THRESHOLD = 10;  // Replace colors under this threshold. The smaller the number, the more specific it is.


/**
 *
 * @param initialImage is a given image where background should be cleared and chart color shloud be changed to black
 * @returns Promise with processed image
 */
export function clearBackground(initialImage) {
    return Jimp.read(initialImage)
        .then(image => {
            return image
                .quality(100)
                .scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
                    image = processBackgroundAndChartColors(image, x, y)
                })

        }).then(image => {
            const widthOfNotInterpolateImageFragment = 350
            return image
                .quality(100)
                .scan(0, 0, image.bitmap.width - widthOfNotInterpolateImageFragment, image.bitmap.height, (x, y, idx) => {
                    image = interpolateChartsByFindingClosestNeighbourOfEachPoint(image, x, y)
                })

        })
}

function processBackgroundAndChartColors(image, x, y) {
    const thisColor = Jimp.intToRGBA(image.getPixelColor(x, y))
    if (isDistanceBetweenColorsLessThenThreshold(BLUE_RGBA, thisColor, BLUE_THRESHOLD)) {
        image.setPixelColor(Jimp.rgbaToInt(BLACK_RGBA.r, BLACK_RGBA.g, BLACK_RGBA.b, BLACK_RGBA.a), x, y)
    } else if (isDistanceBetweenColorsLessThenThreshold(DARK_RED_RGBA, thisColor, DARK_RED_THRESHOLD)) {
        image.setPixelColor(Jimp.rgbaToInt(WHITE_RGBA.r, WHITE_RGBA.g, WHITE_RGBA.b, WHITE_RGBA.a), x, y)
    } else if (isDistanceBetweenColorsLessThenThreshold(RED_RGBA, thisColor, RED_THRESHOLD)) {
        image.setPixelColor(Jimp.rgbaToInt(WHITE_RGBA.r, WHITE_RGBA.g, WHITE_RGBA.b, WHITE_RGBA.a), x, y)
    } else if (isDistanceBetweenColorsLessThenThreshold(LIGHT_RED_RGBA, thisColor, LIGHT_RED_THRESHOLD)) {
        image.setPixelColor(Jimp.rgbaToInt(WHITE_RGBA.r, WHITE_RGBA.g, WHITE_RGBA.b, WHITE_RGBA.a), x, y)
    } else if (!isDistanceBetweenColorsLessThenThreshold(BLACK_RGBA, thisColor, 20)) {
        image.setPixelColor(Jimp.rgbaToInt(WHITE_RGBA.r, WHITE_RGBA.g, WHITE_RGBA.b, WHITE_RGBA.a), x, y)
    }

    return image;
}

const interpolateChartsByFindingClosestNeighbourOfEachPoint = (image, x, y) => {

    const thisColor = Jimp.intToRGBA(image.getPixelColor(x, y))
    let nearestBlackPointX = -1;
    let nearestBlackPointY = -1;

    if (isDistanceBetweenColorsLessThenThreshold(BLACK_RGBA, thisColor, 10)) {
        for (let searchDistance = 3; searchDistance <= 50; searchDistance++) {
            for (let i = x - searchDistance; i <= x + searchDistance; i++) {
                if (isTheClosestChartBlackPointToInterpolate(image, i, y + searchDistance)) {
                    nearestBlackPointX = i;
                    nearestBlackPointY = y + searchDistance;
                    break;
                }
            }

            for (let i = y; i <= y + searchDistance; i++) {
                if (isTheClosestChartBlackPointToInterpolate(image, x + searchDistance, i)) {
                    nearestBlackPointX = x + searchDistance;
                    nearestBlackPointY = i;
                    break;
                }
            }

            for (let i = y; i <= y + searchDistance; i++) {
                if (isTheClosestChartBlackPointToInterpolate(image, x - searchDistance, i)) {
                    nearestBlackPointX = x - searchDistance;
                    nearestBlackPointY = i;
                    break;
                }
            }

            for (let i = x + searchDistance; i <= x + searchDistance; i++) {
                if (isTheClosestChartBlackPointToInterpolate(image, i, y - searchDistance)) {
                    nearestBlackPointX = i;
                    nearestBlackPointY = y - searchDistance;
                    break;
                }
            }

            if (nearestBlackPointX !== -1 && nearestBlackPointY !== -1) {
                break;
            }
        }

        if (nearestBlackPointX !== -1 && nearestBlackPointY !== -1) {
            image = createLineBetweenTwoPoints(image, x, y, nearestBlackPointX, nearestBlackPointY);
        }
    }
    return image;
}

const isTheClosestChartBlackPointToInterpolate = (image, x, y) => {
    return isDistanceBetweenColorsLessThenThreshold(BLACK_RGBA, Jimp.intToRGBA(image.getPixelColor(x, y)), BLACK_THRESHOLD)
}


