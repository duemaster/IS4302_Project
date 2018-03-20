import org.junit.Test;
import static org.junit.Assert.*;
import static play.test.Helpers.*;


public class IntegrationTest {

    /**
     * add your integration test here
     * in this example we just check if the welcome page is being shown
     */
    @Test
    public void test() {
        running(testServer(3333, fakeApplication(inMemoryDatabase())), HTMLUNIT, browser -> {
            browser.goTo("http://localhost:3333/adas");
            assertTrue(browser.pageSource().contains("o"));

            ApplicationTest test = new ApplicationTest();
            test.simpleCheck();
        });
    }


}
