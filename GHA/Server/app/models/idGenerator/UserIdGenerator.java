package models.idGenerator;

import io.ebean.config.IdGenerator;
import models.User;

public class UserIdGenerator implements IdGenerator {
    @Override
    public Object nextValue() {

        //Find Current Number of Users
        int currNum = User.find.all().size();

        return User.STARTING_ID + currNum;
    }

    @Override
    public String getName() {
        return "userIdGenerator";
    }
}
