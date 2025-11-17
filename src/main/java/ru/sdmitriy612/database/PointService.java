package ru.sdmitriy612.database;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.ArrayList;

public class PointService {

    @Inject
    EntityManager entityManager;

    public void save(Point point) {
        try{
            entityManager.getTransaction().begin();
            entityManager.persist(point);
            entityManager.getTransaction().commit();
        }catch (Exception e){
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            throw e;
        }
    }

    public void clearAll() {
        try{
            entityManager.getTransaction().begin();
            entityManager.createQuery("DELETE FROM Point").executeUpdate();
            entityManager.getTransaction().commit();
        }catch (Exception e){
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            throw e;
        }
    }

    public ArrayList<Point> getAll() {
        return new ArrayList<>(entityManager.createQuery("SELECT p FROM Point p", Point.class).getResultList());
    }

}
