package radek467.torisonPlastometerChartCalculator.processingImage.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ImageWithResultReadDTO;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ProcessingChartCalculationResult;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ProcessingChartCalculationData;
import radek467.torisonPlastometerChartCalculator.processingImage.service.ProcessImageService;
import radek467.torisonPlastometerChartCalculator.processingImage.service.ImageResultService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/app/processImage")
public class ProcessImageController {
    private final ProcessImageService processImageService;

    public ProcessImageController(ProcessImageService processImageService) {
        this.processImageService = processImageService;
    }

    @PostMapping(value = "")
    @CrossOrigin(origins = "*")
    ResponseEntity<String> doCalculations(@RequestBody ProcessingChartCalculationData calculationData) {
        processImageService.doChartCalculations(calculationData);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "")
    @CrossOrigin(origins = "*")
    ResponseEntity<ProcessingChartCalculationResult> getCalculationResults() {
        return ResponseEntity.ok(processImageService.getCalculationResults());
    }

    @GetMapping(value = "/export")
    @CrossOrigin(origins = "*")
    ResponseEntity<?> exportToCSV(HttpServletResponse servletResponse) throws IOException {
        servletResponse.setContentType("text/csv");
        processImageService.exportToCsv(servletResponse);
        return ResponseEntity.ok().build();
    }
}
