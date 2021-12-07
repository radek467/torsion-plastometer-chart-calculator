package radek467.torisonPlastometerChartCalculator.processingImage.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import radek467.torisonPlastometerChartCalculator.processingImage.model.ProcessChartCalculationDataModel;

import java.util.List;

@AllArgsConstructor
@Builder
public class ProcessingChartCalculationData {

    private List<Double> momentChartDeviations;
    private List<Double> strengthChartDeviations;
    private int momentBridge;
    private int strengthBridge;
    private double strengthParameter;
    private double momentParameter;
    private double deformation;

    public ProcessChartCalculationDataModel createWriteModel() {
        return ProcessChartCalculationDataModel.builder()
                .deformation(deformation)
                .momentBridge(momentBridge)
                .momentParameter(momentParameter)
                .momentChartDeviations(momentChartDeviations)
                .strengthBridge(strengthBridge)
                .strengthParameter(strengthParameter)
                .strengthChartDeviations(strengthChartDeviations)
                .build();
    }
}
