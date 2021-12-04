package radek467.torisonPlastometerChartCalculator.processingImage.service.implementation;

import org.springframework.stereotype.Service;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ImageWithResultReadDTO;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ImageWithResultWriteDTO;
import radek467.torisonPlastometerChartCalculator.processingImage.model.Image;
import radek467.torisonPlastometerChartCalculator.processingImage.model.Result;
import radek467.torisonPlastometerChartCalculator.processingImage.repository.ImageRepository;
import radek467.torisonPlastometerChartCalculator.processingImage.repository.ResultRepository;
import radek467.torisonPlastometerChartCalculator.processingImage.service.ImageResultService;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
class ImageResultServiceImpl implements ImageResultService {
    private final ImageRepository imageRepository;
    private final ResultRepository resultRepository;

    public ImageResultServiceImpl(ImageRepository imageRepository, ResultRepository resultRepository) {
        this.imageRepository = imageRepository;
        this.resultRepository = resultRepository;
    }

    @Override
    public void saveImageWithResults(ImageWithResultWriteDTO imageWithResultWriteDTO) {
        Image image = imageWithResultWriteDTO.createImageToSave();
        Image savedImage = imageRepository.save(image);

        List<Result> resultsFromArrays = imageWithResultWriteDTO.createResultsFromArrays(savedImage);
        resultRepository.saveAll(resultsFromArrays);
    }

    @Override
    public List<ImageWithResultReadDTO> getImagesWithResults() {
        List<Image> images = imageRepository.findAll().stream().filter(image -> image.getImageData() != null).collect(Collectors.toList());
        Iterable<Result> resultsToImages = findResultsToImages(images);
        return images
                .stream()
                .map(image -> createImageWithResultReadDtoForImage(image, resultsToImages))
                .collect(Collectors.toList());
    }

    private Iterable<Result> findResultsToImages(List<Image> images) {
        return resultRepository.findAll();
    }

    private ImageWithResultReadDTO createImageWithResultReadDtoForImage(Image image, Iterable<Result> results) {
        List<Result> imageResults = StreamSupport
                .stream(results.spliterator(), false)
                .filter(result -> result.getImage().getId().equals(image.getId()))
                .collect(Collectors.toList());
        return ImageWithResultReadDTO
                .builder()
                .imageURL(encodeBytesImageArray(image.getImageData()))
                .name(image.getName())
                .chartPoints(getChartPointsForImage(imageResults))
                .sigmas(getSigmasForImage(imageResults))
                .alternativeDeformations(getGColumnsForImage(imageResults))
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
                .map(Result::getAlternativeDeformations)
                .collect(Collectors.toList());
    }

    String encodeBytesImageArray(byte[] imageBytes) {
        Base64.Encoder encoder = Base64.getEncoder();
        String imageInString = encoder.encodeToString(imageBytes);
        imageInString = "data:image/png;base64," + imageInString;
        return imageInString;
    }

}
