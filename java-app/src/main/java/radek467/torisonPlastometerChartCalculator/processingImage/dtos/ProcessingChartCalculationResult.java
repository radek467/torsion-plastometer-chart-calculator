package radek467.torisonPlastometerChartCalculator.processingImage.dtos;

import lombok.Getter;
import radek467.torisonPlastometerChartCalculator.processingImage.model.ProcessChartCalculationDataModel;

import java.util.List;

@Getter
public class ProcessingChartCalculationResult {
    private final List<Double> sigmap;
    private final List<Double> alternativeDeformations;
    private final List<Double> n;

    public ProcessingChartCalculationResult(ProcessChartCalculationDataModel processChartCalculationDataModel) {
        this.sigmap = processChartCalculationDataModel.getSigmap();
        this.alternativeDeformations = processChartCalculationDataModel.getAlternativeDeformation();
        this.n = processChartCalculationDataModel.getN();
    }
}
