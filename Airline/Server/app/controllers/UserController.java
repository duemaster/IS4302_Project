package controllers;

import models.User;
import org.mindrot.jbcrypt.BCrypt;
import play.data.DynamicForm;
import play.data.FormFactory;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import util.BlockChainUtil;
import util.VagrantUtil;

import javax.inject.Inject;

public class UserController extends Controller {

    @Inject
    FormFactory formFactory;

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
//        try {
//            Thread.sleep(5000);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }

        return ok(Json.toJson(user));
    }

    public Result createNewUser(long id) {

        User currentUser = User.find.byId(id);
        if (currentUser == null) {
            return unauthorized();
        }

        User newUser = Json.fromJson(request().body().asJson(), User.class);
        newUser.setPassword(BCrypt.hashpw(newUser.getPassword(), BCrypt.gensalt()));
        newUser.save();

        BlockChainUtil.createUser(currentUser, newUser);
        return ok(Json.toJson(newUser));
    }

    public Result updateUser(long id) {
        User currentUser = User.find.byId(id);
        if (currentUser == null) {
            return unauthorized();
        }

        User requestUser = Json.fromJson(request().body().asJson(), User.class);
        User userToBeUpdated = User.find.byId(requestUser.getId());
        if (userToBeUpdated == null) {
            return badRequest();
        }

        userToBeUpdated.setName(requestUser.getName());
        userToBeUpdated.setPassword(BCrypt.hashpw(requestUser.getPassword(), BCrypt.gensalt()));
        userToBeUpdated.setRole(requestUser.getRole());

        if (!BlockChainUtil.updateUser(currentUser, userToBeUpdated))
            return badRequest();

        userToBeUpdated.save();

        return ok(Json.toJson(userToBeUpdated));
    }

    public Result deleteUser(long id) {
        User currentUser = User.find.byId(id);
        if (currentUser == null) {
            return unauthorized();
        }

        User requestUser = Json.fromJson(request().body().asJson(), User.class);
        User userToBeDeleted = User.find.byId(requestUser.getId());
        if (userToBeDeleted == null) {
            return badRequest();
        }

        if (!BlockChainUtil.deleteUser(currentUser, userToBeDeleted))
            return badRequest();

        userToBeDeleted.delete();
        return ok(Json.toJson(userToBeDeleted));
    }
}
