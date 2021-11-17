import Jimp from "jimp";
import {getImageRgba, isDistanceBetweenColorsLessThenThreshold} from '../utils/imageUtils'

const BLACK_RGBA = {r: 0, g: 0, b: 0, a: 255};

export function getTurnsPoints(turnsImage) {
    const turningPoints = [];
    return Jimp.read(turnsImage)
        .then((image) => {
            const pixelsAddedByCropper = 7
            return image
                .quality(100)
                .scan(0, 0, image.bitmap.width - pixelsAddedByCropper, image.bitmap.height, (x, y, idx) => {
                        let thisColor = getImageRgba(image, idx);
                        if (isTurningPoint(y, turningPoints, thisColor)) {
                            turningPoints.push(parseInt(y));
                        }
                    }
                );
        })
        .then(async (image) => {
            const resultPointArray = setBlackPointsAccordingAverageTurningLength([...turningPoints]);
            return [...resultPointArray];
        });
}

const isTurningPoint = (y, turningPoints, thisColor) => {
    return makeSurePixelsAreNotDirectNeighbour(y, Math.max(...turningPoints), 10) && isDistanceBetweenColorsLessThenThreshold(BLACK_RGBA, thisColor, 10)
}

function makeSurePixelsAreNotDirectNeighbour(y1, y2, expectedMinimalSpace) {
    return Math.abs(y1 - y2) >= expectedMinimalSpace;
}

function setBlackPointsAccordingAverageTurningLength(turningPoints) {
    const differenceBetweenPoints = getOneTurningAverageLengthInPixels([...turningPoints]);

    turningPoints.push(parseInt(turningPoints[turningPoints.length - 1]) + parseInt(differenceBetweenPoints));
    turningPoints.reverse();
    for (let i = 1; i < turningPoints.length; i++) {
        turningPoints[i] = parseInt(turningPoints[i - 1]) - parseInt(differenceBetweenPoints);
    }
    turningPoints[0] = turningPoints[0] - Math.round(differenceBetweenPoints / 2);
    return turningPoints;
}

function getOneTurningAverageLengthInPixels(distances) {
    const foundDifferenceBetweenPointsToQuantityMap = new Map();

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
    return Math.round(averageSum / averageDivider);
}