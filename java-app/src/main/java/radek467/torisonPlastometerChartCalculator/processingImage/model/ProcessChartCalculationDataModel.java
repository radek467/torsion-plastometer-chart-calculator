package radek467.torisonPlastometerChartCalculator.processingImage.model;

import lombok.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessChartCalculationDataModel {
    private List<Double> momentChartDeviations;
    private List<Double> strengthChartDeviations;
    private List<Double> sigmap;
    private List<Double> deformationForEachChartPoint;
    private List<Double> alternativeDeformation;
    private int momentBridge;
    private int strengthBridge;
    private double strengthParameter;
    private double momentParameter;
    private double deformation;

}
