package radek467.torisonPlastometerChartCalculator.processingImage;

import org.springframework.stereotype.Service;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ProcessChartDataReadDTO;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ProcessChartDataWriteDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProcessChartCalculator {
    private ProcessChartDataModel calculatedImage;
    private ImageRepository imageRepository;
    private ResultRepository resultRepository;

    public ProcessChartCalculator( ImageRepository imageRepository, ResultRepository resultRepository) {
        this.imageRepository = imageRepository;
        this.resultRepository = resultRepository;
    }

    public void setCalculationData(ProcessChartDataWriteDTO model) {
        calculatedImage = model.createWriteModel();
    }

    public void doCalculations() {
        List<Double> momentsInNm = calculateDeviationsToNm(calculatedImage.getMomentChartDeviations(), calculatedImage.getMomentParameter());
        List<Double> strengthsInNm = calculateDeviationsToNm(calculatedImage.getStrengthChartDeviations(), calculatedImage.getStrengthParameter());
        calculatedImage.setRandomValueFromFColumn(calculateRandomValueFromFColumn());
        calculatedImage.setRandomValueFromGColumn(calculateRandomValueFromGColumn());
        List<Double> sigmaResults = calculateSigma(momentsInNm, strengthsInNm);
        calculatedImage.setSigmap(sigmaResults);
    }

    private List<Double> calculateDeviationsToNm(List<Double> chartDeviationsInMm, double parameter) {
        return chartDeviationsInMm
                .stream()
                .map(value -> value * parameter)
                .collect(Collectors.toList());
    }

    private List<Double> calculateRandomValueFromFColumn() {
        calculatedImage.setRandomValueFromFColumn(List.of(0.5, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0));
        return calculatedImage.getRandomValueFromFColumn()
                .stream()
                .map(value -> value * calculatedImage.getDeformation())
                .collect(Collectors.toList());
    }

    private List<Double> calculateRandomValueFromGColumn() {
        double subtrahend = calculatedImage.getRandomValueFromFColumn().get(0);
        return calculatedImage.getRandomValueFromFColumn()
                .stream()
                .map(value -> value - subtrahend)
                .collect(Collectors.toList());
    }

    private List<Double> calculateSigma(List<Double> momentsInMm, List<Double> strengthsInMm) {
        List<Double> sigmaResults = new ArrayList<>();
        for(int i = 0; i < momentsInMm.size(); i++) {
            double moment = momentsInMm.get(i);
            double strength = strengthsInMm.get(i);
            double result = (1 / (9 * 3.14)) * Math.sqrt(Math.pow(strength, 2) + 75 * 10000 * Math.pow(moment, 2));
            sigmaResults.add(result);
        }
        return sigmaResults;
    }

    public void saveProcessedData() {
        Image image = new Image();
        Image savedImage = imageRepository.save(image);
        ProcessChartDataReadDTO processedData = getProcessedData();
        List<Result> savedResults = new ArrayList<>();
        for(int i = 0; i < processedData.getSigmap().size(); i++) {
            savedResults.add(resultRepository.save(new Result(i, processedData.getSigmap().get(i), processedData.getRandomValue().get(i), savedImage)));
        }
    }

    public ProcessChartDataReadDTO getProcessedData() {
        ProcessChartDataReadDTO processedData = new ProcessChartDataReadDTO(calculatedImage);
        if(isCalculatedDataEmpty(processedData)){
            throw new IllegalStateException("Calculation went wrong");
        }
        return processedData;
    }

    private boolean isCalculatedDataEmpty(ProcessChartDataReadDTO processedData) {
        return processedData.getRandomValue().isEmpty() || processedData.getSigmap().isEmpty();
    }
}
