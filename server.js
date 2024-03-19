const http = require("http");
const fs = require("fs");
const dotenv = require("dotenv");

const PORT = process.env.PORT || 3002;
dotenv.config();

const server = http.createServer((req, res) => {
  //handle GET request
  if (req.method === "GET") {
    fs.readFile("index.html", "utf-8", (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: -1, error: "cant load html file" }));
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });

    //handle POST request
  } else if (req.method === "POST") {
    if (req.url === "/api/signup" || req.url === "/api/signin") {
      let body = "";
      req.on("data", (data) => {
        body += data.toString();
        console.log(body);
      });
      req.on("end", () => {
        let reqBody;
        try {
          reqBody = JSON.parse(body);
          console.log(reqBody);
        } catch (err) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: -1, error: "invalid json" }));
          return;
        }

        if (req.url === "/api/signup") {
          const { email, password } = reqBody;
          if (!email || !password) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                status: -1,
                error: "require email and password",
              })
            );
            return;
          }
          const fileContent = fs.readFileSync("userCredentials.csv", "utf-8");
          if (userExists(fileContent, email)) {
            res.writeHead(409, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ status: -1, error: "user already exists" })
            );
          } else {
            signUp(email, password);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ status: 1, message: "sign up successful!!" })
            );
          }
        } else if (req.url === "/api/signin") {
          const { email, password } = reqBody;

          if (!email || !password) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                status: -1,
                error: "require email and password",
              })
            );
            return;
          }
          const fileContent = fs.readFileSync("userCredentials.csv", "utf-8");
          console.log(email);
          console.log(password);
          if (signIn(fileContent, email, password)) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ status: 1, message: "sign in successful!!" })
            );
          } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                status: -1,
                error: "invalid email or password",
              })
            );
          }
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: -1, error: "endpoint not found" }));
    }
  } else {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: -1, error: "wrong method" }));
  }
});

function signUp(email, password) {
  const userIdPassword = `${email},${password}\n`;
  fs.appendFile("userCredentials.csv", userIdPassword, (err) => {
    if (err) {
      return false;
    } else {
      return true;
    }
  });
}

function userExists(fileContents, userEmail) {
  let lines = fileContents.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    let lineContents = lines[i].split(",");
    if (lineContents[0] == userEmail) {
      return true;
    }
  }
  return false;
}

function signIn(fileContents, userEmail, userPassword) {
  let lines = fileContents.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    let lineContents = lines[i].split(",");
    if (lineContents[0] == userEmail && lineContents[1] == userPassword) {
      return true;
    }
  }
  return false;
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
