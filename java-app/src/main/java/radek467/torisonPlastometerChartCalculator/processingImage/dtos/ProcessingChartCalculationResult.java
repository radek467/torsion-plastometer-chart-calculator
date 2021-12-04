package radek467.torisonPlastometerChartCalculator.processingImage.dtos;

import lombok.Getter;
import lombok.Setter;
import radek467.torisonPlastometerChartCalculator.processingImage.model.ProcessChartCalculationDataModel;

import java.util.List;

@Getter
@Setter
public class ProcessingChartCalculationResult {
    private List<Double> sigmap;
    private List<Double> alternativeDeformations;

    public ProcessingChartCalculationResult(ProcessChartCalculationDataModel processChartCalculationDataModel) {
        this.sigmap = processChartCalculationDataModel.getSigmap();
        this.alternativeDeformations = processChartCalculationDataModel.getAlternativeDeformation();
    }
}
