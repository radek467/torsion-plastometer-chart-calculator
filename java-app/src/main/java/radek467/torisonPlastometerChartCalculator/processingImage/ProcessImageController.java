package radek467.torisonPlastometerChartCalculator.processingImage;

import com.google.gson.Gson;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ImageWithResultReadDTO;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ProcessChartDataReadDTO;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ProcessChartDataWriteDTO;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/app/processImage")
public class ProcessImageController {
    private final ProcessChartCalculator processChartCalculator;
    private final ExportService exportService;
    private final ProcessImageService processImageService;


    public ProcessImageController(ProcessChartCalculator processChartCalculator, ExportService exportService, ProcessImageService processImageService) {
        this.processChartCalculator = processChartCalculator;
        this.exportService = exportService;
        this.processImageService = processImageService;
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
        processChartCalculator.saveProcessedData();
        return ResponseEntity.ok(processChartCalculator.getProcessedData());
    }

    @GetMapping(value = "/export")
    @CrossOrigin(origins = "*")
    ResponseEntity<InputStreamResource> exportToCSV() throws IOException {


        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/save")
    @CrossOrigin(origins = "*")
    ResponseEntity<?> saveImage(@RequestBody ImageWithResultReadDTO model) {
        processImageService.saveImageWithResults(model.createWriteDTO());
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/getImage")
    @CrossOrigin(origins = "*")
    ResponseEntity<List<ImageWithResultReadDTO>> getImages() {
        List<ImageWithResultReadDTO> result = processImageService.getImagesWithResults();
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/fakeExport")
    @CrossOrigin(origins = "*")
    void getAllEmployeesInCsv(HttpServletResponse servletResponse) throws IOException {
        servletResponse.setContentType("text/csv");
//        servletResponse.addHeader("Content-Disposition","attachment; filename=\"result.csv\"");
        exportService.exportToCsv(processChartCalculator.getProcessedData(), servletResponse);
    }

    private ProcessChartDataReadDTO createFakeReadDto() {
        List<Double> s = List.of(2D, 5D, 7D, 10D);
        List<Double> r = List.of(4D, 6D, 8D, 10D);
        ProcessChartDataModel model = ProcessChartDataModel.builder().sigmap(s).randomValueFromGColumn(r).build();
        return new ProcessChartDataReadDTO(model);
    }

}
