import React, {useState} from 'react';
import Image from "../components/Image";
import {isArrayEmpty} from "../alghoritms/utils/collectionUtils";
import ResultPresentation from "../components/ResultPresentation";

import '../styles/savedCharts.css'
import '../styles/mainStyles.css'

const RESULT_URL = "http://localhost:8080//app/processImage/getImage"

export const SavedCharts = () => {

    const [images, setImages] = useState([]);

    return (
        <div>
            <div>
                <button
                    className="button"
                    onClick={() => fetchImage(setImages)}>
                    Pobierz wykresy
                </button>
            </div>
            <table className={'results'}>
                {createImagesVisualisations(images)}
            </table>
        </div>
    )
}

const createImagesVisualisations = (images) => {
    // console.log(images)
    if (isArrayEmpty(images)) {
        console.log("empty")
        return <></>
    }
    return images.map(image => {
        console.log(image)
        return (
            <tr>
                <td>{<ResultPresentation sigma={image.sigmas} random={image.gcolumns} classNames={"resultTable float-left fontSize-10"}/>}</td>
                <td><Image title={"initial"} src={image.imageData} alt={"fromCrop"}
                                                       className={'whole-picture'} style={{with: '13vh', height: '40vh'}}/></td>
            </tr>
        )
    });
}


const fetchImage = (setImages) => {
    fetch(RESULT_URL)
        .then(response => response.json())
        .then(data => {
            setImages(data);
        })
}
