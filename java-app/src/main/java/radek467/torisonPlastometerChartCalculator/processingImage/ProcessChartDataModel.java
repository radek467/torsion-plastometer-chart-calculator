package radek467.torisonPlastometerChartCalculator.processingImage;

import lombok.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
//@Component
public class ProcessChartDataModel {
//    private double [] momentChartDeviations;
//    private double [] strengthChartDeviations;
//    private double [] sigmap;
//    //todo has to be renamed
//    private double [] randomValue;
    private List<Double> momentChartDeviations;
    private List<Double> strengthChartDeviations;
    private List<Double> sigmap;
    //todo has to be renamed
    private List<Double> randomValueFromFColumn;
    private List<Double> randomValueFromGColumn;
    private int momentBridge;
    private int strengthBridge;
    private double strengthParameter;
    private double momentParameter;
    private double deformation;

}
