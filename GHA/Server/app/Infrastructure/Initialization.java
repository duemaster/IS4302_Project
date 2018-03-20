package Infrastructure;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.typesafe.config.Config;
import controllers.ServeFileController;
import play.Environment;
import java.io.*;

import static controllers.ServeFileController.fs;

/**
 * Created by SummerTime on 2/2/17.
 */
@Singleton
public class Initialization {
    @Inject
    public void Initialization(Environment environment, Config config) {
    }

}
