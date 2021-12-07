package radek467.torisonPlastometerChartCalculator.processingImage.model;

import lombok.*;

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
    private List<Double> n;
    private int momentBridge;
    private int strengthBridge;
    private double strengthParameter;
    private double momentParameter;
    private double deformation;

}
