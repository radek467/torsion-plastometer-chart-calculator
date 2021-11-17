package radek467.torisonPlastometerChartCalculator.processingImage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.List;

@Setter
@AllArgsConstructor
@Builder
public class ProcessImageDataWriteDTO {

    private List<Double> momentChartDeviations;
    private List<Double> strengthChartDeviations;
    private int momentBridge;
    private int strengthBridge;
    private double strengthParameter;
    private double momentParameter;
    private double deformation;

    public ProcessImageDataModel createWriteModel() {
        return ProcessImageDataModel.builder()
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
