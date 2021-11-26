package radek467.torisonPlastometerChartCalculator.processingImage;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ProcessChartDataReadDTO;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ProcessChartDataWriteDTO;

@Controller
@RequestMapping("/app/processImage")
public class ProcessImageController {
    private final ProcessChartCalculator processChartCalculator;

    public ProcessImageController(ProcessChartCalculator processChartCalculator) {
        this.processChartCalculator = processChartCalculator;
    }

    @PostMapping(value = "")
    @CrossOrigin(origins = "*")
    ResponseEntity<String> setCalculationData(@RequestBody ProcessChartDataWriteDTO model) {
        processChartCalculator.setCalculationData(model);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "")
    @CrossOrigin(origins = "*")
    ResponseEntity<ProcessChartDataReadDTO> getCalculationResults(){
        processChartCalculator.doCalculations();
        return ResponseEntity.ok(processChartCalculator.getProcessedData());
    }



}
