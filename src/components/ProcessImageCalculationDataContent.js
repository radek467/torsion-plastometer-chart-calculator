import React from "react";
import DeviationResultTable from "./DeviationResultTable";

const ProcessImageCalculationDataContent = ({momentChartDeviations, strengthChartDeviations}) => {
    return (
        <>
            <div>
                {<DeviationResultTable momentChartDeviations={momentChartDeviations}
                                       strengthChartDeviations={strengthChartDeviations}/>}
            </div>

            <button>Oblicz</button>
            <button>Anuluj</button>
        </>
    )
}

export default ProcessImageCalculationDataContent