package com.taskmanager.server.repository;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.taskmanager.server.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserUsername(String username);
    @Query("SELECT t FROM Task t WHERE t.user.username = :username " +
            "AND (:completed IS NULL OR t.completed = :completed) " +
            "AND (:title IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
            "AND (:dueBefore IS NULL OR t.dueDate < :dueBefore)")
    List<Task> findByFilters(@Param("username") String username,
                             @Param("completed") Boolean completed,
                             @Param("title") String title,
                             @Param("dueBefore") LocalDateTime dueBefore);

}