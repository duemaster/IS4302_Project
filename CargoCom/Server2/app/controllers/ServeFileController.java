package controllers;

import play.mvc.Controller;
import play.data.FormFactory;
import javax.inject.*;

public class ServeFileController extends Controller {

    @Inject FormFactory formFactory;
    public static String fs = System.getProperty("file.separator");
    public static String path;
}
