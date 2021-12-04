import Jimp from "jimp";
import {getImageRgba, isDistanceBetweenColorsLessThenThreshold} from '../utils/imageUtils'

const BLACK_RGBA = {r: 0, g: 0, b: 0, a: 255};
const RED_RGBA = {r: 176, g: 127, b: 141, a: 255};

let startTurningPoints = [];
let differenceBetweenPoints;

export async function getResults(images, onePxInMm, turnsPoints) {
    const momentChart = images.momentChart;
    const strengthChart = images.strengthChart;
    const momentChartDeviations = [];
    const strengthChartDeviations = [];
    startTurningPoints = turnsPoints;

    differenceBetweenPoints = Math.abs(startTurningPoints[0] - startTurningPoints[1]);
    const momentResult = await getChartDeviationsInMm(momentChart, momentChartDeviations, onePxInMm)
    const strengthResult = await getChartDeviationsInMm(strengthChart, strengthChartDeviations, onePxInMm)

    return {
        momentChartDeviations: momentResult.deviationsInMm,
        strengthChartDeviations: strengthResult.deviationsInMm,
        momentImageToReturn: momentResult.image,
        strengthImageToReturn: strengthResult.image
    }
}

async function getChartDeviationsInMm(imageToProcess, points, onePxInMm) {
    let chartPointsForFoundTurns = [];
    let startOfTurns = -1;
    let resultObject = {};

    await Jimp.read(imageToProcess)
        .then((image) => {
            const pixelChartDeviationsCalculationResult = getPixelChartDeviations(image);
            chartPointsForFoundTurns = pixelChartDeviationsCalculationResult.chartPointsForFoundTurns;
            return pixelChartDeviationsCalculationResult.image;
        })

        //find start of chart
        .then((image) => {
            let toCheck = -1;
            return image.scan(0, image.bitmap.height - 2, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
                    const thisColor = getImageRgba(image, idx);
                    if (isDistanceBetweenColorsLessThenThreshold(thisColor, BLACK_RGBA, 10) && startOfTurns < 0) {
                        startOfTurns = x;
                        toCheck = y;
                    }

                    if (x - startOfTurns <= 40 && toCheck === y) {
                        image.setPixelColor(Jimp.rgbaToInt(255, 138, 5, 255), x, toCheck);
                    }
                }
            );
        })
        .then(async (image) => {
            const deviationsInMm = calculateDeviation([...chartPointsForFoundTurns], startOfTurns, onePxInMm);
            let returnImage = "";
            await image.getBase64(Jimp.MIME_PNG, (err, buffer) => {
                returnImage = buffer;
            });
            resultObject = {
                image: returnImage,
                deviationsInMm
            };
        });
    return resultObject;
}

const getPixelChartDeviations = (image) => {
    let chartPointsForFoundTurns = [];
    let doesDeviationShouldBeGetForCurrentYValue = false;
    let doesDeviationFoundForBlackPoint = true;
    let counterToDecreaseImageYWhenChartPointToTurningNotFound = 2;

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
            let thisColor = Jimp.intToRGBA(image.getPixelColor(x, y));
            if (isBeginningOfChartOnTurnHeight(x, y)) {
                doesDeviationFoundForBlackPoint = false;
                doesDeviationShouldBeGetForCurrentYValue = true;
            }

            if (isDeviationPoint(y, thisColor, doesDeviationShouldBeGetForCurrentYValue)) {
                doesDeviationShouldBeGetForCurrentYValue = false;
                doesDeviationFoundForBlackPoint = true;
                image = markChart(image, x, y);
                chartPointsForFoundTurns.push(x);
            }

            //mark turns points by green line
            if (startTurningPoints.includes(y) && doesDeviationShouldBeGetForCurrentYValue === true) {
                image.setPixelColor(Jimp.rgbaToInt(0, 255, 0, 255), x, y);
            }

            //find deviations when chart is not continuous at turn y point
            if (doesChartDeviationWasNotFindOnTurnHeight(doesDeviationFoundForBlackPoint, y)) {
                let color = Jimp.intToRGBA(image.getPixelColor(x, y));
                if (isDeviationPointForNotTurnHeight(color, doesDeviationShouldBeGetForCurrentYValue)) {
                    doesDeviationShouldBeGetForCurrentYValue = false;
                    doesDeviationFoundForBlackPoint = true;
                    image = markChart(image, x, y);
                    chartPointsForFoundTurns.push(x);

                }

                color = Jimp.intToRGBA(image.getPixelColor(x, y - counterToDecreaseImageYWhenChartPointToTurningNotFound));
                if (isDeviationPointForNotTurnHeight(color, doesDeviationShouldBeGetForCurrentYValue)) {
                    doesDeviationShouldBeGetForCurrentYValue = false;
                    doesDeviationFoundForBlackPoint = true;
                    image = markChart(image, x, y - counterToDecreaseImageYWhenChartPointToTurningNotFound);
                    chartPointsForFoundTurns.push(x);
                }

                counterToDecreaseImageYWhenChartPointToTurningNotFound *= 2;
            }
        }
    );
    return {image, chartPointsForFoundTurns}
}

const isBeginningOfChartOnTurnHeight = (x, y) => {
    return x === 0 && startTurningPoints.includes(y);
}

const isDeviationPoint = (y, color, doesDeviationShouldBeGetForCurrentYValue) => {
    return startTurningPoints.includes(y) && isDistanceBetweenColorsLessThenThreshold(BLACK_RGBA, color, 10) && doesDeviationShouldBeGetForCurrentYValue === true;
}

const isDeviationPointForNotTurnHeight = (color, doesDeviationShouldBeGetForCurrentValue) => {
    return isDistanceBetweenColorsLessThenThreshold(BLACK_RGBA, color, 10) && doesDeviationShouldBeGetForCurrentValue === true
}

const markChart = (image, x, y) => {
    for (let i = 0; i < 25; i++) {
        image.setPixelColor(Jimp.rgbaToInt(RED_RGBA.r, RED_RGBA.g, RED_RGBA.b, RED_RGBA.a), x + i, y);
    }
    return image;
}

const doesChartDeviationWasNotFindOnTurnHeight = (doesDeviationFoundForBlackPoint, y) => {
    return doesDeviationFoundForBlackPoint === false && !startTurningPoints.includes(y)
}

function calculateDeviation(deviations, referenceXPoint, onePixelInMm) {
    const chartDeviationInMm = [];
    deviations.forEach((point) =>
        chartDeviationInMm.push(Math.abs((referenceXPoint - point) * onePixelInMm))
    );
    return chartDeviationInMm;
}
