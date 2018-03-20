package modules;

import Infrastructure.Initialization;
import com.google.inject.AbstractModule;

public class OnStartupModule extends AbstractModule {
    @Override
    public void configure() {
        bind(Initialization.class).asEagerSingleton();
    }
}
