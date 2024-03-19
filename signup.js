var prompt = require("prompt-sync")();
var emailValidator = require("email-validator");
var ValidatePassword = require("validate-password");
const fs = require("fs");

let email;
let password;
let validEmail = false;
let validPassword = false;

var passwordValidator = new ValidatePassword();

do {
  email = prompt("Enter email address: ");
  validEmail = emailValidator.validate(email);
  if (!validEmail) {
    console.log("Please enter valid email address.");
  }
} while (!validEmail);

const allFileContents = fs.readFileSync("userCredentials.csv", "utf-8");
if (userExists(allFileContents, email)) {
  console.log(
    "There is already a user with this account. Please try a different one or sign in."
  );
} else {
  do {
    password = prompt("Choose strong password: ");
    let passwordData = passwordValidator.checkPassword(password);
    validPassword = passwordData.isValid;
    if (!validPassword) {
      console.log(
        "Password rejected because",
        passwordData.validationMessage.toLowerCase()
      );
    }
  } while (!validPassword);
  signUp(email, password);
}

function signUp(email, password) {
  const userIdPassword = `${email},${password}\n`;
  fs.appendFile("userCredentials.csv", userIdPassword, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("User registered successfully!");
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
