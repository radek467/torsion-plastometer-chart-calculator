package radek467.torisonPlastometerChartCalculator.processingImage;

import org.springframework.stereotype.Service;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ImageWithResultReadDTO;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ImageWithResultWriteDTO;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class ProcessImageService {
    private final ImageRepository imageRepository;
    private final ResultRepository resultRepository;

    public ProcessImageService(ImageRepository imageRepository, ResultRepository resultRepository) {
        this.imageRepository = imageRepository;
        this.resultRepository = resultRepository;
    }

    List<ImageWithResultReadDTO> getImagesWithResults() {
        List<Image> images = imageRepository.findAll();
        Iterable<Result> resultsToImages = findResultsToImages(images);
        return images
                .stream()
                .map(image -> createImageWithResultReadDtoForImage(image, resultsToImages))
                .collect(Collectors.toList());
    }

    private Iterable<Result> findResultsToImages(List<Image> images) {
//        List<Long> imagesIds = images
//                .stream()
//                .map(Image::getId)
//                .collect(Collectors.toList());
        return resultRepository.findAll();
    }

    private ImageWithResultReadDTO createImageWithResultReadDtoForImage(Image image, Iterable<Result> results) {
        List<Result> imageResults = StreamSupport
                .stream(results.spliterator(), false)
                .filter(result -> result.getImage().getId().equals(image.getId()))
                .collect(Collectors.toList());
        return ImageWithResultReadDTO
                .builder()
                .imageData(encodeBytesImageArray(image.getImageData()))
                .name(image.getName())
                .chartPoints(getChartPointsForImage(imageResults))
                .sigmas(getSigmasForImage(imageResults))
                .gColumns(getGColumnsForImage(imageResults))
                .build();
    }

    private List<Double> getChartPointsForImage(List<Result> imageResults) {
        return imageResults
                .stream()
                .map(Result::getChartPoint)
                .collect(Collectors.toList());
    }

    private List<Double> getSigmasForImage(List<Result> imageResults) {
        return imageResults
                .stream()
                .map(Result::getSigma)
                .collect(Collectors.toList());
    }

    private List<Double> getGColumnsForImage(List<Result> imageResults) {
        return imageResults
                .stream()
                .map(Result::getGColumn)
                .collect(Collectors.toList());
    }

    String encodeBytesImageArray(byte [] imageBytes) {
        Base64.Encoder encoder = Base64.getEncoder();
        String imageInString = encoder.encodeToString(imageBytes);
        imageInString = "data:image/png;base64," + imageInString;
        return imageInString;
    }

//    String getImages() {
//        byte[] bytes = imageRepository.findAll().stream().map(Image::getImageData).findFirst().orElseThrow();
//        Base64.Encoder encoder = Base64.getEncoder();
//        String str = encoder.encodeToString(bytes);
//        str = "data:image/png;base64," + str;
//        return str;
//    }

    void saveImageWithResults(ImageWithResultWriteDTO imageWithResultWriteDTO) {
        Image image = imageWithResultWriteDTO.createImageToSave();
        Image savedImage = imageRepository.save(image);

        List<Result> savedResults = new ArrayList<>();
            List<Result> resultsFromArrays = imageWithResultWriteDTO.createResultsFromArrays(savedImage);
            resultRepository.saveAll(resultsFromArrays);

    }
}
