import React, { PureComponent } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import './CropComponent.css';

class Cropper extends PureComponent {
    state = {
        src: null,
        crop: {
            unit: "%",
            width: 50,
            height: 50,
            aspect: this.width/this.height      
        },

        redIntencityCoefficient: 1.99,
        greenIntencityCoefficient: 0.0,
        blueIntencityCoefficient: 0.00,
    }


    onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const reader = new FileReader();
          reader.addEventListener("load", () =>{
            this.setState({ 
                src: reader.result,
            })
        }
          );
          reader.readAsDataURL(e.target.files[0]);
        }
      };

      onImageLoaded = (image) => {
        this.imageRef = image;
      }
  

      onCropComplete = (crop) => {
        this.makeClientCrop(crop);
      };
    
      onCropChange = (crop, percentCrop) => {
        this.setState({ crop: crop });
      };


      async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
          const croppedImageUrl = await this.getCroppedImg(
            this.imageRef,
            crop,
            "newFile.jpeg"
          );
          this.setState({ croppedImageUrl });
        }
      }
    
      getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");
    
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );

        const histogram = this.hist(ctx, crop.width, crop.height);
        const threshold = this.otsu(histogram, crop.width * crop.height);
        this.binarize(threshold, ctx, crop.width, crop.height);

    
        return new Promise((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (!blob) {
              console.error("Canvas is empty");
              return;
            }
            blob.name = fileName;
            window.URL.revokeObjectURL(this.fileUrl);
            this.fileUrl = window.URL.createObjectURL(blob);
            resolve(this.fileUrl);
          }, "image/jpeg");
        });
      }

      getPhotoById = (id) => {
          console.log("xd")
        return document.getElementById(id);
      }


    render() {
        const { crop, croppedImageUrl, src } = this.state;
        
        return(
           <>
            <div style = {{textAlign: 'center'}}>
                <input type="file" accept="image/*" onChange={this.onSelectFile} />
            </div>

            {src && (
            <ReactCrop
                src={src}
                crop={crop}
                ruleOfThirds
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.onCropChange}
                style = {{maxWidth: "40%"}}
            />
         )}
            <div className = "crop">
                {croppedImageUrl && <img alt="Crop"  src={croppedImageUrl} id="croppedImage"/>}
            </div>
        </>
        )
    }


    otsu(histogram, total) {
        var sum = 0;
        for (var i = 1; i < 256; ++i)
          sum += i * histogram[i];
        var sumB = 0;
        var wB = 0;
        var wF = 0;
        var mB;
        var mF;
        var max = 0.0;
        var between = 0.0;
        var threshold1 = 0.0;
        var threshold2 = 0.0;
        for (var i = 0; i < 256; ++i) {
          wB += histogram[i];
          if (wB == 0)
            continue;
          wF = total - wB;
          if (wF == 0)
            break;
          sumB += i * histogram[i];
          mB = sumB / wB;
          mF = (sum - sumB) / wF;
          between = wB * wF * Math.pow(mB - mF, 2);
          if (between >= max) {
            threshold1 = i;
            if (between > max) {
              threshold2 = i;
            }
            max = between;
          }
        }
        return (threshold1 + threshold2) / 2.0;
      };


      hist(context, w, h) {
        var imageData = context.getImageData(0, 0, w, h);
        var data = imageData.data;
        var brightness;
        var brightness256Val;
        var histArray = Array.apply(null, new Array(256)).map(Number.prototype.valueOf, 0);
      
        for (var i = 0; i < data.length; i += 4) {
          brightness = this.state.redIntencityCoefficient * data[i] + this.state.greenIntencityCoefficient * data[i + 1] + this.state.blueIntencityCoefficient * data[i + 2];
          brightness256Val = Math.floor(brightness);
          histArray[brightness256Val] += 1;
        }
      
        return histArray;
      };


      binarize(threshold, context, w, h) {
        var imageData = context.getImageData(0, 0, w, h);
        var data = imageData.data;
        var val;
      
        for (var i = 0; i < data.length; i += 4) {
          var brightness = this.state.redIntencityCoefficient * data[i] + this.state.greenIntencityCoefficient * data[i + 1] + this.state.blueIntencityCoefficient * data[i + 2];
          val = ((brightness > threshold) ? 255 : 0);
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
        }
      
        // overwrite original image
        context.putImageData(imageData, 0, 0);
      }
}

export default Cropper;