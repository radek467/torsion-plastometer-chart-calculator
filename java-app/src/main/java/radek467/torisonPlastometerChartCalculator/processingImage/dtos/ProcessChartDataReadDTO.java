package radek467.torisonPlastometerChartCalculator.processingImage.dtos;

import lombok.Getter;
import lombok.Setter;
import radek467.torisonPlastometerChartCalculator.processingImage.ProcessChartDataModel;

import java.util.List;

@Getter
@Setter
public class ProcessChartDataReadDTO {
    private List<Double> sigmap;
    //todo has to be renamed
    private List<Double> randomValue;

    public ProcessChartDataReadDTO(ProcessChartDataModel processChartDataModel) {
        this.sigmap = processChartDataModel.getSigmap();
        this.randomValue = processChartDataModel.getRandomValueFromGColumn();
    }
}
