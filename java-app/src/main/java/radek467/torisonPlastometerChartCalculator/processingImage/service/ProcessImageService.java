package radek467.torisonPlastometerChartCalculator.processingImage.service;

import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ImageWithResultReadDTO;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ImageWithResultWriteDTO;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ProcessingChartCalculationData;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ProcessingChartCalculationResult;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public interface ProcessImageService {
    void doChartCalculations(ProcessingChartCalculationData calculationData);

    ProcessingChartCalculationResult getCalculationResults();

    void exportToCsv(HttpServletResponse response) throws IOException;
}
