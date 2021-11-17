import Jimp from "jimp";
import {isDistanceBetweenColorsLessThenThreshold} from "../utils/imageUtils";
import {sortMapByValues, incrementValue} from "../utils/collectionUtils";

const RED_RGBA_TO_MEASURE_DISTANCE = {r: 207, g: 160, b: 170, a: 255};  // Color to get 5 mm lines

export async function getValueOfOnePixelInMillimeters(image) {
    const distancesInPxBetweenFiveMmLines = [];
    let toClosestPointsCounter = 0;
    let lastFoundRedPoint = 0;
    let shouldDistancesBeCalculatedForGivenY = true
    await Jimp.read(image).then(image => {
        return image
            .quality(100)
            .scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
                if (x === 0) {
                    shouldDistancesBeCalculatedForGivenY = true;
                    toClosestPointsCounter = 0;
                    lastFoundRedPoint = 0
                }

                const imageColor = Jimp.intToRGBA(image.getPixelColor(x, y))
                if (shouldDistancesBeCalculatedForGivenY && isDistanceBetweenColorsLessThenThreshold(imageColor, RED_RGBA_TO_MEASURE_DISTANCE, 30) && x !== 0) {
                    if ((x - lastFoundRedPoint) < 10) {
                        toClosestPointsCounter++;
                    } else if (toClosestPointsCounter > 10) {
                        shouldDistancesBeCalculatedForGivenY = false
                    } else {
                        distancesInPxBetweenFiveMmLines.push(x - lastFoundRedPoint);
                        lastFoundRedPoint = x;
                    }
                }
            })
    })

    return calculateOnePxInMm(distancesInPxBetweenFiveMmLines);
}

function calculateOnePxInMm(distancesInPxBetweenFiveMmLines) {
    const mapWithCalculatedAllDistancesOccurrences = createMapWithCalculatedAllDistanceOccurrences(distancesInPxBetweenFiveMmLines);
    const sortedMapWithDistances = sortMapByValues(mapWithCalculatedAllDistancesOccurrences)
    return getValueOnePixelInMm(getWeightedAverageFromMostCommonValuesFromMap(sortedMapWithDistances, 10));
}

const createMapWithCalculatedAllDistanceOccurrences = (distancesInPxBetweenFiveMmLines) => {
    const foundDistancesToQuantityMap = new Map();
    distancesInPxBetweenFiveMmLines.forEach(distance => {
        if (foundDistancesToQuantityMap.has(distance)) {
            incrementValue(foundDistancesToQuantityMap, distance, 1)
        } else {
            foundDistancesToQuantityMap.set(distance, 1)
        }
    })
    return foundDistancesToQuantityMap;
}

const getWeightedAverageFromMostCommonValuesFromMap = ([...sortedMap], elementsQuantity) => {
    const mostCommonResult = sortedMap[Symbol.iterator]().next().value[0];
    let averageDivider = 0;
    let averageSum = 0;
    const mapIterator = sortedMap[Symbol.iterator]();

    for (let i = 0; i < elementsQuantity; i++) {
        const mapValue = mapIterator.next().value;
        if (isValueMultipleOfMostCommonValue(mostCommonResult, mapValue[0])) {
            averageSum += mostCommonResult * mapValue[1];
            averageDivider += mapValue[1];
        } else if (isValueCloseEnoughToMostCommonValue(mostCommonResult, mapValue[0], 10)){
            averageSum += mapValue[0] * mapValue[1];
            averageDivider += mapValue[1];
        }
    }
    return averageSum / averageDivider;
}

const isValueMultipleOfMostCommonValue = (mostCommonValue, value) => {
    return value % mostCommonValue === 0
}

const isValueCloseEnoughToMostCommonValue = (mostCommonValue, value, distance) => {
    return Math.abs(value - mostCommonValue) <= distance;
}

function getValueOnePixelInMm(averageValue) {
    return  5.0 / parseFloat(averageValue);
}
