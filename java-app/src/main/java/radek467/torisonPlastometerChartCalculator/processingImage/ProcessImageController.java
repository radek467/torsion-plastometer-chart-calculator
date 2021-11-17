package radek467.torisonPlastometerChartCalculator.processingImage;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@Controller
@RequestMapping("/app/processImage")
public class ProcessImageController {
    private final ProcessImageService processImageService;

    public ProcessImageController(ProcessImageService processImageService) {
        this.processImageService = processImageService;
    }

    @PostMapping(value = "")
    @CrossOrigin(origins = "*")
    ResponseEntity<String> setCalculationData(@RequestBody ProcessImageDataWriteDTO model) {
        processImageService.setCalculationData(model);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "")
    @CrossOrigin(origins = "*")
    ResponseEntity<ProcessImageDataReadDTO> getCalculationResults(){
        processImageService.doCalculations();
        return ResponseEntity.ok(processImageService.getProcessedData());
    }



}
