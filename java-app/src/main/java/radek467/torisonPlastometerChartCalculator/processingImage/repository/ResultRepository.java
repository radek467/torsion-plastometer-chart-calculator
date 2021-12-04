package radek467.torisonPlastometerChartCalculator.processingImage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import radek467.torisonPlastometerChartCalculator.processingImage.model.Result;

public interface ResultRepository extends JpaRepository<Result, Long> {
}
