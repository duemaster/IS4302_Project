package controllers;

import play.mvc.Controller;
import play.data.FormFactory;
import play.mvc.Result;
import util.GenerateQRCode;

import javax.inject.*;
import java.io.File;

public class ServeFileController extends Controller {

    @Inject FormFactory formFactory;
    public static String fs = System.getProperty("file.separator");
    public static String path = System.getProperty("user.dir");


    public Result getQRcode(String text){
        String filePath = path+fs+text+".jpg";
        File file = GenerateQRCode.getQRImageFile(filePath,text);

        return ok(file);
    }

    public Result adminPortal(String file) {

        String angularDirectory = "dist";
        File f = new File(angularDirectory + fs + file);

        if (!f.exists()) {
            f = new File("dist" + fs + "index.html");
        }

        return ok(f);
    }

    public Result adminPortalIndex() {
        return ok(new File("dist" + fs + "index.html"));
    }

}
