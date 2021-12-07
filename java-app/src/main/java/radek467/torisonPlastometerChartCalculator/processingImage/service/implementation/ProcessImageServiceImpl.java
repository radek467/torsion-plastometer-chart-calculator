package radek467.torisonPlastometerChartCalculator.processingImage.service.implementation;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;
import radek467.torisonPlastometerChartCalculator.languageCodes.ProcessedResultExportHeaders;
import radek467.torisonPlastometerChartCalculator.processingImage.ProcessChartCalculator;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ProcessingChartCalculationData;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ProcessingChartCalculationResult;
import radek467.torisonPlastometerChartCalculator.processingImage.service.ProcessImageService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.Writer;

@Service
class ProcessImageServiceImpl implements ProcessImageService {

    private final ProcessChartCalculator calculator;

    public ProcessImageServiceImpl() {
        calculator = new ProcessChartCalculator();
    }

    @Override
    public void doChartCalculations(ProcessingChartCalculationData calculationData) {
        calculator.setCalculationData(calculationData);
        calculator.doCalculations();
    }

    @Override
    public ProcessingChartCalculationResult getCalculationResults() {
        return calculator.getProcessedData();
    }

    @Override
    public void exportToCsv(HttpServletResponse response) throws IOException {
        Writer writer = response.getWriter();
        ProcessingChartCalculationResult result = calculator.getProcessedData();

        try (CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT)) {
            csvPrinter.printRecord(ProcessedResultExportHeaders.getNames());
            for (int i = 0; i < result.getSigmap().size(); i++) {
                csvPrinter.printRecord(result.getN().get(i), result.getSigmap().get(i), result.getAlternativeDeformations().get(i));
            }
        } catch (IOException e) {
            System.err.println("Error While writing CSV " + e);
        }
    }
}
