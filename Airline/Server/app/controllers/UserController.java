package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import models.User;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class UserController extends Controller {

    public Result createNewUser() {
        JsonNode node = request().body().asJson();

        //User user = Json.fromJson(node, User.class);

        User newUser = new User();
        newUser.setRole(User.ROLE_STAFF);
        newUser.setUserName("userName");
        newUser.setPassword("password");
        newUser.save();

        //Create User in Hyperledger Fabric
        newUser.createUserInFabric();

        return ok();
    }
}
