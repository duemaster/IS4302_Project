package controllers;

import models.User;
import org.mindrot.jbcrypt.BCrypt;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.List;

public class SetUpController extends Controller {

    public Result createDefaultOfficer() {
        //Check if  there exists any user
        List<User> existingUserList = User.find.query()
                .where()
                .eq("role", User.ROLE_OFFICER)
                .findList();

        if(existingUserList.size() >= 1) {
            return ok("Officer already exists");
        }

        User defaultUser = new User();
        defaultUser.setName("admin");
        defaultUser.setPassword(BCrypt.hashpw("password", BCrypt.gensalt()));
        defaultUser.setRole(User.ROLE_OFFICER);
        defaultUser.save();

        defaultUser.createUserInFabric();
        return ok();
    }
}
