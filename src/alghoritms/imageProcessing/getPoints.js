import Jimp, { diff } from 'jimp';

const black = {r: 0, g: 0, b: 0, a: 255};
const red = {r: 176, g: 127, b: 141, a: 255};
const colorDistance = (c1, c2) => Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2) + Math.pow(c1.a - c2.a, 2));  // Distance between two colors
const blackPoints = [];
const leftPointsPararell = [];
let referenceChartPointY = -1;
let pointsImageToReturn = "";
let startPointToCalculate = -1;
let toCheck = -1
let differenceBetweenPoints = -1;


export async function getResults(images, onePxInMm){

    const leftChart = images.leftChart;
    const rightChart = images.rightChart;
    const points = images.points;
    const leftChartDeviations = [];
    const rightChartDeviations = [];
    let leftImageToReturn = "";
    let rightImageToReturn = ""
    startPointToCalculate = -1;
    await getPoints(points);
    
    console.log("black points")
    console.log(blackPoints);

    console.log("wait for difference between points")
    differenceBetweenPoints = await calculateDifferenceBetweenPoints();
    console.log("difference: " + differenceBetweenPoints)

    startPointToCalculate = -1;
    await getChartPoints(leftChart, leftChartDeviations, onePxInMm)
        .then(image => {
            image.getBase64(Jimp.MIME_PNG, (err, buffer) => {
            leftImageToReturn = buffer;
        })})

    startPointToCalculate = -1;

    await getChartPoints(rightChart, rightChartDeviations, onePxInMm)
    .then(image => image.getBase64(Jimp.MIME_PNG, (err, buffer) => {
        rightImageToReturn = buffer;
    }))
    const obj = {
        leftChartDeviations,
        rightChartDeviations,
        leftImageToReturn,
        rightImageToReturn
    }
    return obj
}

function getPoints(imageToProcess) {
    return Jimp.read(imageToProcess)
        .then(image => {
            return image
            .quality(100) // set JPEG quality

            .scan(0, 0, image.bitmap.width-7, image.bitmap.height, (x, y, idx) => { 
              let thisColor = getImageRgba(image, idx);

                if(makeSurePixelsAreNotDirectNeighbour(y, Math.max(...blackPoints), 10) && isDistanceBetweenColorsLessOrEqualThreshold(black, thisColor, 10)){
                  console.log(image.getPixelColor(x, y))
                    blackPoints.push(parseInt(y) + 5);                  

                    for(let i = x; i < x+15; i++) {
                      image.setPixelColor(Jimp.rgbaToInt(red.r, red.g, red.b, red.a), i, y)
                    }
                    
                    x = 0;   
                }


            })})

        
        .then(image => image.getBase64(Jimp.MIME_PNG, (err, buffer) => {
                pointsImageToReturn = buffer;
                return image
            }));
    }

function makeSurePixelsAreNotDirectNeighbour(y1, y2, expectedMinimalSpace) {
    return Math.abs(y1 - y2) >= expectedMinimalSpace;
}

async function  getChartPoints(imageToProcess, points, onePxInMm) {
    let chartPointsForFoundPoints = [];
    let shouldDeviationsGetForCurrentYValue = false;

    return Jimp.read(imageToProcess)
    .then(image => {
        return image
          .scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => { 
            const thisColor = getImageRgba(image, idx);    
          if(x == 0){
            shouldDeviationsGetForCurrentYValue = true;
          }
    
          if(blackPoints.includes(y) && isDistanceBetweenColorsLessOrEqualThreshold(black, thisColor, 10) && shouldDeviationsGetForCurrentYValue == true){
            shouldDeviationsGetForCurrentYValue = false;
            for(let i = 0; i < 25; i++){
              image.setPixelColor(Jimp.rgbaToInt(red.r, red.g, red.b, red.a), x + i, y)
            }
            chartPointsForFoundPoints.push(x);
          }
        
        
        })      
    })
    //find start of chart
    .then(image => {
      console.log("start point to calculate: " + startPointToCalculate)
      console.log("range:");
      console.log(Math.max(...blackPoints) - differenceBetweenPoints*2);
        return image
        .scan(0, Math.max(...blackPoints) + differenceBetweenPoints*2 - 2, image.bitmap.width, Math.max(...blackPoints) + differenceBetweenPoints*2 +2, (x, y, idx) => { 
            const thisColor = getImageRgba(image, idx);
              if(colorDistance(black, thisColor) <= 10 && y == Math.max(...blackPoints) + differenceBetweenPoints*2 && startPointToCalculate < 0) {
                startPointToCalculate = x;
                toCheck = y
                console.log(" x: " + startPointToCalculate + " y: " + y)

              }

              if(x - startPointToCalculate <= 40 && toCheck == y) {
                image.setPixelColor(Jimp.rgbaToInt(255,138,5,255), x, toCheck);
              }
    }
    )})

    .then(x => {
        const values = calculateDeviation(chartPointsForFoundPoints, startPointToCalculate, onePxInMm);       
        points.push(...values);
        return x
    })
}


function calculateDeviation(points, referenceXPoint, onePixelInMm){
    const chartDeviation = [];
    points.forEach(point => chartDeviation.push(Math.abs((referenceXPoint - point) * onePixelInMm)));
    return chartDeviation;
}

async function calculateDifferenceBetweenPoints() {
    const blackPointsLength = blackPoints.length;
    return Math.abs(blackPoints[blackPointsLength-3] - blackPoints[blackPointsLength - 4] )
}

function getImageRgba(image, rgbaIdx) {
    return  {
      r: image.bitmap.data[rgbaIdx + 0],
      g: image.bitmap.data[rgbaIdx + 1],
      b: image.bitmap.data[rgbaIdx + 2],
      a: image.bitmap.data[rgbaIdx + 3]
    };
  }

  function isDistanceBetweenColorsLessOrEqualThreshold(firstColor, secondColor, threshold) {
    return getColorDistanceBetweenTwoColors(firstColor, secondColor) < threshold;
  }

  function getColorDistanceBetweenTwoColors(c1, c2){
    return Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2) + Math.pow(c1.a - c2.a, 2));
  } 

