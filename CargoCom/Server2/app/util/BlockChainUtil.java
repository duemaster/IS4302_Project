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
//        userNode.put("$class", User.BLOCKCHAIN_EMPLOYEE_CLASSNAME);
        userNode.put("id", String.valueOf(userToBeCreated.getId()));
        userNode.put("name", userToBeCreated.getName());
        userNode.put("role", userToBeCreated.getRole());
//        userNode.put("company", User.COMPANY_ID);

        try {


            HttpResponse<JsonNode> addMemberReply =
                    Unirest.post("http://localhost:" + caller.getPortNumber() + "/api/org.airline.airChain.AddCargoEmployee")
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .body(new JsonNode(userNode.toString()))
                            .asJson();


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
        userNode.put("$class", User.BLOCKCHAIN_EMPLOYEE_CLASSNAME);
        userNode.put("name", userToBeUpdated.getName());
        userNode.put("role", userToBeUpdated.getRole());
        userNode.put("company", User.COMPANY_ID);

        try {
            HttpResponse<JsonNode> updateUserReply =
                    Unirest.put("http://localhost:" + caller.getPortNumber() + "/api/" + User.BLOCKCHAIN_EMPLOYEE_CLASSNAME + "/" + userToBeUpdated.getId())
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .body(new JsonNode(userNode.toString()))
                            .asJson();

        } catch (UnirestException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }

    public static boolean deleteUser(User caller, User userToBeDeleted) {
        try {
            HttpResponse<JsonNode> deleteUserReply =
                    Unirest.delete("http://localhost:" + caller.getPortNumber() + "/api/" + User.BLOCKCHAIN_EMPLOYEE_CLASSNAME + "/" + userToBeDeleted.getId())
                            .asJson();

            //Remove employee from company
            HttpResponse<JsonNode> companyReply =
                    Unirest.get("http://localhost:" + caller.getPortNumber() + "/api/" + User.BLOCKCHAIN_COMPANY_CLASSNAME + "/" + User.COMPANY_ID)
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .asJson();

            JsonNode ghaJsonNode = companyReply.getBody();
            ObjectNode company = (ObjectNode) Json.parse(ghaJsonNode.toString());

            ArrayNode employeeNode = (ArrayNode) company.get("employees");

            //If Employee Array is empty on blockchain
            if (employeeNode == null) {
                employeeNode = Json.newArray();
            }

            int indexToDelete = -1;
            for (int i = 0; i < employeeNode.size(); i++) {
                if (employeeNode.get(i).toString().equals(User.BLOCKCHAIN_EMPLOYEE_CLASSNAME + "#" + userToBeDeleted.getId())) {
                    indexToDelete = i;
                    break;
                }
            }

            if (indexToDelete != -1) {
                employeeNode.remove(indexToDelete);
            }
            company.set("employees", employeeNode);

            //Save GHA Company
            HttpResponse<JsonNode> saveCompanyReply =
                    Unirest.put("http://localhost:" + caller.getPortNumber() + "/api/" + User.BLOCKCHAIN_COMPANY_CLASSNAME + "/" + User.COMPANY_ID)
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .body(new JsonNode(company.toString()))
                            .asJson();

            VagrantUtil.removeUserCard(userToBeDeleted);
        } catch (UnirestException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }
}
