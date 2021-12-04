package radek467.torisonPlastometerChartCalculator.processingImage.model;

import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Result {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private double chartPoint;
    private double sigma;
    private double alternativeDeformations;

    @ManyToOne
    @JoinColumn(name = "image_id")
    private Image image;

    public Result(double chartPoint, double sigma, double alternativeDeformations, Image image) {
        this.chartPoint = chartPoint;
        this.sigma = sigma;
        this.alternativeDeformations = alternativeDeformations;
        this.image = image;
    }
}

