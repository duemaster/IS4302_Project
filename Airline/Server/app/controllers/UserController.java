package controllers;

import models.User;
import play.data.DynamicForm;
import play.data.FormFactory;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import util.VagrantUtil;

import javax.inject.Inject;

public class UserController extends Controller {

    @Inject
    FormFactory formFactory;

    public Result createNewUser() {

        //TODO: Hash Password
        User newUser = Json.fromJson(request().body().asJson(), User.class);
        newUser.save();

        //Create User in Hyperledger Fabric
        newUser.createUserInFabric();
        return ok();
    }

    public Result login() {
        DynamicForm in = formFactory.form().bindFromRequest();

        //TODO: Hash Password
        User user = User.find.query()
                .where()
                .eq("name", in.get("name"))
                .eq("password", in.get("password"))
                .findUnique();

        if (user == null) {
            return badRequest("User not found!");
        }

        VagrantUtil.startServer(user);

        //Wait for 2 sec for server to start up
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        return ok();
    }
}
