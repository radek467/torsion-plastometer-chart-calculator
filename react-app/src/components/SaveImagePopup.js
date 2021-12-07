import React, {useState} from 'react';
import {URL} from "../Address"

const RESULT_SAVE_URL = URL + "app/results/save"

const SaveImagePopupContent = ({initialImage, sigma, alternativeDeformations, handleClose}) => {
    const [imageName, setImageName] = useState("");

    const createObjectToSave = () => {
        //temporaryChartPoints
        const generatedChartPoints = [];
        for (let i = 1; i <= sigma.length; i++) {
            generatedChartPoints.push(i);
        }

        return {
            imageURL: initialImage,
            name: imageName,
            chartPoints: generatedChartPoints,
            sigmas: sigma,
            alternativeDeformations: alternativeDeformations
        }
    }

    return(
        <>
            <div>
            <label for = {"imgName"}>Enter image name: </label>
            <input type={"text"}
                   id={"imgName"}
                   onChange={(e) => setImageName(e.target.value)}
                    className={"input"}
            />
            </div>
            <div>
            <img src={initialImage} alt ="imgToSave" style={{with: '13vh', height: '60vh'}}/>
            </div>
            <div>
            <button
                className="button"
                onClick={() => {
                postData(createObjectToSave());
                handleClose();
            }} >Save</button>
            <button
                className="button"
                onClick={handleClose}>Cancel</button>
            </div>
        </>
    )
}

const postData = (objectToSave) => {
        fetch(RESULT_SAVE_URL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objectToSave)
    });
}

export default SaveImagePopupContent;
