package models.Infrastructure;

import io.ebean.*;

import javax.persistence.*;
import javax.persistence.Version;
import java.util.Date;

/**
 * Created by SummerTime on 16/6/17.
 */
@Entity
public class Log extends Model {
    @Id
    long id;

    public static Finder<Long, Log> find = new Finder<Long, Log>(Log.class);

    private String name;
    private String description;
    private String level = INFO;

    @Version
    private Date time;

    public final static String DEBUG = "DEBUG"; //Update Data Record
    public final static String INFO = "INFO";   //User Login

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }
}
