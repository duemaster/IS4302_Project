package controllers;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import models.User;
import org.mindrot.jbcrypt.BCrypt;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import util.VagrantUtil;

import java.util.List;

public class SetUpController extends Controller {

    public Result createDefaultOfficer() {
        //Check if  there exists any user
        List<User> existingUserList = User.find.query()
                .where()
                .eq("role", User.ROLE_OFFICER)
                .findList();

        if (existingUserList.size() >= 1) {
            return ok("Officer already exists");
        }

        User defaultUser = new User();
        defaultUser.setName("admin");
        defaultUser.setPassword(BCrypt.hashpw("password", BCrypt.gensalt()));
        defaultUser.setRole(User.ROLE_OFFICER);
        defaultUser.save();

        //Create User in Composer Network
        ObjectNode userNode = Json.newObject();
        userNode.put("$class", "org.airline.airChain.AirlineEmployee");
        userNode.put("id", String.valueOf(defaultUser.getId()));
        userNode.put("name", defaultUser.getName());
        userNode.put("role", defaultUser.getRole());
        userNode.put("company", User.COMPANY_ID);

        try {
            //Add User into composer
            HttpResponse<JsonNode> memberReply =
                    Unirest.post("http://localhost:3000/api/org.airline.airChain.AirlineEmployee")
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .body(new JsonNode(userNode.toString()))
                            .asJson();

            //System.out.println(memberReply.getBody().toString());

            HttpResponse<JsonNode> airLineReply =
                    Unirest.get("http://localhost:3000/api/org.airline.airChain.AirlineCompany/" + User.COMPANY_ID)
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .asJson();

            //System.out.println(airLineReply.getBody().toString());

            JsonNode airlineJsonNode = airLineReply.getBody();
            ObjectNode airline = (ObjectNode) Json.parse(airlineJsonNode.toString());
            //System.out.println(airline.toString());

            ArrayNode employeeNode = (ArrayNode) airline.get("employees");

            //If Employee Array is empty on blockchain
            if (employeeNode == null) {
                employeeNode = Json.newArray();
            }

            employeeNode.add(String.valueOf(defaultUser.getId()));
            airline.set("employees", employeeNode);
            //System.out.println(airline.toString());

            //Save Airline Company
            HttpResponse<JsonNode> airlineCompanyReply =
                    Unirest.put("http://localhost:3000/api/org.airline.airChain.AirlineCompany/" + User.COMPANY_ID)
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .body(new JsonNode(airline.toString()))
                            .asJson();

            //System.out.println(airlineCompanyReply.getBody().toString());

        } catch (UnirestException e) {
            e.printStackTrace();
        }

        // Create User Card and import in Fabric Composer
        VagrantUtil.importUserCard(defaultUser);
        return ok();
    }
}
