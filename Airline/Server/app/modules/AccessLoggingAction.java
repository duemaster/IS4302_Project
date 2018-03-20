package modules;

import com.fasterxml.jackson.databind.JsonNode;
import play.Logger;
import play.Logger.ALogger;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Http.Request;
import play.mvc.Result;

import java.util.Map;
import java.util.concurrent.CompletionStage;

public class AccessLoggingAction extends Action.Simple {

    private ALogger accessLogger = Logger.of("access");

    public CompletionStage<Result> call(Http.Context ctx) {
        final Request request = ctx.request();

        String body = getBody(request);

        accessLogger.info("method={} uri={} remote-address={} \n{}\n--------",
                request.method(), request.uri(), request.remoteAddress(),body);

        return delegate.call(ctx);
    }


    public String getBody(Request request){
        if(!request.method().equals("GET")){
            JsonNode json = request.body().asJson();
            if(json!=null)
                return "requestBody"+json.toString();

            String bodyText = request.body().asText();
            if(bodyText!=null)
                return "requestBody"+bodyText;

            Map<String, String[]> params = request.body().asFormUrlEncoded();
            if(params!=null)
                return "requestBody"+params.toString();

        }

        return "";
    }

}