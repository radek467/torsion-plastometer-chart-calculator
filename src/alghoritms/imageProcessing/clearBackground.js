import Jimp from 'jimp';
import Bresenham from 'bresenham/generator';

const LIGHT_RED_RGBA =  {r: 176, g: 127, b: 141, a: 255}; // Color to replace - color of background lines
const RED_RGBA = {r: 176, g: 127, b: 141, a: 255};  // Color to replace - color of background lines
const RED_RGBA_TO_MEASURE_DISTANCE = {r: 207, g: 160, b: 170, a: 255};  // Color to get 5 mm lines
const DARK_RED_RGBA =  {r: 191, g: 68, b: 112, a: 255}; //Color to replace - color of background lines
const BLUE_RGBA =  {r: 75, g: 92, b: 159, a: 255};  //Color to replace - color of chart
const WHITE_RGBA = {r: 255, g: 255, b: 255, a: 255};  // Color to replace red lines of background
const black = {r: 0, g: 0, b: 0, a: 255};  // Color to replace blue chart
const darkRedThreshold = 45;  // Replace colors under this threshold. The smaller the number, the more specific it is.
const redTreshold = 60;  // Replace colors under this threshold. The smaller the number, the more specific it is.
const lightRedTreshold = 170;  // Replace colors under this threshold. The smaller the number, the more specific it is.
const blueThreshold = 50;  // Replace colors under this threshold. The smaller the number, the more specific it is.
let value = 0;

/**
 * 
 * @param initialImage is a given image where background should be cleared and chart color shloud be changed to black
 * @returns Promise with processed image
 */
export function clearBackground(initialImage) {
  
  return Jimp.read(initialImage)
  .then(image => {
   
      const points = [];
      const distances = [];
      let toClosestPointsCounter = 0;
      let lastFoundRedPoint = 0;
      let shouldBeCalculated = true
      let flag = true;



      return image
      .quality(100)
      .scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        
        if(x === 0){
          shouldBeCalculated = true;
          toClosestPointsCounter = 0;
          lastFoundRedPoint = 0
        }

        if(shouldBeCalculated && x !== 0){
           const imageColor = Jimp.intToRGBA(image.getPixelColor(x, y))
           if(shouldBeCalculated && isDistanceBetweenColorsLessOrEqualThreshold(imageColor, RED_RGBA_TO_MEASURE_DISTANCE, 30)){
             
              if((x - lastFoundRedPoint) < 10){
                toClosestPointsCounter++;
              } else if(toClosestPointsCounter > 10){
                shouldBeCalculated = false
              } else {
                distances.push(x - lastFoundRedPoint);
                points.push(x);
                lastFoundRedPoint = x;
              }
           
        }
      }
       
      })
      //scan works like nested for loop, and width is inside height it means - for y 0 gets all width pixels and then y++
      .quality(100)
      .scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        if(flag == true){         
          const foundDistancesToQuantityMap = new Map();
          distances.sort((x, y) => x - y).forEach(distance => {
            if(foundDistancesToQuantityMap.has(distance)) {
              let counter = foundDistancesToQuantityMap.get(distance) + 1;
              foundDistancesToQuantityMap.set(distance, counter)
            } else {
              foundDistancesToQuantityMap.set(distance, 1)
            }
          })

          const sortedMapWithDistances = new Map([...foundDistancesToQuantityMap.entries()].sort((a,b) => b[1] - a[1]));
          value = getValueOnePixelInMm(sortedMapWithDistances);

          console.log("One px in mm is: " + value)
          console.log(sortedMapWithDistances)
          flag = false
      }


        image = processBackgroundAndChartColors(image, idx)

        // const thisColor = Jimp.intToRGBA(image.getPixelColor(x, y))
        // if(isDistanceBetweenColorsLessOrEqualThreshold(BLUE_RGBA, thisColor, blueThreshold)) {
        //     image.setPixelColor(Jimp.rgbaToInt(black.r, black.g, black.b, black.a), x, y)
        // } else if (isDistanceBetweenColorsLessOrEqualThreshold(DARK_RED_RGBA, thisColor, darkRedThreshold)) {
        //   image.setPixelColor(Jimp.rgbaToInt(WHITE_RGBA.r, WHITE_RGBA.g, WHITE_RGBA.b, WHITE_RGBA.a), x, y)
        // } else if(isDistanceBetweenColorsLessOrEqualThreshold(RED_RGBA, thisColor, redTreshold)) {
        //   image.setPixelColor(Jimp.rgbaToInt(WHITE_RGBA.r, WHITE_RGBA.g, WHITE_RGBA.b, WHITE_RGBA.a), x, y)
        // } else if (isDistanceBetweenColorsLessOrEqualThreshold(LIGHT_RED_RGBA, thisColor, lightRedTreshold)) {
        //   image.setPixelColor(Jimp.rgbaToInt(WHITE_RGBA.r, WHITE_RGBA.g, WHITE_RGBA.b, WHITE_RGBA.a), x, y)
        // } else if(!isDistanceBetweenColorsLessOrEqualThreshold(black, thisColor, 20)){
        //   image.setPixelColor(Jimp.rgbaToInt(WHITE_RGBA.r, WHITE_RGBA.g, WHITE_RGBA.b, WHITE_RGBA.a), x, y)
        // }


      })
      
}).then(image => {
  const img = image
  // idx is sth like object representing rgba of (xy) bit
  .quality(100)
  .scan(400, 400, image.bitmap.width - 400, image.bitmap.height-400, (x, y, idx) => {
    const thisColor = getImageRgba(image, idx);

    let nearestBlackPointX = -1;
    let nearestBlackPointY = -1;

    if(isDistanceBetweenColorsLessOrEqualThreshold(black, thisColor, 10)) {
        for(let searchDistance = 3 ; searchDistance <= 150 ; searchDistance++){
          for(let i = x - searchDistance; i <= x + searchDistance; i++){
            if(getColorDistanceBetweenTwoColors(black, Jimp.intToRGBA(image.getPixelColor(i,y+searchDistance))) < 10){
              nearestBlackPointX = i;
              nearestBlackPointY = y + searchDistance;
              break;
            }
          }

          for(let i = y; i <= y + searchDistance; i++){
              if(getColorDistanceBetweenTwoColors(black, Jimp.intToRGBA(image.getPixelColor(x+searchDistance,i))) < 10){
                nearestBlackPointX = x + searchDistance;
                nearestBlackPointY = i;
                break;
              }
            }

          for(let i = y; i <= y + searchDistance; i++){
              if(getColorDistanceBetweenTwoColors(black, Jimp.intToRGBA(image.getPixelColor(x-searchDistance,i))) < 10){
                nearestBlackPointX = x - searchDistance;
                nearestBlackPointY = i;
                break;
              }
            }

            for(let i = x + searchDistance; i <= x + searchDistance; i++){
              if(getColorDistanceBetweenTwoColors(black, Jimp.intToRGBA(image.getPixelColor(i,y-searchDistance))) < 10){
                nearestBlackPointX = i;
                nearestBlackPointY = y - searchDistance;
                break;
              }
            }

            //closest black point was finded
            if(nearestBlackPointX !== -1 && nearestBlackPointY !== -1){
              break;
            }
          }



          
      if(nearestBlackPointX !== -1 && nearestBlackPointY !== -1){
      //create line between two points
      var line = Bresenham(x, y, nearestBlackPointX, nearestBlackPointY);
      do {
        var point = line.next().value;            
        if(point != undefined){
          image.setPixelColor(Jimp.rgbaToInt(0,0,0,255), point.x, point.y)
        }
      } while(point);
    }
    }
  }) 
return {image, value}
  
})
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

