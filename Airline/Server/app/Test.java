import java.io.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Test {

    public static final String boxId = "fd8245a";

    public static void main(String[] args) {
        //testMethod1();
        //String processId = startServer();
        //System.out.println(processId);
        //killServerProcess("766");
        String boxId = fetchBoxId();
        System.out.println(boxId);
    }

    private static String fetchBoxId() {

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

    private static void testMethod1() {
        try {
            Process p = Runtime.getRuntime().exec(
                    "vagrant ssh 08a9331 " +
                            "-- sudo docker exec cli composer identity issue -c admin1@air-chain -u testMember2 -a org.airline.airChain.AirlineEmployee#airlineStaff1; " +
                            "sudo docker exec cli composer card import -f testMember2@air-chain.card; " +
                            "sudo docker exec cli composer-rest-server -c testMember2@air-chain -p 3000;");

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

            System.exit(0);
        } catch (IOException e) {
            System.out.println("exception happened - here's what I know: ");
            e.printStackTrace();
            System.exit(-1);
        }
    }

    private static String startServer() {

        String processId = "";

        String command = "composer-rest-server -c admin1@air-chain -p 3000";
        Pattern regex = Pattern.compile("(\\w)+\\d+(\\w)+");

        try {
            Process p = Runtime.getRuntime().exec(
                    "vagrant ssh " + boxId + " "
                            + "-- sudo docker exec -d cli " + command + ";"
                            + "sudo docker exec cli ps -ef;"
                            + "exit;"
            );

            String s = null;
            BufferedReader stdInput = new BufferedReader(new InputStreamReader(p.getInputStream()));
            BufferedReader stdError = new BufferedReader(new InputStreamReader(p.getErrorStream()));

            // read the output from the command
            System.out.println("Here is the standard output of the command:\n");
            while ((s = stdInput.readLine()) != null) {
                if (s.contains(command)) {
                    System.out.println(s);
                    Matcher match = regex.matcher(s);
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
            e.printStackTrace();
        }

        return processId;
    }

    private static void killServerProcess(String processId) {
        try {
            Process p = Runtime.getRuntime().exec(
                    "vagrant ssh " + boxId + " "
                            + "-- sudo docker exec cli kill " + processId + ";"
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
