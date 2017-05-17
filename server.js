const app = require("express")(),
  server = require("http").Server(app),
  io = require("socket.io")(server),
  next = require("next"),
  pkgJSON = require("./package.json");

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || "all";

const dev = process.env.NODE_ENV !== "production",
  nextApp = next({ dev }),
  nextHandler = nextApp.getRequestHandler(),
  appInfo = {
    title: pkgJSON.title
  };

io.on("connection", socket => {
  console.log("Socket.IO was connected...");

  socket.on("message", data => {
    console.log(`received from client: ${data}`);
    //socket.broadcast.emit("message", data);
  });
});

nextApp.prepare().then(() => {
  // CUSTOM API GOES HERE

  // server.get("/your-route-here", (req, res) => {
  //   // DO SOMETHING AWESOME HERE...
  //   return app.render(req, res, "/your-route-here", req.query);
  // });

  app.get("/api/info", (req, res) => {
    return res.json(appInfo);
  });

  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(pkgJSON.port, err => {
    if (err) throw err;
    console.log(`> Ready on ${pkgJSON.url}:${pkgJSON.port}`);
  });
});
