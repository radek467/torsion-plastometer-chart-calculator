package radek467.torisonPlastometerChartCalculator.processingImage.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import radek467.torisonPlastometerChartCalculator.processingImage.Image;
import radek467.torisonPlastometerChartCalculator.processingImage.Result;

import javax.persistence.Lob;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@Builder
public class ImageWithResultReadDTO {
    private String name;
    private String imageData;
    private List<Double> chartPoints;
    private List<Double> sigmas;
    private List<Double> gColumns;

    public ImageWithResultWriteDTO createWriteDTO() {
        Decoder decoder = Base64.getDecoder();
        byte [] imageByteData = decoder.decode(imageData.split(",")[1]);
        return ImageWithResultWriteDTO.builder()
                .name(name)
                .imageData(imageByteData)
                .chartPoints(chartPoints)
                .sigmas(sigmas)
                .gColumns(gColumns)
                .build();
    }

//    public Image createImageToSave() {
//        return Image.builder()
//                .name(name)
////                .imageData(imageData)
//                .build();
//    }

//    public List<Result> createResultsFromArrays(Image image) {
//        List<Result> results = new ArrayList<>();
//        for(int i = 0; i < chartPoints.length; i++){
//            Result result = Result.builder()
//                    .chartPoint(chartPoints[i])
//                    .sigma(sigmas[i])
//                    .gColumn(gColumns[i])
//                    .image(image)
//                    .build();
//            results.add(result);
//        }
//        return results;
//    }
}
