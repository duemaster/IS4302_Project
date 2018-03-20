name := "Airchain-Server"

version := "1.0-SNAPSHOT"

scalaVersion := "2.12.4"

lazy val root = (project in file(".")).enablePlugins(PlayJava, PlayEbean, SbtTwirl, SbtWeb)

libraryDependencies ++= Seq(
  filters,
  javaWs,
  evolutions,
  guice,
  "org.json" % "org.json" % "chargebee-1.0",
  "com.google.zxing" % "core" % "3.2.1",
  "com.google.code.gson" % "gson" % "2.8.2",
  "mysql" % "mysql-connector-java" % "6.0.6",
  "org.mindrot" % "jbcrypt" % "0.4",
  "com.typesafe.play" %% "play-test" % "2.6.7" % "test",
  "org.scalatestplus.play" %% "scalatestplus-play" % "3.1.2" % "test",
  "com.mashape.unirest" % "unirest-java" % "1.4.9"

)

javaOptions ++= Seq(
  "-Dhttp.port=9000",
  //"-Dhttps.port=8000",
  //"-Dhttps.keyStore=conf/uniweb.jks",
  //"-Dhttps.keyStorePassword=uniweb",
  "-Dconfig.file=conf/application.conf"
)

fork in Test := true

includeFilter in(Assets, LessKeys.less) := "*.less"

CoffeeScriptKeys.bare := true
CoffeeScriptKeys.sourceMap := true

pipelineStages := Seq(digest, gzip)

resolvers ++= Seq(
  Resolver.sonatypeRepo("snapshots")
)
