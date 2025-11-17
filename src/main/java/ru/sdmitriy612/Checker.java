package ru.sdmitriy612;

import ru.sdmitriy612.database.Point;

import java.io.Serializable;
import java.time.LocalDateTime;

public class Checker implements Serializable {

    public static boolean checkHit(Point point) {
        float x = point.getX();
        float y = point.getY();
        float r = point.getR();

        if (x >= 0 && y >= 0) {
            return x <= r && y <= r / 2;
        }
        if (x <= 0 && y >= 0) {
            return (x * x + y * y) <= (r * r);
        }
        if (x <= 0 && y <= 0) {
            return false;
        }
        if (x >= 0 && y <= 0) {
            return y >= (x - r);
        }
        return false;
    }

}