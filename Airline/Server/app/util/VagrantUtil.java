package util;

import models.User;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class VagrantUtil {
    public static final String boxId = "fd8245a";

    public static void createUser(User user) {
        // Create User Card and import in Fabric Composer
        try {
            Runtime.getRuntime().exec(
                    "vagrant ssh " + boxId + " " +
                            "-- \"sudo docker exec cli composer identity issue -c admin1@air-chain -u " + user.getId() + " -a org.airline.airChain.AirlineEmployee#" + user.getId() + ";\" " +
                            "\"sudo docker exec cli composer card import -f " + user.getUserCardName() + ".card;\""
            );
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void startServer(User user) {
        try {
            Process p = Runtime.getRuntime().exec(
                    "vagrant ssh " + boxId + " " +
                            "-- \"sudo docker exec -d cli composer-rest-server -c " + user.getUserCardName() + " -p " + user.getPortNumber() + "\";"
            );

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
