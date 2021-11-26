package radek467.torisonPlastometerChartCalculator.processingImage.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Setter;
import radek467.torisonPlastometerChartCalculator.processingImage.ProcessChartDataModel;

import java.util.List;

@Setter
@AllArgsConstructor
@Builder
public class ProcessChartDataWriteDTO {

    private List<Double> momentChartDeviations;
    private List<Double> strengthChartDeviations;
    private int momentBridge;
    private int strengthBridge;
    private double strengthParameter;
    private double momentParameter;
    private double deformation;

    public ProcessChartDataModel createWriteModel() {
        return ProcessChartDataModel.builder()
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
