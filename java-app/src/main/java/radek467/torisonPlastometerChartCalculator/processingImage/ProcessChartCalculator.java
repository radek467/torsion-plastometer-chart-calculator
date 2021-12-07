package radek467.torisonPlastometerChartCalculator.processingImage;

import lombok.NoArgsConstructor;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ProcessingChartCalculationData;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ProcessingChartCalculationResult;
import radek467.torisonPlastometerChartCalculator.processingImage.model.ProcessChartCalculationDataModel;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@NoArgsConstructor
public class ProcessChartCalculator {
    private ProcessChartCalculationDataModel calculationDataModel;

    public void setCalculationData(ProcessingChartCalculationData model) {
        calculationDataModel = model.createWriteModel();
    }

    public void doCalculations() {
        List<Double> momentsInNm = calculateDeviationsToNm(calculationDataModel.getMomentChartDeviations(), calculationDataModel.getMomentParameter());
        List<Double> strengthsInNm = calculateDeviationsToNm(calculationDataModel.getStrengthChartDeviations(), calculationDataModel.getStrengthParameter());
        calculationDataModel.setDeformationForEachChartPoint(calculateRandomValueFromFColumn());
        calculationDataModel.setAlternativeDeformation(calculateRandomValueFromGColumn());
        List<Double> sigmaResults = calculateSigma(momentsInNm, strengthsInNm);
        calculationDataModel.setSigmap(sigmaResults);
    }

    private List<Double> calculateDeviationsToNm(List<Double> chartDeviationsInMm, double parameter) {
        return chartDeviationsInMm
                .stream()
                .map(value -> value * parameter)
                .collect(Collectors.toList());
    }

    private List<Double> calculateRandomValueFromFColumn() {
        List<Double> list = generateN();
        return list
                .stream()
                .map(value -> value * calculationDataModel.getDeformation())
                .collect(Collectors.toList());
    }

    private List<Double> calculateRandomValueFromGColumn() {
        double subtrahend = calculationDataModel.getDeformationForEachChartPoint().get(0);
        return calculationDataModel.getDeformationForEachChartPoint()
                .stream()
                .map(value -> value - subtrahend)
                .collect(Collectors.toList());
    }

    private List<Double> calculateSigma(List<Double> momentsInMm, List<Double> strengthsInMm) {
        List<Double> sigmaResults = new ArrayList<>();
        for (int i = 0; i < momentsInMm.size(); i++) {
            double moment = momentsInMm.get(i);
            double strength = strengthsInMm.get(i);
            double result = (1 / (9 * 3.14)) * Math.sqrt(Math.pow(strength, 2) + 75 * 10000 * Math.pow(moment, 2));
            sigmaResults.add(result);
        }
        return sigmaResults;
    }

    public ProcessingChartCalculationResult getProcessedData() {
        ProcessingChartCalculationResult processedData = new ProcessingChartCalculationResult(calculationDataModel);
        if (isCalculatedDataEmpty(processedData)) {
            throw new IllegalStateException("Calculation went wrong");
        }
        return processedData;
    }

    private boolean isCalculatedDataEmpty(ProcessingChartCalculationResult processedData) {
        return processedData.getAlternativeDeformations().isEmpty() || processedData.getSigmap().isEmpty();
    }

    private List<Double> generateN() {
        List<Double> list = new ArrayList<>();
        list.add(0.5);
        for (int i = 1; i < calculationDataModel.getMomentChartDeviations().size(); i++) {
            list.add((double) i);
        }
        calculationDataModel.setN(list);
        return list;
    }
}
