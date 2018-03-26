import java.io.*;

public class Test {

    public static void main(String[] args) {
        try {
            //Process p = Runtime.getRuntime().exec("vagrant ssh 08a9331 -- \"sudo docker exec -d cli composer-rest-server -c admin1@air-chain -p 3000;\"");
            Process p = Runtime.getRuntime().exec(
                    "vagrant ssh 08a9331 " +
                            "-- \"sudo docker exec cli composer identity issue -c admin1@air-chain -u testMember2 -a org.airline.airChain.AirlineEmployee#airlineStaff1;\" " +
                            "\"sudo docker exec cli composer card import -f testMember2@air-chain.card;\" " +
                            "\"sudo docker exec cli composer-rest-server -c testMember2@air-chain -p 3000;\"");

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

    private static void sendCommand() {

    }
}
