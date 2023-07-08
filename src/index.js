//This line imports the checkForNewEmails function from a module located in the ./email file.
const { checkForNewEmails } = require("./email");

//printing something to console to check if execution is going fine or not
console.log("App started !");

//This code block calls the checkForNewEmails function and handles the asynchronous response using promises.
checkForNewEmails()
  .then((result) => console.log("Email sent successfully !", result))
  .catch((error) => console.log(error.message));

//This line sets up a recurring timer using setInterval to call the checkForNewEmails function at a specified interval.
//The interval is set to a random value between 45 and 120 seconds.
setInterval(
  checkForNewEmails,
  Math.floor(Math.random() * (120000 - 45000 + 1) + 45000)
);
