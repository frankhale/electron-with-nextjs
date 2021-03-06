window.$ = window.jQuery = require("./node_modules/jquery/dist/jquery.min.js");

const spawn = require("child_process").spawn,
  pkgJSON = require("./package.json"),
  url = `${pkgJSON.app.url}:${pkgJSON.app.port}`,
  io = require("socket.io")(pkgJSON.app.ioPort),
  nodeExe = pkgJSON.app.node.exe,
  nodeArgs = pkgJSON.app.node.args,
  isProduction = pkgJSON.app.node.production,
  electron = require("electron"),
  _ = require("lodash"),
  request = require("request"),
  $nextApp = $("#nextApp"),
  $loading = $("#loading");

let env = Object.create(process.env), serverOutput = [], fullscreen = false;

if (isProduction) {
  env.NODE_ENV = "production";
} else {
  $nextApp[0].addEventListener("did-finish-load", e => {
    $nextApp[0].openDevTools();
  });
}

// For electron-packager change cwd in spawn to app.getAppPath() and
// uncomment the app require below
//app = require('electron').remote.app,
const node = spawn(nodeExe, nodeArgs, {
  cwd: process.cwd(),
  env: env
});

io.on("connection", socket => {
  console.log("Socket.IO was connected at the browser top level...");

  socket.on("get-server-output", () => {
    socket.emit("server-output", serverOutput);
  });

  socket.on("toggle-fullscreen", () => {
    const window = electron.remote.getCurrentWindow();
    fullscreen = !fullscreen;
    window.setFullScreen(fullscreen);
  });
});

function redirectOutput(x) {
  x.on("data", data => {
    //_.escape(data.toString())
    let output = data.toString();
    console.log(output);
    serverOutput.push(output);
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
