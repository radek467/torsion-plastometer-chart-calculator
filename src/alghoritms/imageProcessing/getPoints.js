import Jimp from "jimp";
import ImageUtils from '../utils/imageUtils'

const black = {r: 0, g: 0, b: 0, a: 255};
const red = {r: 176, g: 127, b: 141, a: 255};
const colorDistance = (c1, c2) =>
    Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2) + Math.pow(c1.a - c2.a, 2)); // Distance between two colors
let blackPoints = [];
const leftPointsPararell = [];
let referenceChartPointY = -1;
let pointsImageToReturn = "";
let startPointToCalculate = -1;
let toCheck = -1;
let differenceBetweenPoints = -1;

export async function getResults(images, onePxInMm) {
    const leftChart = images.leftChart;
    const rightChart = images.rightChart;
    const points = images.points;
    const leftChartDeviations = [];
    const rightChartDeviations = [];
    let leftImageToReturn = "";
    let rightImageToReturn = "";
    startPointToCalculate = -1;
    await getPoints(points);

    differenceBetweenPoints = getOneTurningAverageLenghtInPixels();
    startPointToCalculate = -1;
    await getChartPoints(leftChart, leftChartDeviations, onePxInMm)
        .then((image) => {
                image.getBase64(Jimp.MIME_PNG, (err, buffer) => {
                    leftImageToReturn = buffer;
                });
            }
        );
    startPointToCalculate = -1;
    await getChartPoints(rightChart, rightChartDeviations, onePxInMm)
        .then((image) => image.getBase64(Jimp.MIME_PNG, (err, buffer) => {
                rightImageToReturn = buffer;
            })
        );
    const obj = {
        leftChartDeviations,
        rightChartDeviations,
        leftImageToReturn,
        rightImageToReturn,
    };
    return obj;
}

function getPoints(imageToProcess) {
    return Jimp.read(imageToProcess)
        .then((image) => {
            return image
                .quality(100)
                .scan(0, 0, image.bitmap.width - 7, image.bitmap.height, (x, y, idx) => {
                        let thisColor = getImageRgba(image, idx);
                        if (makeSurePixelsAreNotDirectNeighbour(y, Math.max(...blackPoints), 10) && isDistanceBetweenColorsLessOrEqualThreshold(black, thisColor, 10)) {
                            blackPoints.push(parseInt(y));
                            for (let i = x; i < x + 15; i++) {
                                image.setPixelColor(Jimp.rgbaToInt(red.r, red.g, red.b, red.a), i, y);
                            }
                            x = 0;
                        }
                    }
                );
        })

        .then((image) => {
            differenceBetweenPoints = getOneTurningAverageLenghtInPixels();
            return image;
        })
        .then((image) => {
            setBlackPointsAccordingAvarageTurningLenght();
            return image;
        });
}

function makeSurePixelsAreNotDirectNeighbour(y1, y2, expectedMinimalSpace) {
    return Math.abs(y1 - y2) >= expectedMinimalSpace;
}

function setBlackPointsAccordingAvarageTurningLenght() {
    const blackPointsCopy = [...blackPoints];

    blackPointsCopy.push(parseInt(blackPointsCopy[blackPointsCopy.length - 1]) + parseInt(differenceBetweenPoints));
    blackPointsCopy.reverse();
    for (let i = 1; i < blackPointsCopy.length; i++) {
        blackPointsCopy[i] = parseInt(blackPointsCopy[i - 1]) - parseInt(differenceBetweenPoints);
    }
    blackPointsCopy[0] = blackPointsCopy[0] - Math.round(differenceBetweenPoints / 2);
    blackPoints = blackPointsCopy;
}

