import React, {useState} from 'react';
import {isArrayEmpty} from "../alghoritms/utils/collectionUtils";
import ResultPresentation from "../components/ResultPresentation";

import '../styles/savedCharts.css'
import '../styles/mainStyles.css'
import {URL} from "../Address"

const RESULT_URL = URL + "app/results"

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
    if (isArrayEmpty(images)) {
        return <></>
    }
    return images.map(image => {
        return (
            <tr>
                <td className={"resultCell"}>{<ResultPresentation sigma={image.sigmas} alternativeDeformations={image.alternativeDeformations} classNames={"imageResultTable float-left fontSize-10"}/>}</td>
                <td className={"resultCell"}>
                    <div style={{paddingLeft: "30%"}}>
                        <p style={{color: "white"}}>{image.name}</p>
                    </div>
                    <img src={image.imageURL} className={"savedImage"}/>
                </td>
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
