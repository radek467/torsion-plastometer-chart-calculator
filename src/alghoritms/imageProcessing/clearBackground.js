import Jimp from 'jimp';
import Bresenham from 'bresenham/generator';

const LIGHT_RED_RGBA = { r: 176, g: 127, b: 141, a: 255 }; // Color to replace - color of background lines
const RED_RGBA = { r: 176, g: 127, b: 141, a: 255 };  // Color to replace - color of background lines
const RED_RGBA_TO_MEASURE_DISTANCE = { r: 207, g: 160, b: 170, a: 255 };  // Color to get 5 mm lines
const DARK_RED_RGBA = { r: 191, g: 68, b: 112, a: 255 }; //Color to replace - color of background lines
const BLUE_RGBA = { r: 75, g: 92, b: 159, a: 255 };  //Color to replace - color of chart
const WHITE_RGBA = { r: 255, g: 255, b: 255, a: 255 };  // Color to replace red lines of background
const BLACK_RGBA = { r: 0, g: 0, b: 0, a: 255 };  // Color to replace blue chart
const DARK_RED_THRESHOLD = 45;  // Replace colors under this threshold. The smaller the number, the more specific it is.
const RED_THRESHOLD = 60;  // Replace colors under this threshold. The smaller the number, the more specific it is.
const LIGHT_RED_THRESHOLD = 170;  // Replace colors under this threshold. The smaller the number, the more specific it is.
const BLUE_THRESHOLD = 50;  // Replace colors under this threshold. The smaller the number, the more specific it is.
const distancesinPxBetweenFiveMmLines = [];
let onePixelInMm = 0;

/**
 * 
 * @param initialImage is a given image where background should be cleared and chart color shloud be changed to black
 * @returns Promise with processed image
 */
export function clearBackground(initialImage) {
  return Jimp.read(initialImage)
    .then(image => {
      let toClosestPointsCounter = 0;
      let lastFoundRedPoint = 0;
      let shouldDistancesBeCalculatedForGivenY = true

      return image
        .quality(100)
        //This scan collect red lines from image corresponding five millimeters, needed to calculate pixel in millimeters.
        //It is needed here because has to be done before clear background
        .scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
          if (x === 0) {
            shouldDistancesBeCalculatedForGivenY = true;
            toClosestPointsCounter = 0;
            lastFoundRedPoint = 0
          }

          const imageColor = Jimp.intToRGBA(image.getPixelColor(x, y))
          if (shouldDistancesBeCalculatedForGivenY && isDistanceBetweenColorsLessOrEqualThreshold(imageColor, RED_RGBA_TO_MEASURE_DISTANCE, 30) && x !== 0) {
            if ((x - lastFoundRedPoint) < 10) {
              toClosestPointsCounter++;
            } else if (toClosestPointsCounter > 10) {
              shouldDistancesBeCalculatedForGivenY = false
            } else {
              distancesinPxBetweenFiveMmLines.push(x - lastFoundRedPoint);
              // points.push(x);
              lastFoundRedPoint = x;
            }
          }

        })
        .quality(100)
        .scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
          image = processBackgroundAndChartColors(image, x, y)
        })

    }).then(image => {
      const widthOfNotInterpolateImageFragment = 350
      calculateOnePxInMm();;

      image
        // idx is sth like object representing rgba of (xy) bit
        .quality(100)
        .scan(0, 0, image.bitmap.width - widthOfNotInterpolateImageFragment, image.bitmap.height, (x, y, idx) => {
          const thisColor = getImageRgba(image, idx);

          let nearestBlackPointX = -1;
          let nearestBlackPointY = -1;

          if (isDistanceBetweenColorsLessOrEqualThreshold(BLACK_RGBA, thisColor, 10)) {
            for (let searchDistance = 3; searchDistance <= 50; searchDistance++) {
              for (let i = x - searchDistance; i <= x + searchDistance; i++) {
                if (isDistanceBetweenColorsLessOrEqualThreshold(BLACK_RGBA, Jimp.intToRGBA(image.getPixelColor(i, y + searchDistance)), 10)) {
                  nearestBlackPointX = i;
                  nearestBlackPointY = y + searchDistance;
                  break;
                }
              }

              for (let i = y; i <= y + searchDistance; i++) {
                if (isDistanceBetweenColorsLessOrEqualThreshold(BLACK_RGBA, Jimp.intToRGBA(image.getPixelColor(x + searchDistance, i)), 10)) {
                  nearestBlackPointX = x + searchDistance;
                  nearestBlackPointY = i;
                  break;
                }
              }

              for (let i = y; i <= y + searchDistance; i++) {
                if (isDistanceBetweenColorsLessOrEqualThreshold(BLACK_RGBA, Jimp.intToRGBA(image.getPixelColor(x - searchDistance, i)), 10)) {
                  nearestBlackPointX = x - searchDistance;
                  nearestBlackPointY = i;
                  break;
                }
              }

              for (let i = x + searchDistance; i <= x + searchDistance; i++) {
                if (isDistanceBetweenColorsLessOrEqualThreshold(BLACK_RGBA, Jimp.intToRGBA(image.getPixelColor(i, y - searchDistance)), 10)) {
                  nearestBlackPointX = i;
                  nearestBlackPointY = y - searchDistance;
                  break;
                }
              }

              //closest black point was finded
              if (nearestBlackPointX !== -1 && nearestBlackPointY !== -1) {
                break;
              }
            }


            if (nearestBlackPointX !== -1 && nearestBlackPointY !== -1) {
              //create line between two points
              var line = Bresenham(x, y, nearestBlackPointX, nearestBlackPointY);
              do {
                var point = line.next().value;
                if (point != undefined) {
                  image.setPixelColor(Jimp.rgbaToInt(0, 0, 0, 255), point.x, point.y)
                }
              } while (point);
            }
          }
        })
      return { image, value: onePixelInMm }

    })
}

