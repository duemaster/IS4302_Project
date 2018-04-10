  package models;

  import play.db.ebean.*;
  import io.ebean.*;

  import javax.persistence.Entity;
  import javax.persistence.Id;

  @Entity
  public class Settings extends Model {
      /**
       *
       */
      private static final long serialVersionUID = 1L;

      @Id
      public String id;
      public String value;

      public static Finder<Integer, Settings> find = new Finder<>(Settings.class);

      public static String get(String key) {
          Settings setting =  find.query().where().eq("id", key).findUnique();
          if (setting == null) {
              return null;
          } else {
              return setting.getValue();
          }
      }

      public static void set(String key, String value) {
          Settings setting =  find.query().where().eq("id", key).findUnique();
          if (setting == null) {
              setting = new Settings();
              setting.setId(key);
          }
          setting.setValue(value);
          setting.save();
      }

      public String getId() {
          return id;
      }

      public void setId(String id) {
          this.id = id;
      }

      public String getValue() {
          return value;
      }

      public void setValue(String value) {
          this.value = value;
      }
  }
