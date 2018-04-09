package util;

import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import models.User;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class VagrantUtil {
    public static String boxId = "";

    public static String fetchVagrantBoxId() {
        String boxId = "";

        Pattern boxIdRegex = Pattern.compile(".?\\w+");

        try {
            Process p = Runtime.getRuntime().exec(
                    "vagrant global-status"
            );

            String s = null;
            BufferedReader stdInput = new BufferedReader(new InputStreamReader(p.getInputStream()));
            BufferedReader stdError = new BufferedReader(new InputStreamReader(p.getErrorStream()));

            // read the output from the command
            System.out.println("Here is the standard output of the command:\n");
            while ((s = stdInput.readLine()) != null) {
                if (s.contains("virtualbox")) {
                    System.out.println(s);
                    Matcher match = boxIdRegex.matcher(s);
                    if (match.find()) {
                        boxId = match.group(0);
                        break;
                    }
                }
            }

            // read any errors from the attempted command
            System.out.println("Here is the standard error of the command (if any):\n");
            while ((s = stdError.readLine()) != null) {
                System.out.println(s);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return boxId;
    }

    public static void importUserCard(User user) {
        // Create User Card and import in Fabric Composer
        try {
            Process p = Runtime.getRuntime().exec(
                    "vagrant ssh " + boxId + " " +
                            "-- sudo docker exec cli composer identity issue -c admin1@air-chain -u " + user.getId() + " -a " + User.BLOCKCHAIN_EMPLOYEE_CLASSNAME + "#" + user.getId() + "; " +
                            "sudo docker exec cli composer card import -f " + user.getUserCardName() + ".card; " +
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

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void removeUserCard(User user) {
        try {
            Process p = Runtime.getRuntime().exec(
                    "vagrant ssh " + boxId + " " +
                            "-- sudo docker exec cli composer card delete --name " + user.getUserCardName() + "; " +
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

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String startServer(User user) {

        String processId = "";
        String startServerCommand = "composer-rest-server -c " + user.getUserCardName() + " -p " + user.getPortNumber();

        Pattern processIdRegex = Pattern.compile("(\\w)+\\d+(\\w)+");

        try {
            Process p = Runtime.getRuntime().exec(
                    "vagrant ssh " + boxId + " -- " +
                            "sudo docker exec -d cli " + startServerCommand + "; " +
                            "sudo docker exec cli ps -ef;" + //query all running processes
                            "exit;"
            );

            String s = null;
            BufferedReader stdInput = new BufferedReader(new InputStreamReader(p.getInputStream()));
            BufferedReader stdError = new BufferedReader(new InputStreamReader(p.getErrorStream()));

            // read the output from the command
            System.out.println("Here is the standard output of the command:\n");
            while ((s = stdInput.readLine()) != null) {
                System.out.println(s);

                if (s.contains(startServerCommand)) {
                    Matcher match = processIdRegex.matcher(s);
                    if (match.find()) {
                        processId = match.group(0);
                        break;
                    }
                }
            }

            // read any errors from the attempted command
            System.out.println("Here is the standard error of the command (if any):\n");
            while ((s = stdError.readLine()) != null) {
                System.out.println(s);
            }

        } catch (IOException e) {
            System.out.println("exception happened - here's what I know: ");
            e.printStackTrace();
        }

        //Ensure Server is up before returning
        boolean isServerUp = false;
        while(!isServerUp) {
            try {
                Unirest.get(
                     "http://localhost:" + user.getPortNumber()
                ).asString();

                isServerUp = true;
            } catch (UnirestException e) {
                //.printStackTrace();
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e1) {
                    e1.printStackTrace();
                }
            }
        }

        return processId;
    }

    public static void stopServer(User user) {

        //Invalid Process Id
        if (user.getProcessId() == null || user.getProcessId().length() == 0)
            return;

        try {
            Process p = Runtime.getRuntime().exec(
                    "vagrant ssh " + boxId + " "
                            + "-- sudo docker exec cli kill " + user.getProcessId() + ";"
                            + "exit;"
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
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
