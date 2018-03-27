package controllers;

import models.User;
import org.mindrot.jbcrypt.BCrypt;
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
        User newUser = Json.fromJson(request().body().asJson(), User.class);
        newUser.setPassword(BCrypt.hashpw(newUser.getPassword(), BCrypt.gensalt()));
        newUser.save();

        //Create User in Composer
        newUser.createUserInFabric();
        return ok(Json.toJson(newUser));
    }

    public Result login() {
        DynamicForm in = formFactory.form().bindFromRequest();

        User user = User.find.query()
                .where()
                .eq("name", in.get("name"))
                .findUnique();

        //Authentication Check
        if (user == null) {
            return badRequest("Username or Password is incorrect!");
        }
        boolean isPasswordCorrect = BCrypt.checkpw(in.get("password"), user.getPassword());
        if (!isPasswordCorrect) {
            return badRequest("Username or Password is incorrect!");
        }

        VagrantUtil.startServer(user);

        //Wait for 2 sec for server to start up
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        return ok(Json.toJson(user));
    }
}
