package modules;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.concurrent.CompletionStage;
import java.util.function.Function;
import javax.inject.Inject;

import akka.stream.Materializer;
import models.Infrastructure.Log;
import play.Logger;
import play.mvc.*;
import play.http.HttpEntity;
import akka.util.ByteString;

public class LoggingFilter extends Filter {
    private Logger.ALogger accessLogger = Logger.of("access");
    Materializer mat;

    @Inject
    public LoggingFilter(Materializer mat) {
        super(mat);
        this.mat = mat;
    }

    @Override
    public CompletionStage<Result> apply(Function<Http.RequestHeader, CompletionStage<Result>> nextFilter,
                                         Http.RequestHeader requestHeader) {
        long startTime = System.currentTimeMillis();
        return nextFilter.apply(requestHeader).thenApply(result -> {
            long endTime = System.currentTimeMillis();
            long requestTime = endTime - startTime;

            String body = "";

            if (!requestHeader.method().equals("GET")) {
                body = contentAsString(result);
                if (body.length() > 501)
                    body = body.substring(0, 500);
            }


            if(!requestHeader.uri().startsWith("/assets/")) {
                accessLogger.info("method={} uri={} remote-address={} takes {} ms \nresult:{}\n------------------------------",
                        requestHeader.method(), requestHeader.uri(), requestHeader.remoteAddress(), requestTime, result.status() + " " + body);

            }
            return result.withHeader("Request-Time", "" + requestTime);
        });
    }

    public static String contentAsString(Result result) {
        return contentAsBytes(result)
                .decodeString(result.charset().orElse("utf-8"));
    }

    public static ByteString contentAsBytes(Result result) {
        if (result.body() instanceof HttpEntity.Strict) {
            return ((HttpEntity.Strict) result.body()).data();
        } else {
            throw new UnsupportedOperationException("Tried to extract body from a non strict HTTP entity without a materializer, use the version of this method that accepts a materializer instead");
        }
    }
}
