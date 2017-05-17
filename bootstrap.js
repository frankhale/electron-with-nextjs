window.$ = window.jQuery = require("./node_modules/jquery/dist/jquery.min.js");

const pkgJSON = require("./package.json");
let env = Object.create(process.env);

if (pkgJSON.node.production) {
  env.NODE_ENV = "production";
}

const url = `${pkgJSON.url}:${pkgJSON.port}`,
  spawn = require("child_process").spawn,
  // For electron-packager change cwd in spawn to app.getAppPath() and
  // uncomment the app require below
  //app = require('electron').remote.app,
  node = spawn(pkgJSON.node.exe, pkgJSON.node.args, {
    cwd: process.cwd(),
    env: env
  }),
  request = require("request"),
  _ = require("lodash"),
  key = require("keymaster"),
  $serverLogContainer = $("#serverLogContainer"),
  $log = $("#log"),
  $nextApp = $("#nextApp"),
  $loading = $("#loading");

key("f1", () => {
  if ($serverLogContainer.css("display") === "none") {
    $serverLogContainer.css("display", "block");
    $nextApp.addClass("nextAppHide");
  } else {
    $nextApp.removeClass("nextAppHide");
    $serverLogContainer.css("display", "none");
  }
});

function redirectOutput(x) {
  x.on("data", data => {
    const output = data.toString();
    console.log(output);
    $log.append(_.escape(output));
  });
}

redirectOutput(node.stdout);
redirectOutput(node.stderr);

let checkServerRunning = setInterval(() => {
  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      $nextApp.attr("src", url);
      $loading.css("display", "none");
      $nextApp.css("display", "block");
      clearInterval(checkServerRunning);
    }
  });
}, 1000);
