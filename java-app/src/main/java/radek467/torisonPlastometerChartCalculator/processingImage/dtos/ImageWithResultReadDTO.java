package radek467.torisonPlastometerChartCalculator.processingImage.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@Builder
public class ImageWithResultReadDTO {
    private String name;
    private String imageURL;
    private List<Double> chartPoints;
    private List<Double> sigmas;
    private List<Double> alternativeDeformations;

    public ImageWithResultWriteDTO createWriteDTO() {
        Decoder decoder = Base64.getDecoder();
        byte [] imageByteURL = decoder.decode(imageURL.split(",")[1]);
        return ImageWithResultWriteDTO.builder()
                .name(name)
                .imageData(imageByteURL)
                .chartPoints(chartPoints)
                .sigmas(sigmas)
                .alternativeDeformations(alternativeDeformations)
                .build();
    }
}
