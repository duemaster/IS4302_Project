package util;

import models.User;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class VagrantUtil {
    public static final String boxId = "9ba44a9";

    public static void importUserCard(User user) {
        // Create User Card and import in Fabric Composer
        try {
            Process p = Runtime.getRuntime().exec(
                    "vagrant ssh " + boxId + " " +
                            "-- sudo docker exec cli composer identity issue -c admin1@air-chain -u " + user.getId() + " -a org.airline.airChain.AirlineEmployee#" + user.getId() + "; " +
                            "sudo docker exec cli composer card import -f " + user.getUserCardName() + ".card;"
            );

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void removeUserCard(User user) {
        try {
            Runtime.getRuntime().exec(
                    "vagrant ssh " + boxId + " " +
                            "-- sudo docker exec cli composer card delete --name " + user.getUserCardName() + "; "
            );
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void startServer(User user) {
        try {
            Process p = Runtime.getRuntime().exec(
                    "vagrant ssh " + boxId + " " +
                            "-- sudo docker exec -d cli composer-rest-server -c " + user.getUserCardName() + " -p " + user.getPortNumber() + "; " +
                            "exit;"
            );

            String s = null;
            BufferedReader stdInput = new BufferedReader(new InputStreamReader(p.getInputStream()));
            BufferedReader stdError = new BufferedReader(new InputStreamReader(p.getErrorStream()));

            // read the output from the command
            System.out.println("Here is the standard output of the command:\n");
            while ((s = stdInput.readLine()) != null) {
                System.out.println(s);
            }

            // read any errors from the attempted command
            System.out.println("Here is the standard error of the command (if any):\n");
            while ((s = stdError.readLine()) != null) {
                System.out.println(s);
            }

            System.out.println("Exit Line");


        } catch (IOException e) {
            System.out.println("exception happened - here's what I know: ");
            e.printStackTrace();
        }
    }
}
