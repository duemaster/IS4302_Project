package Infrastructure;

import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;

import java.net.URLEncoder;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

import static play.mvc.Controller.session;

public class AuthAction extends Action<Authentication> {

    public CompletionStage<Result> call(Http.Context ctx) {
        //Time out mechanism START******************************
        long currTime = new Date().getTime();
        if(session("previousTime") != null){ // Have a previous timestamp
            long SESSION_TIMEOUT_PERIOD = 1800000; //30 minutes
            //long SESSION_TIMEOUT_PERIOD = 120000; //2 min
            System.out.println("Previous: " + session("previousTime"));
            System.out.println("Current Time: " + currTime);
            if(currTime - Long.parseLong(session("previousTime")) > SESSION_TIMEOUT_PERIOD) {
                System.out.println("Haha , Too Slow, Timeout!");
                session().clear(); //clear the session
                return failAuth(ctx); //log out and redirect to login page
            }
        }
        session().put("previousTime", String.valueOf(currTime));
        //END****************************************************


        Map<String, Integer> levels = new HashMap<String, Integer> ();

        String requiredLevel = configuration.level();
        String currLevel = session().get("level");

        if(currLevel==null)
            return failAuth(ctx);

        if(levels.get(requiredLevel)>levels.get(currLevel))
            return failAuth(ctx);
        else
            return delegate.call(ctx);


    }

    public CompletionStage<Result> failAuth(Http.Context ctx) {
        if(ctx._requestHeader().path().contains("ember"))
            return CompletableFuture.supplyAsync(() -> 1+2)
                    .thenApply(i -> redirect("/memberLogin?path="+ URLEncoder.encode(ctx._requestHeader().path())));


        return CompletableFuture.supplyAsync(() -> 1+2)
                .thenApply(i -> redirect("/system/login?path="+ URLEncoder.encode(ctx._requestHeader().path())));

    }
}