async function getChartPoints(imageToProcess, points, onePxInMm) {
    let chartPointsForFoundPoints = [];
    let doesDeviationShouldBeGetForCurrentYValue = false;
    let doesDeviationFoundForBlackPoint = true;
    let counterToDecreaseImageYWhenChartPointToTurningNotFound = 2;

    return (
        Jimp.read(imageToProcess)
            .then((image) => {
                return image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
                        const thisColor = getImageRgba(image, idx);
                        if (x == 0 && blackPoints.includes(y)) {
                            doesDeviationFoundForBlackPoint = false;
                            doesDeviationShouldBeGetForCurrentYValue = true;
                        }

                        if (blackPoints.includes(y) && isDistanceBetweenColorsLessOrEqualThreshold(black, thisColor, 10) && doesDeviationShouldBeGetForCurrentYValue == true) {
                            doesDeviationShouldBeGetForCurrentYValue = false;

                            //only for mark place which point of chart is got
                            for (let i = 0; i < 25; i++) {
                                image.setPixelColor(Jimp.rgbaToInt(red.r, red.g, red.b, red.a), x + i, y);
                            }

                            doesDeviationFoundForBlackPoint = true;
                            chartPointsForFoundPoints.push(x);
                        }

                        if (blackPoints.includes(y) && doesDeviationShouldBeGetForCurrentYValue == true) {
                            image.setPixelColor(Jimp.rgbaToInt(0, 255, 0, 255), x, y);
                        }


                        if (doesDeviationFoundForBlackPoint === false && !blackPoints.includes(y)) {

                            // for (let i = 0; i < Math.round(differenceBetweenPoints / 2); i++) {
                            let color = Jimp.intToRGBA(image.getPixelColor(x, y));

                            if (isDistanceBetweenColorsLessOrEqualThreshold(black, color, 10) && doesDeviationShouldBeGetForCurrentYValue == true) {
                                doesDeviationShouldBeGetForCurrentYValue = false;
                                console.log("jest taki punkt")
                                //only for mark place which point of chart is got
                                for (let j = 0; j < 25; j++) {
                                    image.setPixelColor(Jimp.rgbaToInt(red.r, red.g, red.b, red.a), x + j, y);
                                }

                                chartPointsForFoundPoints.push(x);
                                doesDeviationFoundForBlackPoint = true;

                            }

                            color = Jimp.intToRGBA(image.getPixelColor(x, y - counterToDecreaseImageYWhenChartPointToTurningNotFound));

                            if (isDistanceBetweenColorsLessOrEqualThreshold(black, color, 10) && doesDeviationShouldBeGetForCurrentYValue == true) {
                                doesDeviationShouldBeGetForCurrentYValue = false;

                                //only for mark place which point of chart is got
                                for (let j = 0; j < 25; j++) {
                                    image.setPixelColor(Jimp.rgbaToInt(red.r, red.g, red.b, red.a), x + j, y - counterToDecreaseImageYWhenChartPointToTurningNotFound);
                                }

                                chartPointsForFoundPoints.push(x);
                                doesDeviationFoundForBlackPoint = true;

                            }

                            counterToDecreaseImageYWhenChartPointToTurningNotFound *= 2;
                            // }
                        }


                    }
                );
            })

            //find start of chart
            .then((image) => {
                return image.scan(0, Math.max(...blackPoints) + differenceBetweenPoints * 2 - 2, image.bitmap.width, Math.max(...blackPoints) + differenceBetweenPoints * 2 + 2, (x, y, idx) => {
                        const thisColor = getImageRgba(image, idx);
                        if (colorDistance(black, thisColor) <= 10 && y == Math.max(...blackPoints) + differenceBetweenPoints * 2 && startPointToCalculate < 0) {
                            startPointToCalculate = x;
                            toCheck = y;
                        }

                        if (x - startPointToCalculate <= 40 && toCheck == y) {
                            image.setPixelColor(Jimp.rgbaToInt(255, 138, 5, 255), x, toCheck);
                        }
                    }
                );
            })

            .then((image) => {
                const values = calculateDeviation(chartPointsForFoundPoints, startPointToCalculate, onePxInMm);
                points.push(...values);
                return image;
            })
    );
}

function calculateDeviation(points, referenceXPoint, onePixelInMm) {
    const chartDeviation = [];
    points.forEach((point) =>
        chartDeviation.push(Math.abs((referenceXPoint - point) * onePixelInMm))
    );
    return chartDeviation;
}

function getOneTurningAverageLenghtInPixels() {
    console.log("XD");
    const foundDifferenceBetweenPointsToQuantityMap = new Map();
    const distances = [...blackPoints];

    for (let i = 0; i < distances.length - 1; i++) {
        const value = Math.abs(distances[i + 1] - distances[i]);
        if (foundDifferenceBetweenPointsToQuantityMap.has(value)) {
            let counter = foundDifferenceBetweenPointsToQuantityMap.get(value) + 1;
            foundDifferenceBetweenPointsToQuantityMap.set(value, counter);
        } else {
            foundDifferenceBetweenPointsToQuantityMap.set(value, 1);
        }
    }

    if (foundDifferenceBetweenPointsToQuantityMap.has(10)) {
        foundDifferenceBetweenPointsToQuantityMap.delete(10);
    }
    const sortedMapWithDistances = new Map(
        [...foundDifferenceBetweenPointsToQuantityMap.entries()].sort(
            (a, b) => b[1] - a[1]
        )
    );
    return getWeightedAverageFromResults(sortedMapWithDistances);
}

function getWeightedAverageFromResults(sortedMapWithDistances) {
    const mostCommonResult =
        sortedMapWithDistances[Symbol.iterator]().next().value[0];
    let averageDivider = 0;
    let averageSum = 0;
    for (const [value] of sortedMapWithDistances.entries()) {
        if (value < mostCommonResult * 2 || value > mostCommonResult / 2) {
            averageSum +=
                parseInt(value) * parseInt(sortedMapWithDistances.get(value));
            averageDivider += parseInt(sortedMapWithDistances.get(value));
        }
    }
    const weightedAverage = Math.round(averageSum / averageDivider);

    return weightedAverage;
}

function getImageRgba(image, rgbaIdx) {
    return {
        r: image.bitmap.data[rgbaIdx + 0],
        g: image.bitmap.data[rgbaIdx + 1],
        b: image.bitmap.data[rgbaIdx + 2],
        a: image.bitmap.data[rgbaIdx + 3],
    };
}

function isDistanceBetweenColorsLessOrEqualThreshold(
    firstColor,
    secondColor,
    threshold
) {
    return getColorDistanceBetweenTwoColors(firstColor, secondColor) < threshold;
}

function getColorDistanceBetweenTwoColors(c1, c2) {
    return Math.sqrt(
        Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2) +
        Math.pow(c1.a - c2.a, 2)
    );
}
