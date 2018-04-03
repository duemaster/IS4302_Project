package controllers;

import play.mvc.Controller;
import play.data.FormFactory;
import play.mvc.Result;

import javax.inject.*;
import java.io.File;

public class ServeFileController extends Controller {

    @Inject
    FormFactory formFactory;
    public static String fs = System.getProperty("file.separator");
    public static String path;

    public Result adminPortal(String file) {

        String angularDirectory = "airline_web_dist";
        File f = new File(angularDirectory + fs + file);

        if (!f.exists()) {
            f = new File("airline_web_dist" + fs + "index.html");
        }

        return ok(f);
    }

    public Result adminPortalIndex() {
        return ok(new File("airline_web_dist" + fs + "index.html"));
    }
}
