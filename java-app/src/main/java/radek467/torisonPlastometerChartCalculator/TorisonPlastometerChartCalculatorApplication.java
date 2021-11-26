package radek467.torisonPlastometerChartCalculator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TorisonPlastometerChartCalculatorApplication {

	public static void main(String[] args) {
		SpringApplication.run(TorisonPlastometerChartCalculatorApplication.class, args);

//		List<Double> momentChartDeviations = List.of(10.365, 12.514, 15.169, 15.674, 15.379, 14.621, 13.904, 13.525, 13.549, 13.295, 13.125, 5.250, 0.254);
//		List<Double> strengthChartDeviations = List.of(0.084, 0.126, 0.379, 1.138, 1.601, 1.096, 0.548, 2.781, 4.488, 6.605, 8.807, 10.331, 0.508);
//		int momentBridge = 1;
//		int strengthBridge = 2;
//		double strengthParameter = 12.5;
//		double momentParameter = 0.172;
//		double deformation = 0.218;

//		ProcessImageDataWriteDTO writeDTO = new ProcessImageDataWriteDTO(momentChartDeviations, strengthChartDeviations, momentBridge, strengthBridge, strengthParameter, momentParameter, deformation);
//		ProcessChartCalculator service = new ProcessChartCalculator();
//		service.setCalculationData(writeDTO);
//		service.doCalculations();
//		ProcessImageDataReadDTO processedData = service.getProcessedData();
//		System.out.println(processedData);

	}

}
