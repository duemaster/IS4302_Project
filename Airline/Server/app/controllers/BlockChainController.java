package controllers;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import models.User;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class BlockChainController extends Controller {
    public Result redirectGET(long id, String url) {

        User user = User.find.byId(id);
        if (user == null)
            return unauthorized();

        try {
            HttpResponse<JsonNode> serverReply =
                    Unirest.get("http://localhost:" + user.getPortNumber() + "/" + url)
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .asJson();

            return ok(Json.parse(serverReply.getBody().toString()));
        } catch (UnirestException e) {
            e.printStackTrace();
            return internalServerError();
        }
    }

    public Result redirectPOST(long id, String url) {

        User user = User.find.byId(id);
        if (user == null)
            return badRequest("User not found");

        try {
            HttpResponse<JsonNode> serverReply =
                    Unirest.post("http://localhost:" + user.getPortNumber() + "/" + url)
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .body(new JsonNode(request().body().asJson().toString()))
                            .asJson();

            return ok(Json.parse(serverReply.getBody().toString()));
        } catch (UnirestException e) {
            e.printStackTrace();
            return internalServerError();
        }
    }

    public Result redirectPUT(long id, String url) {

        User user = User.find.byId(id);
        if (user == null)
            return unauthorized();

        try {
            HttpResponse<JsonNode> serverReply =
                    Unirest.put("http://localhost:" + user.getPortNumber() + "/" + url)
                            .header("accept", "application/json")
                            .header("Content-Type", "application/json")
                            .body(new JsonNode(request().body().asJson().toString()))
                            .asJson();

            return ok(Json.parse(serverReply.getBody().toString()));
        } catch (UnirestException e) {
            e.printStackTrace();
            return internalServerError();
        }
    }

    public Result redirectDELETE(long id, String url) {

        User user = User.find.byId(id);
        if (user == null)
            return unauthorized();

        try {
            HttpResponse<JsonNode> serverReply =
                    Unirest.delete("http://localhost:" + user.getPortNumber() + "/" + url)
                            .asJson();

            return ok(serverReply.getStatusText());
        } catch (UnirestException e) {
            e.printStackTrace();
            return internalServerError();
        }
    }
}