function getImageRgba(image, rgbaIdx) {
  return {
    r: image.bitmap.data[rgbaIdx + 0],
    g: image.bitmap.data[rgbaIdx + 1],
    b: image.bitmap.data[rgbaIdx + 2],
    a: image.bitmap.data[rgbaIdx + 3]
  };
}

function isDistanceBetweenColorsLessOrEqualThreshold(firstColor, secondColor, threshold) {
  return getColorDistanceBetweenTwoColors(firstColor, secondColor) < threshold;
}

function getColorDistanceBetweenTwoColors(c1, c2) {
  return Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2) + Math.pow(c1.a - c2.a, 2));
}

function processBackgroundAndChartColors(image, x, y) {
  const thisColor = Jimp.intToRGBA(image.getPixelColor(x, y))
  if (isDistanceBetweenColorsLessOrEqualThreshold(BLUE_RGBA, thisColor, BLUE_THRESHOLD)) {
    image.setPixelColor(Jimp.rgbaToInt(BLACK_RGBA.r, BLACK_RGBA.g, BLACK_RGBA.b, BLACK_RGBA.a), x, y)
  } else if (isDistanceBetweenColorsLessOrEqualThreshold(DARK_RED_RGBA, thisColor, DARK_RED_THRESHOLD)) {
    image.setPixelColor(Jimp.rgbaToInt(WHITE_RGBA.r, WHITE_RGBA.g, WHITE_RGBA.b, WHITE_RGBA.a), x, y)
  } else if (isDistanceBetweenColorsLessOrEqualThreshold(RED_RGBA, thisColor, RED_THRESHOLD)) {
    image.setPixelColor(Jimp.rgbaToInt(WHITE_RGBA.r, WHITE_RGBA.g, WHITE_RGBA.b, WHITE_RGBA.a), x, y)
  } else if (isDistanceBetweenColorsLessOrEqualThreshold(LIGHT_RED_RGBA, thisColor, LIGHT_RED_THRESHOLD)) {
    image.setPixelColor(Jimp.rgbaToInt(WHITE_RGBA.r, WHITE_RGBA.g, WHITE_RGBA.b, WHITE_RGBA.a), x, y)
  } else if (!isDistanceBetweenColorsLessOrEqualThreshold(BLACK_RGBA, thisColor, 20)) {
    image.setPixelColor(Jimp.rgbaToInt(WHITE_RGBA.r, WHITE_RGBA.g, WHITE_RGBA.b, WHITE_RGBA.a), x, y)
  }

  return image;
}

function calculateOnePxInMm() {
  const mapWithCalculatedAllDistencesOccurances = createMapWithCalculatedAllDistanceOccurences();
  console.log(mapWithCalculatedAllDistencesOccurances)
  const sortedMapWithDistances = sortMapByValues(mapWithCalculatedAllDistencesOccurances)
  onePixelInMm = getValueOnePixelInMm(getWeightedAverageFromMostCommonValuesFromMap(sortedMapWithDistances, 10));

  console.log("One px in mm is: " + onePixelInMm)
  console.log(sortedMapWithDistances)
}

const createMapWithCalculatedAllDistanceOccurences = () => {
  const foundDistancesToQuantityMap = new Map();
  distancesinPxBetweenFiveMmLines.forEach(distance => {
    if (foundDistancesToQuantityMap.has(distance)) {
      let distanceCounter = foundDistancesToQuantityMap.get(distance) + 1;
      foundDistancesToQuantityMap.set(distance, distanceCounter)
    } else {
      foundDistancesToQuantityMap.set(distance, 1)
    }
  })
  return foundDistancesToQuantityMap;
}

const sortMapByValues = (map) => {
  return new Map([...map.entries()]
    .sort((a, b) => b[1] - a[1]));
}

const getWeightedAverageFromMostCommonValuesFromMap = ([...sortedMap], elementsQuantity) => {
  const mostCommonResult = sortedMap[Symbol.iterator]().next().value[0];
  let averageDivider = 0;
  let averageSum = 0;

  const mapIterator = sortedMap[Symbol.iterator]();

  for (let i = 0; i < elementsQuantity; i++) {
    const mapValue = mapIterator.next().value;

    if (mapValue[0] % mostCommonResult === 0) {
      averageSum += mostCommonResult * mapValue[1];
      averageDivider += mapValue[1];
    } else if (Math.abs(mapValue[0] - mostCommonResult) <= 10) {
      averageSum += mapValue[0] * mapValue[1];
      averageDivider += mapValue[1];
    } else {
      continue;
    }
  }

  const weightedAverage = averageSum / averageDivider;
  console.log("weighted average: " + weightedAverage)

  return weightedAverage
}



function getValueOnePixelInMm(averageValue) {
  // const mostCommonValue = distanceToUsageQuantityMap[Symbol.iterator]().next().value;
  // const pixelsToFiveMm = mostCommonValue[0];
  // console.log(pixelsToFiveMm)
  const onePixelInMmValue = 5.0 / parseFloat(averageValue);
  return onePixelInMmValue;
}
