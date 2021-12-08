import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";
import {isArrayEmpty} from "../alghoritms/utils/collectionUtils";



export default function ResultChart({data}) {
    if(isArrayEmpty(data.sigma) || isArrayEmpty(data.alternativeDeformations)) {
        return;
    }
    return (
        <LineChart
            width={600}
            height={400}
            data={processDataToChart(data)}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
            }}
        >
            <XAxis
                dataKey="name"
                   type = "number"
                   ticks = {getXAxisTicks(data.alternativeDeformations)}
                   domain={[0, getUpperLimitOfXAxis(data.alternativeDeformations)]}
            />
            <YAxis
                type = "number"
                ticks = {getYAxisTicks(data.sigma)}
                domain={[0, getUpperLimitOfYAxis(data.sigma)]}
                />
            <Tooltip />
            <Line
                type="monotone"
                dataKey="sigma"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
            />
        </LineChart>
    );
}

const getUpperLimitOfYAxis = (sigma) => {
    let upperLimitOfChart;
    const maxChartValue = Math.ceil(Math.max(...sigma));
    for(let i = maxChartValue; i <= maxChartValue + 10; i++) {
       if(i % 10 === 0) {
           upperLimitOfChart = i;
           break;
       }
    }
    return upperLimitOfChart;
}

const getYAxisTicks = (sigma) => {
    const upperYLimit = getUpperLimitOfYAxis(sigma);
    const ticks = [];
    for(let i = 0; i <= upperYLimit; i = i + 10) {
        ticks.push(i)
    }
    return ticks;
}

const getXAxisTicks = (alternativeDeformations) => {
    const ticks = [];
    const roundedMaxValue = (Math.max(...alternativeDeformations) * 100) / 100;
    for(let i = 0; i <= roundedMaxValue + 0.2; i = i + 0.2) {
        ticks.push(Math.round(i * 100) / 100);
    }
    return ticks;
}

const getUpperLimitOfXAxis = (alternativeDeformations) => {
    return Math.max(getXAxisTicks(alternativeDeformations))
}

const processDataToChart = (data) => {
    const processingData = [];
    for(let i = 0; i < data.sigma.length; i++) {
        const obj = {
            name: data.alternativeDeformations[i],
            sigma: data.sigma[i]
        }
        processingData.push(obj);
    }
    return processingData;
}
