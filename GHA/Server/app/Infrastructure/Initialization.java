package Infrastructure;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.typesafe.config.Config;
import models.User;
import org.mindrot.jbcrypt.BCrypt;
import play.Environment;
import play.libs.Json;
import util.VagrantUtil;

import java.util.List;

/**
 * Created by SummerTime on 2/2/17.
 */
@Singleton
public class Initialization {
    @Inject
    public void Initialization(Environment environment, Config config) {
        System.out.println("Fetching Vagrant Box Id");
        VagrantUtil.boxId = VagrantUtil.fetchVagrantBoxId();

        setUpDefaultAccounts();
    }

    private void setUpDefaultAccounts() {
        //Check if  there exists any user
        List<User> existingUserList = User.find.query()
                .where()
                .eq("role", User.ROLE_OFFICER)
                .findList();

        if (existingUserList.size() >= 1) {
            System.out.println("User found. Not creating default user...");
            return;
        }

        User defaultUser = new User();
        defaultUser.setName("admin");
        defaultUser.setPassword(BCrypt.hashpw("password", BCrypt.gensalt()));
        defaultUser.setRole(User.ROLE_OFFICER);
        defaultUser.save();

        //Create User in Composer Network
        ObjectNode userNode = Json.newObject();
        userNode.put("$class", User.BLOCKCHAIN_EMPLOYEE_CLASSNAME);
        userNode.put("id", String.valueOf(defaultUser.getId()));
        userNode.put("name", defaultUser.getName());
        userNode.put("role", defaultUser.getRole());
        userNode.put("company", User.COMPANY_ID);

        try {
            //Add User into composer
            HttpResponse<JsonNode> memberReply =
                    Unirest.post("http://localhost:3000/api/" + User.BLOCKCHAIN_EMPLOYEE_CLASSNAME)
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .body(new JsonNode(userNode.toString()))
                            .asJson();

            HttpResponse<JsonNode> airLineReply =
                    Unirest.get("http://localhost:3000/api/org.airline.airChain.GHACompany/" + User.COMPANY_ID)
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .asJson();

            JsonNode ghaJsonNode = airLineReply.getBody();
            ObjectNode gha = (ObjectNode) Json.parse(ghaJsonNode.toString());

            ArrayNode employeeNode = (ArrayNode) gha.get("employees");

            //If Employee Array is empty on blockchain
            if (employeeNode == null) {
                employeeNode = Json.newArray();
            }

            employeeNode.add(String.valueOf(defaultUser.getId()));
            gha.set("employees", employeeNode);

            //Save GHA Company
            HttpResponse<JsonNode> ghaCompanyReply =
                    Unirest.put("http://localhost:3000/api/org.airline.airChain.GHACompany/" + User.COMPANY_ID)
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .body(new JsonNode(gha.toString()))
                            .asJson();

        } catch (UnirestException e) {
            e.printStackTrace();
        }

        // Create User Card and import in Fabric Composer
        VagrantUtil.importUserCard(defaultUser);
        System.out.println("User: " + defaultUser.getName() + " created.");
        return;
    }

}
