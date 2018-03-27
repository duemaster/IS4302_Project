package util;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import models.User;
import play.libs.Json;

public class BlockChainUtil {

    public static boolean createUser(User caller, User userToBeCreated) {

        ObjectNode userNode = Json.newObject();
        userNode.put("$class", "org.airline.airChain.AirlineEmployee");
        userNode.put("id", String.valueOf(userToBeCreated.getId()));
        userNode.put("name", userToBeCreated.getName());
        userNode.put("role", userToBeCreated.getRole());
        userNode.put("company", User.COMPANY_ID);

        try {
            //Add User into composer
            HttpResponse<JsonNode> memberReply =
                    Unirest.post("http://localhost:" + caller.getPortNumber() + "/api/org.airline.airChain.AirlineEmployee")
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .body(new JsonNode(userNode.toString()))
                            .asJson();

            //System.out.println(memberReply.getBody().toString());

            HttpResponse<JsonNode> airLineReply =
                    Unirest.get("http://localhost:" + caller.getPortNumber() + "/api/org.airline.airChain.AirlineCompany/" + User.COMPANY_ID)
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

            employeeNode.add(String.valueOf(userToBeCreated.getId()));
            airline.set("employees", employeeNode);
            //System.out.println(airline.toString());

            //Save Airline Company
            HttpResponse<JsonNode> airlineCompanyReply =
                    Unirest.put("http://localhost:" + caller.getPortNumber() + "/api/org.airline.airChain.AirlineCompany/" + User.COMPANY_ID)
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .body(new JsonNode(airline.toString()))
                            .asJson();

            //System.out.println(airlineCompanyReply.getBody().toString());

        } catch (UnirestException e) {
            e.printStackTrace();
            return false;
        }

        // Create User Card and import in Fabric Composer
        VagrantUtil.importUserCard(userToBeCreated);

        return true;
    }

    public static boolean updateUser(User caller, User userToBeUpdated) {
        ObjectNode userNode = Json.newObject();
        userNode.put("$class", "org.airline.airChain.AirlineEmployee");
        userNode.put("name", userToBeUpdated.getName());
        userNode.put("role", userToBeUpdated.getRole());
        userNode.put("company", User.COMPANY_ID);

        try {
            HttpResponse<JsonNode> updateUserReply =
                    Unirest.put("http://localhost:" + caller.getPortNumber() + "/api/org.airline.airChain.AirlineEmployee/" + userToBeUpdated.getId())
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .body(new JsonNode(userNode.toString()))
                            .asJson();

            //System.out.println(updateUserReply.getBody().toString());
        } catch (UnirestException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }

    public static boolean deleteUser(User caller, User userToBeDeleted) {
        try {
            HttpResponse<JsonNode> deleteUserReply =
                    Unirest.delete("http://localhost:" + caller.getPortNumber() + "/api/org.airline.airChain.AirlineEmployee/" + userToBeDeleted.getId())
                            .asJson();

            VagrantUtil.removeUserCard(userToBeDeleted);
        } catch (UnirestException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }
}
