package radek467.torisonPlastometerChartCalculator.languageCodes;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum ProcessedResultExportHeaders {
    POINT("L.P"),
    SIGMA("Sigma"),
    RANDOM("Alternative deformation");

    private String name;
    private int columnOrder;

    ProcessedResultExportHeaders(String name) {
        this.name = name;
        this.columnOrder = columnOrder;
    }

    public String getName() {
        return name;
    }

    public static List<String> getNames() {
        return Arrays.stream(values())
                .map(ProcessedResultExportHeaders::getName)
                .collect(Collectors.toList());
    }
}

