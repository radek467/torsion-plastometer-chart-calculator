package radek467.torisonPlastometerChartCalculator.processingImage;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProcessImageDataReadDTO {
    private List<Double> sigmap;
    //todo has to be renamed
    private List<Double> randomValue;

    public ProcessImageDataReadDTO(ProcessImageDataModel processImageDataModel) {
        this.sigmap = processImageDataModel.getSigmap();
        this.randomValue = processImageDataModel.getRandomValueFromGColumn();
    }
}
