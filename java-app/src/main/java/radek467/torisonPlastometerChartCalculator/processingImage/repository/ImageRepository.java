package radek467.torisonPlastometerChartCalculator.processingImage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import radek467.torisonPlastometerChartCalculator.processingImage.model.Image;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
