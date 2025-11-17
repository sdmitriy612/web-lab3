package ru.sdmitriy612;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.FacesContext;
import jakarta.inject.Named;
import ru.sdmitriy612.database.Point;
import ru.sdmitriy612.database.PointService;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Named
@ApplicationScoped
public class FormBean implements Serializable {

    // Поля формы
    private Double x;
    private Double y = 0.0;
    private Double r = 1.0;

    // Поля для графика
    private Double graphX;
    private Double graphY;

    private List<Point> results = new ArrayList<>();

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public Double getR() {
        return r;
    }

    public void setR(Double r) {
        this.r = r;
    }

    public Double getGraphX() {
        return graphX;
    }

    public void setGraphX(Double graphX) {
        this.graphX = graphX;
    }

    public Double getGraphY() {
        return graphY;
    }

    public void setGraphY(Double graphY) {
        this.graphY = graphY;
    }

    public List<Point> getResults() {
        return results;
    }

    private final PointService pointService = new PointService();

    @PostConstruct
    public void init() {
        results = pointService.getAll();
    }

    private boolean validate(Double x, Double y, Double r) {
        if (x == null || y == null || r == null) return false;
        if (x < -3 || x > 5) return false;
        if (y < -2 || y > 2) return false;
        if (r < 1 || r > 3) return false;
        return true;
    }


    private void addResult(Point result) {
        pointService.save(result);
        results.add(0, result);
    }

    // Отправка формы
    public void checkPoint() {
        if (!validate(x, y, r)) {
            FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_ERROR, "Ошибка", "Некорректные данные"));
            return;
        }

        Point point = checkPointAndSave(x, y, r);

        FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_INFO, "Успех",
                        point.isHit() ? "Точка попала в область" : "Точка не попала в область"));
    }

    // Отправка с графика
    public void checkPointFromGraph() {
        checkPointAndSave(graphX, graphY, r);
    }

    private Point checkPointAndSave(Double x, Double y, Double r) {
        Point point = new Point(x.floatValue(), y.floatValue(), r.floatValue());
        point.setHit(Checker.checkHit(point));
        addResult(point);
        return point;
    }

    // Очистка формы
    public void clearForm() {
        x = null;
        y = 0.0;
        r = 1.0;
    }

    // Очистка результатов
    public void clearResults() {
        results.clear();
        pointService.clearAll();
    }
}
