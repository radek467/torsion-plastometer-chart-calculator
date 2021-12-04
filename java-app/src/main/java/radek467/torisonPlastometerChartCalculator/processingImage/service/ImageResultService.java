package radek467.torisonPlastometerChartCalculator.processingImage.service;

import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ImageWithResultReadDTO;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ImageWithResultWriteDTO;

import java.util.List;

public interface ImageResultService {

    List<ImageWithResultReadDTO> getImagesWithResults();

    void saveImageWithResults(ImageWithResultWriteDTO imageWithResultWriteDTO);
}
