package modules;

import play.mvc.EssentialFilter;
import play.filters.cors.CORSFilter;
import play.http.DefaultHttpFilters;
import play.filters.gzip.GzipFilter;

import javax.inject.Inject;

public class Filters extends DefaultHttpFilters {
    @Inject public Filters(GzipFilter gzip, LoggingFilter logging, CORSFilter corsFilter) {
        super(gzip,logging /*, corsFilter*/);
    }
}