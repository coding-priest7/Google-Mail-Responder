
# Google mail Responder

A Node.js based app that is able to respond to emails sent to your Gmail mailbox while you’re out on a vacation. 


## Features

- The app checks for new emails in a given Gmail ID
- The app sends replies to Emails that have no prior replies
- The app adds a Label to the email and move the email to the label
- The app repeats this sequence of steps 1-3 in random intervals of 45 to 120 seconds


## Tech Stack Backend

**Server:** Node


## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm init
  npm install googleapis google-auth-library nodemailer
```

Start the server

```bash
  npm run start
```

For dev purposes

```bash
  npm install nodemon
```
after installing nodemon add the following to the scripts in package.json file

```bash
  "start": "nodemon ./src/index.js"
```
Run dev in CLI
```bash
  node index.js
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`CLIENT_ID`

`CLIENT_SECRET`

`REDIRECT_URI`

`REFRESH_TOKEN`

`GMAIL_ID`

To configure Environment Variables 

```bash
  npm install dotenv
```
## Documentation

[Gmail API](https://developers.google.com/gmail/api/guides)


## License


[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)



## Authors

- [@coding-priest7](https://github.com/coding-priest7)

