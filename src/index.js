const { checkForNewEmails } = require("./email");

console.log("Executing...");

checkForNewEmails()
  .then((result) => console.log("Email sent...", result))
  .catch((error) => console.log(error.message));

setInterval(
  checkForNewEmails,
  Math.floor(Math.random() * (120000 - 45000 + 1) + 45000)
);
