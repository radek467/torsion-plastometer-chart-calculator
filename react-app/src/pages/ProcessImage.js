import React, {useState} from 'react';
import Popup from "../components/Popup";
import ProcessImageCalculationDataContent from "../components/processImageComponents/ProcessImageCalculationDataContent"
import {getValueOfOnePixelInMillimeters} from "../alghoritms/imageProcessing/getValueOfOnePixelInMillimeters";
import {clearBackground} from "../alghoritms/imageProcessing/clearBackground";
import Cropper from "../components/processImageComponents/Cropper";
import {getTurnsPoints} from "../alghoritms/imageProcessing/getTurnsPoints";
import {getResults} from "../alghoritms/imageProcessing/getChartsDeviations";
import {isArrayEmpty} from "../alghoritms/utils/collectionUtils";

import ResultPresentation from "../components/ResultPresentation"
import "../styles/processImage.css"
import SaveImagePopupContent from "../components/processImageComponents/SaveImagePopup";
import {URL} from "../Address"
import ResultChart from "../components/ResultChart";


export const ProcessImage = () => {
    const [isImageCutterPopupOpen, setImageCutterPopupOpen] = useState(false);
    const [isCalculatorPopupOpen, setCalculatorPopupOpen] = useState(false);
    const [isSaveImagePopupOpen, setSaveImagePopupOpen] = useState(false);
    const [initialImage, setInitialImage] = useState("");
    const [momentChart, setMomentChart] = useState("");
    const [strengthChart, setStrengthChart] = useState("");
    const [turnsChart, setTurnsChart] = useState("");
    const [momentChartDeviations, setMomentChartDeviations] = useState([]);
    const [strengthChartDeviations, setStrengthChartDeviations] = useState([]);
    const [onePxInMm, setOnePxInMm] = useState(0);
    const [sigma, setSigma] = useState([]);
    const [alternativeDeformations, setAlternativeDeformations] = useState([]);

    const clearStatesRelatedWithProcessing = () => {
        setStrengthChartDeviations([]);
        setMomentChartDeviations([]);
        setStrengthChart("");
        setMomentChart("");
        setTurnsChart("");
        setSigma([])
        setAlternativeDeformations([])
    }

    const toggleCutterPopup = () => {
        setImageCutterPopupOpen(!isImageCutterPopupOpen)
    }

    const toggleCalculatorPopup = () => {
        setCalculatorPopupOpen(!isCalculatorPopupOpen);
    }

    const toggleSavePopup = () => {
        setSaveImagePopupOpen(!isSaveImagePopupOpen);
    }

    const exportData = () => {
        fetch(URL + "app/processImage/export")
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(
                    new Blob([blob])
                )
                const a = document.createElement("a");
                a.href = url;
                a.setAttribute("download", "result.csv");
                a.click()
            })
    }

    const saveData = () => {
        toggleSavePopup();

    }

    const loadImage = (e) => {
        clearStatesRelatedWithProcessing();
        setTurnsChart("")
        setInitialImage("");
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                processImage(reader.result);
            }
        }
        if (e.target.files[0] !== undefined) {
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    const processImage = (image) => {
        setOnePxInMm(0);
        setInitialImage("");
        getValueOfOnePixelInMillimeters(image).then(value => {
            setOnePxInMm(value)
        })
        clearBackground(image).then(i => {
            setInitialImage(i);
        })
    }

    const getChartsDeviations = async () => {
        const chartsImages = {
            momentChart,
            strengthChart
        }
        let turnsPoints = [];
        await getTurnsPoints(turnsChart).then(result => {
            turnsPoints = result;
        })

        await getResults(chartsImages, onePxInMm, turnsPoints).then(
            result => {
                setMomentChart(result.momentImageToReturn)
                setStrengthChart(result.strengthImageToReturn)
                setStrengthChartDeviations(result.strengthChartDeviations.reverse())
                setMomentChartDeviations(result.momentChartDeviations.reverse())
            }
        )
    }

    return (
        <div className={'processImage-box'}>
            <div className={'processImage-buttonsBar'}>
                <button
                    className="button"
                    onClick={() => {
                        toggleCutterPopup();
                        clearStatesRelatedWithProcessing()
                    }
                    }>Załaduj wykresy
                </button>

                <button
                    className="button"
                    onClick={getChartsDeviations}
                    disabled={!momentChart || !strengthChart || !turnsChart || !isArrayEmpty(momentChartDeviations) || !isArrayEmpty(strengthChartDeviations)}
                >Oblicz wychylenia
                </button>

                <button
                    className="button"
                    onClick={toggleCalculatorPopup}
                    disabled={isArrayEmpty(momentChartDeviations) || isArrayEmpty(strengthChartDeviations)}
                >Ustaw dane obliczeń
                </button>
                <button
                    className="button"
                    onClick={exportData}
                    disabled={isArrayEmpty(sigma) || isArrayEmpty(alternativeDeformations)}
                >Eksportuj
                </button>
                <button
                    className="button"
                    onClick={toggleSavePopup}
                    disabled={isArrayEmpty(sigma) || isArrayEmpty(alternativeDeformations)}
                >Zapisz
                </button>

                {isCalculatorPopupOpen &&
                <Popup
                    content={<ProcessImageCalculationDataContent momentChartDeviations={[...momentChartDeviations]}
                                                                 strengthChartDeviations={[...strengthChartDeviations]}
                                                                 setSigma={setSigma}
                                                                 setAlternativeDeformations={setAlternativeDeformations}
                                                                 togglePopup={toggleCalculatorPopup}


                    />}
                    handleClose={toggleCalculatorPopup}
                />
                }

                {isImageCutterPopupOpen &&
                <Popup
                    content={
                        <>
                            <input type="file" accept={"image/*"} onChange={loadImage}></input>
                            {initialImage === "" ? "" : (
                                <>
                                    <Cropper image={initialImage} setMomentChart={setMomentChart}
                                             setStrengthChart={setStrengthChart} setTurnsChart={setTurnsChart}/>
                                </>
                            )}
                        </>
                    }
                    handleClose={toggleCutterPopup}
                />}
                {isSaveImagePopupOpen &&
                <Popup
                    content={
                        <>
                            <SaveImagePopupContent initialImage={initialImage} sigma={sigma}
                                                   alternativeDeformations={alternativeDeformations}
                                                   handleClose={toggleSavePopup}/>
                        </>
                    }
                    handleClose={toggleSavePopup}
                />}
            </div>
            <div className="processImageContent">{(!momentChart && !strengthChart && !turnsChart) ? "" :
                <>
                    <div className="processImageComponent">
                        {(sigma === [] || alternativeDeformations === []) ? "" :
                            <ResultPresentation sigma={sigma} alternativeDeformations={alternativeDeformations}
                                                classNames={"resultTable float-left"}/>}
                    </div>

                    <div className="processImageComponent">
                        <img src={momentChart} alt={"fromCrop"} style={{width: '11vw', height: "23vw"}}/>
                        <img src={strengthChart} alt={"fromCrop"} style={{width: '11vw', height: "23vw"}}/>
                        <img src={turnsChart} alt={"fromCrop"} style={{width: '2vw', height: "23vw"}}/>
                    </div>

                    <div className="processImageComponent processImage-resultChart ">
                        {isArrayEmpty(sigma) || isArrayEmpty(alternativeDeformations) ? "" : <ResultChart data={{sigma, alternativeDeformations}}/>}

                    </div>
                </>
            }

            </div>
        </div>
    )
}
