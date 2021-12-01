package radek467.torisonPlastometerChartCalculator.processingImage;

import com.zaxxer.hikari.pool.HikariProxyResultSet;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;
import radek467.torisonPlastometerChartCalculator.processingImage.Result;
import radek467.torisonPlastometerChartCalculator.processingImage.ResultRepository;
import radek467.torisonPlastometerChartCalculator.processingImage.dtos.ProcessChartDataReadDTO;

import javax.servlet.http.HttpServletResponse;
import javax.swing.text.Document;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.sql.ResultSet;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExportService {

    private final ResultRepository resultRepository;

    public ExportService(ResultRepository resultRepository) {
        this.resultRepository = resultRepository;
    }

    public void setResponseHeader(HttpServletResponse response, String contentType, String extension, String prefix) {
            DateFormat dateFormat = new SimpleDateFormat("yyy-MM-dd_HH-mm-ss");
            String timeStamp = dateFormat.format(new Date());
            String fileName = prefix + timeStamp + extension;

            response.setContentType(contentType);

            String headerKey = "Content disposition";
            String headerValue = "attachment; filename=" + fileName;
            response.setHeader(headerKey, headerValue);
    }

    public void exportToCsv(ProcessChartDataReadDTO readDTO, HttpServletResponse response) throws IOException {
        Writer writer = response.getWriter();

        Iterable<Result> results = resultRepository.findAll();

        try(CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT)) {
            csvPrinter.printRecord(ExportHeaders.getNames());
            for(Result result : results) {
                csvPrinter.printRecord(result.getChartPoint(), result.getSigma(), result.getGColumn());
            }
        } catch (IOException e) {
            System.err.println("Error While writing CSV " + e);
        }
    }


    private static enum ExportHeaders {
        POINT("L.P"),
        SIGMA("Sigma"),
        RANDOM("Rand");

        private String name;
        private int columnOrder;

        ExportHeaders(String name) {
            this.name = name;
            this.columnOrder = columnOrder;
        }

        public String getName() {
            return name;
        }

        public static List<String> getNames() {
            return Arrays.stream(values())
                    .map(ExportHeaders::getName)
                    .collect(Collectors.toList());
        }
    }
}
