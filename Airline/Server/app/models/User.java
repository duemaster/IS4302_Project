package models;

import io.ebean.Finder;
import io.ebean.Model;

import javax.persistence.*;
import java.util.Date;

@Entity
public class User extends Model {
    //Initial Id set to 9000
    @TableGenerator(name = "User", initialValue = 9000)

    public final static long PORT_OFFSET = 9000;

    public final static String ROLE_OFFICER = "OFFICER";
    public final static String ROLE_STAFF = "STAFF";

    public static String COMPANY_ID = "Airline1";

    @Id
    private long id;

    @Version
    private Date timeStamp;

    @Column(unique = true)
    private String name;

    private String password;

    private String role;

    public static Finder<Long, User> find = new Finder<>(User.class);

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Date getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(Date timeStamp) {
        this.timeStamp = timeStamp;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public long getPortNumber() {
        return 3001;
        //return this.id + PORTOFFSET;
    }

    public String getUserCardName() {
        return this.id + "@air-chain";
    }
}
