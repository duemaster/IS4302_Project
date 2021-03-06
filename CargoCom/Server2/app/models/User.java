package models;

import io.ebean.Finder;
import io.ebean.Model;
import io.ebean.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Date;

@Entity
public class User extends Model {
    public final static long STARTING_ID = 15040;

    public final static String ROLE_OFFICER = "OFFICER";
    public final static String ROLE_STAFF = "STAFF";

    public static String BLOCKCHAIN_EMPLOYEE_CLASSNAME = "org.airline.airChain.CargoEmployee";
    public static String BLOCKCHAIN_COMPANY_CLASSNAME = "org.airline.airChain.CargoCompany";
    public static String COMPANY_ID = "Cargo2";

    @Id
    @GeneratedValue(generator = "userIdGenerator")
    private long id;

    @Version
    private Date timeStamp;

    @Column(unique = true)
    private String name;

    private String password;

    private String role;

    @JsonIgnore
    private String processId;

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

    public String getProcessId() {
        return processId;
    }

    public void setProcessId(String processId) {
        this.processId = processId;
    }

    public long getPortNumber() {
        return this.id;
    }

    public String getUserCardName() {
        return this.id + "@air-chain";
    }
}