function processBackgroundAndChartColors(image, rgbgIdx) {
  const thisColor = getImageRgba(image , rgbgIdx)

        if(isDistanceBetweenColorsLessOrEqualThreshold(BLUE_RGBA, thisColor, blueThreshold)) {
          image.bitmap.data[rgbgIdx + 0] = black.r;
          image.bitmap.data[rgbgIdx + 1] = black.g;
          image.bitmap.data[rgbgIdx + 2] = black.b;
          image.bitmap.data[rgbgIdx + 3] = black.a;
        } else if (isDistanceBetweenColorsLessOrEqualThreshold(DARK_RED_RGBA, thisColor, darkRedThreshold)) {
            image.bitmap.data[rgbgIdx + 0] = WHITE_RGBA.r;
            image.bitmap.data[rgbgIdx + 1] = WHITE_RGBA.g;
            image.bitmap.data[rgbgIdx + 2] = WHITE_RGBA.b;
            image.bitmap.data[rgbgIdx + 3] = WHITE_RGBA.a;
        } else if(isDistanceBetweenColorsLessOrEqualThreshold(RED_RGBA, thisColor, redTreshold)) {
            image.bitmap.data[rgbgIdx + 0] = WHITE_RGBA.r;
            image.bitmap.data[rgbgIdx + 1] = WHITE_RGBA.g;
            image.bitmap.data[rgbgIdx + 2] = WHITE_RGBA.b;
            image.bitmap.data[rgbgIdx + 3] = WHITE_RGBA.a;
        } else if (isDistanceBetweenColorsLessOrEqualThreshold(LIGHT_RED_RGBA, thisColor, lightRedTreshold)) {
            image.bitmap.data[rgbgIdx + 0] = WHITE_RGBA.r;
            image.bitmap.data[rgbgIdx + 1] = WHITE_RGBA.g;
            image.bitmap.data[rgbgIdx + 2] = WHITE_RGBA.b;
            image.bitmap.data[rgbgIdx + 3] = WHITE_RGBA.a;
          }
          else if(!isDistanceBetweenColorsLessOrEqualThreshold(black, thisColor, 20)){
            image.bitmap.data[rgbgIdx + 0] = WHITE_RGBA.r;
            image.bitmap.data[rgbgIdx + 1] = WHITE_RGBA.g;
            image.bitmap.data[rgbgIdx + 2] = WHITE_RGBA.b;
            image.bitmap.data[rgbgIdx + 3] = WHITE_RGBA.a;
          }
      
  return image;
}

function getValueOnePixelInMm(distanceToUsageQuantityMap) {

  //need to calculate avarage to most found values.

  const mostCommonValue = distanceToUsageQuantityMap[Symbol.iterator]().next().value;
  const pixelsToFiveMm = mostCommonValue[0];
  console.log(pixelsToFiveMm)
  const onePixelInMm = 5.0 / parseFloat(pixelsToFiveMm);
  return onePixelInMm;  

  }
