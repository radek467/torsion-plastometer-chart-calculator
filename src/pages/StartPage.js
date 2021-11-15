import React, {Component} from 'react';
import Button from '../components/Button'
import Image from '../components/Image';
import Cropper from '../components/Cropper';
import {clearBackground} from '../alghoritms/imageProcessing/clearBackground.js'
import {getResults} from '../alghoritms/imageProcessing/getChartsDeviations';
import {getValueOfOnePixelInMillimeters} from "../alghoritms/imageProcessing/getValueOfOnePixelInMillimeters";
import {getTurnsPoints} from "../alghoritms/imageProcessing/getTurnsPoints";

import Jimp from 'jimp';
import 'react-image-crop/dist/ReactCrop.css';
import '../styles/mainPage.css'
import DeviationResultTable from '../components/DeviationResultTable'

const LEFT_PROCESS_IMAGE = "leftProcessImage";
const RIGHT_PROCESS_IMAGE = "rightProcessImage";
const POINTS_PROCESS_IMAGE = "pointsProcessImage";

/**
 * Start page should be modified as a start page not page to do calculations
 */
//todo as above
class StartPage extends Component {
    state = {
        initialImage: "",
        imageAfterClearBackground: "",
        leftProcessImage: "",
        rightProcessImage: "",
        pointsProcessImage: "",
        settingImage: "",
        rightChartDeviations: new Array(),
        leftChartDeviations: new Array(),
        onePxInMm: 0
    }

    loadImage = (changedImageToSet) => {
        this.setState({
            changedImage: changedImageToSet,
        })
    }

    getPointsImagesAndDeviations = async () => {
        const objToPass = {
            leftChart: this.state.leftProcessImage,
            rightChart: this.state.rightProcessImage,
        }
        let turnsPoints = [];
        await getTurnsPoints(this.state.pointsProcessImage).then(result => {
            turnsPoints = result.turningPoints;

            this.setState({
                pointsProcessImage: result.image
            })
        })

        getResults(objToPass, this.state.onePxInMm, turnsPoints).then(
            result => {
                this.setState({
                    leftProcessImage: result.leftImageToReturn,
                    rightProcessImage: result.rightImageToReturn,
                    rightChartDeviations: result.rightChartDeviations,
                    leftChartDeviations: result.leftChartDeviations
                })
            }
        )
    }


    setImage = (imageURL) => {
        this.setState({
            [this.state.settingImage]: imageURL
        })
    }

    processImage = () => {
        getValueOfOnePixelInMillimeters(this.state.initialImage).then(value => {
            this.setState({
                onePxInMm: value
            })
        })
        clearBackground(this.state.initialImage)
            .then(processedImage => {
                processedImage.getBase64(Jimp.MIME_PNG, (err, buffer) => {
                    this.setState({
                        imageAfterClearBackground: buffer
                    })
                })
            });
    }


    loadImage = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                this.setState({
                    initialImage: reader.result
                })
            }
        }
        reader.readAsDataURL(e.target.files[0])

    }

    setImageToSave = (image) => {

        this.setState({
            settingImage: image
        })
    }


    render() {
        const processedImageCrop = this.state.imageAfterClearBackground === "" ? null :
            <Cropper image={this.state.imageAfterClearBackground} setImage={this.setImage}/>
        return (
            <>
                <div>
                    <DeviationResultTable momentChartDeviations={this.state.leftChartDeviations.reverse()}
                                          strengthChartDeviations={this.state.rightChartDeviations.reverse()}/>
                </div>

                <div>
                    <input type="file" accept={"image/*"} onChange={this.loadImage}></input>
                    <Button title={"Process image"} clickAction={this.processImage}/>
                </div>

                <div>
                    <div>
                        <Button title={"Crop left chart"}
                                clickAction={this.setImageToSave.bind(this, LEFT_PROCESS_IMAGE)}/>
                        <Button title={"Crop right chart"}
                                clickAction={this.setImageToSave.bind(this, RIGHT_PROCESS_IMAGE)}/>
                        <Button title={"Crop points"}
                                clickAction={this.setImageToSave.bind(this, POINTS_PROCESS_IMAGE)}/>

                    </div>
                    {this.state.imageAfterClearBackground !== "" ? processedImageCrop :
                        <Image title={"initial"} src={this.state.initialImage} alt={"initial"}
                               className={'whole-picture'} style={{width: '35vw'}}></Image>}
                </div>

                <div>
                    <Button title={"Get results"} clickAction={this.getPointsImagesAndDeviations}/>
                </div>

                <div>
                    <Image title={"initial"} src={this.state.leftProcessImage} alt={"fromCrop"}
                           className={'whole-picture'} style={{with: '13vh', height: '60vh'}}></Image>
                    <Image title={"initial"} src={this.state.rightProcessImage} alt={"fromCrop"}
                           className={'whole-picture'} style={{width: '30vh', height: '60vh'}}></Image>
                    <Image title={"initial"} src={this.state.pointsProcessImage} alt={"fromCrop"}
                           className={'whole-picture'} style={{width: '1vh', height: '60vh'}}></Image>
                </div>

                <p style={{color: "white"}}>
                    {"One px in mm: " + this.state.onePxInMm}
                </p>

                <p style={{color: "white"}}>
                    {"Deviations of left chart: " + this.state.leftChartDeviations.join(", ")}
                </p>
                <p style={{color: "white"}}>
                    {"Deviations of right chart: " + this.state.rightChartDeviations.join(", ")}
                </p>
            </>
        )
    }
}

export default StartPage;

