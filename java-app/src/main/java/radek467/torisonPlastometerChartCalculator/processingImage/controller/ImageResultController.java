package radek467.torisonPlastometerChartCalculator.processingImage.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ImageWithResultReadDTO;
import radek467.torisonPlastometerChartCalculator.processingImage.service.ImageResultService;

import java.util.List;

@Controller
@RequestMapping("/app/results")
public class ImageResultController {
    private final ImageResultService imageResultService;

    public ImageResultController(ImageResultService imageResultService) {
        this.imageResultService = imageResultService;
    }

    @PostMapping(value = "/save")
    @CrossOrigin(origins = "*")
    ResponseEntity<?> saveImage(@RequestBody ImageWithResultReadDTO model) {
        imageResultService.saveImageWithResults(model.createWriteDTO());
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "")
    @CrossOrigin(origins = "*")
    ResponseEntity<List<ImageWithResultReadDTO>> getImages() {
        List<ImageWithResultReadDTO> result = imageResultService.getImagesWithResults();
        return ResponseEntity.ok(result);
    }
}
