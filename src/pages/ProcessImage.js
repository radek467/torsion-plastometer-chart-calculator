import React, {useState} from 'react';
import Popup from "../components/Popup";
import ProcessImageCalculationDataContent from "../components/ProcessImageCalculationDataContent"
import {getValueOfOnePixelInMillimeters} from "../alghoritms/imageProcessing/getValueOfOnePixelInMillimeters";
import {clearBackground} from "../alghoritms/imageProcessing/clearBackground";
import Cropper from "../components/Cropper";
import Image from "../components/Image";
import {getTurnsPoints} from "../alghoritms/imageProcessing/getTurnsPoints";
import {getResults} from "../alghoritms/imageProcessing/getChartsDeviations";
import {isArrayEmpty} from "../alghoritms/utils/collectionUtils";

export const ProcessImage = () => {
    const [isImageCutterPopupOpen, setImageCutterPopupOpen] = useState(false);
    const [isCalculatorPopupOpen, setCalculatorPopupOpen] = useState(false);
    const [initialImage, setInitialImage] = useState("");
    const [momentChart, setMomentChart] = useState("");
    const [strengthChart, setStrengthChart] = useState("");
    const [turnsChart, setTurnsChart] = useState("");
    const [momentChartDeviations, setMomentChartDeviations] = useState([]);
    const [strengthChartDeviations, setStrengthChartDeviations] = useState([]);
    const [onePxInMm, setOnePxInMm] = useState(0);

    const clearStatesRelatedWithProcessing = () => {
        setStrengthChartDeviations([]);
        setMomentChartDeviations([]);
        setStrengthChart("");
        setMomentChart("");
        setTurnsChart("");
    }

    const toggleCutterPopup = () => {
        setImageCutterPopupOpen(!isImageCutterPopupOpen)
    }

    const toggleCalculatorPopup = () => {
        setCalculatorPopupOpen(!isCalculatorPopupOpen);
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

                {isCalculatorPopupOpen &&
                <Popup
                    content={<ProcessImageCalculationDataContent momentChartDeviations={[...momentChartDeviations]}
                                                                 strengthChartDeviations={[...strengthChartDeviations]}/>}
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
            </div>
            <div>{(!momentChart && !strengthChart && !turnsChart) ? "" :
                <>
                    <Image title={"initial"} src={momentChart} alt={"fromCrop"}
                           className={'whole-picture'} style={{with: '13vh', height: '60vh'}}></Image>
                    <Image title={"initial"} src={strengthChart} alt={"fromCrop"}
                           className={'whole-picture'} style={{width: '30vh', height: '60vh'}}></Image>
                    <Image title={"initial"} src={turnsChart} alt={"fromCrop"}
                           className={'whole-picture'} style={{width: '1vh', height: '60vh'}}></Image>
                </>
            }
            </div>
        </div>
    )
}