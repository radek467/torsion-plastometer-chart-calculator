package radek467.torisonPlastometerChartCalculator.processingImage.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import radek467.torisonPlastometerChartCalculator.processingImage.Image;
import radek467.torisonPlastometerChartCalculator.processingImage.Result;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@Builder
public class ImageWithResultWriteDTO {
    private String name;
    private byte [] imageData;
    private List<Double> chartPoints;
    private List<Double> sigmas;
    private List<Double> gColumns;

    public Image createImageToSave() {
        return Image.builder()
                .name(name)
                .imageData(imageData)
                .build();
    }

    public List<Result> createResultsFromArrays(Image image) {
        List<Result> results = new ArrayList<>();
        for(int i = 0; i < chartPoints.size(); i++){
            Result result = Result.builder()
                    .chartPoint(chartPoints.get(i))
                    .sigma(sigmas.get(i))
                    .gColumn(gColumns.get(i))
                    .image(image)
                    .build();
            results.add(result);
        }
        return results;
    }

}
