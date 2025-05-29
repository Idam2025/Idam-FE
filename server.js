const fs = require("fs");
const https = require("https");
const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(__dirname + "/localhost-key.pem"),
  cert: fs.readFileSync(__dirname + "/localhost.pem"),
};

app.prepare().then(() => {
  const server = express();

  // Next.js가 처리하지 않는 API 경로가 있을 경우 대비 (필요 없으면 생략 가능)
  server.get("/api/*", (req, res) => {
    return handle(req, res);
  });

  // Next.js의 모든 페이지 라우팅 처리
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  https.createServer(httpsOptions, server).listen(3000, () => {
    console.log("✅ HTTPS server ready on https://localhost:3000");
  });
});
