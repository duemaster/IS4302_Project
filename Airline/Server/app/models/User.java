package models;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import io.ebean.Finder;
import io.ebean.Model;
import play.libs.Json;

import javax.persistence.Id;
import javax.persistence.Entity;
import javax.persistence.Version;
import java.io.IOException;
import java.sql.Array;
import java.util.Date;

@Entity
public class User extends Model {

    public final static long PORT_OFFSET = 9000;

    public final static String ROLE_OFFICER = "OFFICER";
    public final static String ROLE_STAFF = "STAFF";

    public final static String COMPANY_ID = "AirlineCompany1";

    @Id
    private long id;

    @Version
    private Date timeStamp;

    private String userName;

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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
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

    public void createUserInFabric() {

        //Create User in Composer Network
        ObjectNode userNode = Json.newObject();
        userNode.put("$class", "org.airline.airChain.AirlineEmployee");
        userNode.put("id", String.valueOf(id));
        userNode.put("role", this.role);
        userNode.put("company", "Airline1");

        try {
            //Add User into composer
            HttpResponse<JsonNode> memberReply =
                    Unirest.post("http://localhost:3000/api/org.airline.airChain.AirlineEmployee")
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .body(userNode)
                            .asJson();

            System.out.println(memberReply.getBody().toString());

            HttpResponse<JsonNode> airLineReply =
                    Unirest.get("http://localhost:3000/api/org.airline.airChain.AirlineCompany/" + this.COMPANY_ID)
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .asJson();

            System.out.println(airLineReply.getBody().toString());

            JsonNode airlineJsonNode = airLineReply.getBody();
            ObjectNode airline = (ObjectNode) Json.parse(airlineJsonNode.toString());
            ArrayNode employeeNode = (ArrayNode) airline.get("employees");
            employeeNode.add(userNode);
            airline.set("employees", employeeNode);

            //Save Airline Company
            HttpResponse<JsonNode> airlineCompanyReply =
                    Unirest.post("http://localhost:3000/api/org.airline.airChain.AirlineCompany/" + this.COMPANY_ID)
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .body(airline)
                            .asJson();

            System.out.println(airlineCompanyReply.getBody().toString());

        } catch (UnirestException e) {
            e.printStackTrace();
        }

        // Create User Card in Fabric Composer
        try {
            Process p = Runtime.getRuntime().exec(
                    "vagrant ssh 08a9331 " +
                            "-- \"sudo docker exec cli composer identity issue -c admin1@air-chain -u testMember2 -a org.airline.airChain.AirlineEmployee#airlineStaff1;\" " +
                            "\"sudo docker exec cli composer card import -f testMember2@air-chain.card;\"");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
