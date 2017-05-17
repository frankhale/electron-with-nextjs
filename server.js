const express = require("express"),
  next = require("next"),
  pkgJSON = require("./package.json");

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || "all";

const dev = process.env.NODE_ENV !== "production",
  app = next({ dev }),
  handle = app.getRequestHandler(),
  appInfo = {
    title: pkgJSON.title
  };

app.prepare().then(() => {
  const server = express();

  // CUSTOM API GOES HERE

  // server.get("/your-route-here", (req, res) => {
  //   // DO SOMETHING AWESOME HERE...
  //   return app.render(req, res, "/your-route-here", req.query);
  // });

  server.get("/api/info", (req, res) => {
    return res.json(appInfo);
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(pkgJSON.port, err => {
    if (err) throw err;
    console.log(`> Ready on ${pkgJSON.url}:${pkgJSON.port}`);
  });
});
