package controllers;

import play.mvc.Controller;
import play.mvc.Result;

public class Application extends Controller {

    public Result indexPage() {

        return ok(views.html.systemName.demo.render("SummerTime"));
    }

}
