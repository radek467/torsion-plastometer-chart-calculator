import React, {useState} from 'react';
import DeviationResultTable from "./DeviationResultTable";

import '../styles/calculationDataContent.css'
import '../styles/mainStyles.css'

const RESULT_URL = "http://localhost:8080//app/processImage"


const ProcessImageCalculationDataContent = ({momentChartDeviations, strengthChartDeviations, setSigma, setAlternativeDeformations, togglePopup}) => {
    const [momentBridge, setMomentBridge] = useState(1);
    const [strengthBridge, setStrengthBridge] = useState(1);
    const [momentParameter, setMomentParameter] = useState(0);
    const [strengthParameter, setStrengthParameter] = useState(0);
    const [deformation, setDeformation] = useState(0.218);

    return (

        <>
            <div style={{width: "100%"}}>
                <div style={{float: "left"}}>
                    {<DeviationResultTable momentChartDeviations={momentChartDeviations}
                                           strengthChartDeviations={strengthChartDeviations}/>}
                </div>
                <div className="dataContent-calculationParameters clearfix">
                    {createBridgeComboBox("momentBridge", "Wzbudzenie mostka momentu: ", setMomentBridge)}
                    {createBridgeComboBox("strengthBridge", "Wzbudzenie mostka siły: ", setStrengthBridge)}


                    {createParameterTextField("momentParameter", "Parametr momentu: ", setMomentParameter)}
                    {createParameterTextField("strengthParameter", "Parametr siły: ", setStrengthParameter)}
                    {createParameterTextFieldWithInitialValue("deformation", "Odkształcenie: ", deformation, setDeformation)}

                </div>
            </div>

            <div className="confirmButtons">
                <button
                    className="button"
                    // onClick={() => console.log("moment chart deviations: " + momentChartDeviations + " strength chart deviations: " + strengthChartDeviations)}>
                    onClick={
                        async () => {
                            await sendDataToCalculate({
                                momentChartDeviations,
                                strengthChartDeviations,
                                momentBridge,
                                strengthBridge,
                                momentParameter,
                                strengthParameter,
                                deformation
                            })
                            await getResult(setSigma, setAlternativeDeformations);
                            togglePopup();
                        }}>
                    Oblicz
                </button>
                <button
                    className="button"
                    onClick={togglePopup}>
                    Anuluj
                </button>
            </div>
        </>
    )
}

const createBridgeComboBox = (id, title, selectFunction) => {
    return (
        <div className="calculationParameter">
            {/*todo will be better if values will be deliver from backend*/}
            <label className="calculationParameters-inputLabel" htmlFor={id}>{title}</label>
            <select className="calculationParameters-oneInput" name={id} id={id}
                    onChange={(e) => selectFunction(parseInt(e.target.value))}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="10">10</option>
            </select>
        </div>
    )
}

const createParameterTextField = (id, title, setValue) => {
    return (
        <div className="calculationParameter">
            <label className="calculationParameters-inputLabel" htmlFor={id}>{title}</label>
            <input className="calculationParameters-oneInput" id={id} type="number" step="0.1" min={0}
                   onChange={e => setValue(e.target.value)}/>
        </div>
    )
}

const createParameterTextFieldWithInitialValue = (id, title, value, setValue) => {
    return (
        <div className="calculationParameter">
            <label className="calculationParameters-inputLabel" htmlFor={id}>{title}</label>
            <input defaultValue={value} className="calculationParameters-oneInput" id={id} type="number" step="0.1"
                   min={0}
                   onChange={e => setValue(e.target.value)}/>
        </div>
    )
}

const sendDataToCalculate = (objectToSend) =>
    fetch(RESULT_URL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objectToSend)
    });


const getResult = (setSigma, setAlternativeDeformations) => {
    fetch(RESULT_URL)
        .then(response => response.json())
        .then(data => {
            setSigma(data.sigmap);
            setAlternativeDeformations(data.alternativeDeformations)
        })
}


export default ProcessImageCalculationDataContent