var prompt = require("prompt-sync")();
var emailValidator = require("email-validator");
const fs = require("fs");

let email;
let password;
let validEmail = false;

do {
  email = prompt("Enter email address: ");
  validEmail = emailValidator.validate(email);
  if (!validEmail) {
    console.log("Please enter valid email address.");
  }
} while (!validEmail);

password = prompt("Enter your password: ");

const allFileContents = fs.readFileSync("userCredentials.csv", "utf-8");

console.log(checkUserCredentials(allFileContents, email, password));

function checkUserCredentials(fileContents, userEmail, userPassword) {
  let lines = fileContents.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    let lineContents = lines[i].split(",");
    if (lineContents[0] == userEmail && lineContents[1] == userPassword) {
      return "Successfully logged in!";
    }
  }
  return "Login failed. Please check the email and password again.";
}
