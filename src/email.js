//importing the required modules
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const oAuth2Client = require("./oauth");
const dotenv = require("dotenv");

dotenv.config();
//declaring the email id for multiple use
const GMAIL_ID = process.env.GMAIL_ID;

//declaring an async function to check for new emails and send email when conditions are met
async function checkForNewEmails() {
  try {
    //calling the getAccessToken method of the oAuth2Client object.
    const accessToken = await oAuth2Client.getAccessToken();

    //his line creates a nodemailer transporter object using the createTransport method. It sets up a configuration object with the necessary details to send emails through the Gmail service.

    const transporter = nodemailer.createTransport({
      service: "gmail", //using SMTP to send emails

      //assigning OAuth2 authentication values
      auth: {
        type: "OAuth2",
        user: GMAIL_ID,
        clientId: oAuth2Client._cliendId,
        clientSecret: oAuth2Client._clientSecret,
        refreshToken: oAuth2Client.credentials.refresh_token,
        accessToken: oAuth2Client.credentials.access_token,
      },
    });

    //createing a Gmail API client using the google.gmail method
    const gmail = google.gmail({
      version: "v1",
      auth: oAuth2Client,
    });

    //retrieving a list of messages with given parameters

    const res = await gmail.users.messages.list({
      userId: "me", //user's own mailbox.
      q: "is:unread",
      maxResults: 1, // Only get unread messages
    });

    //extracting the messages property from the res.data object.
    const messages = res.data.messages || [];

    //pritning the messages
    console.log(messages);

    //iterating over each message in the array predefined

    for (const message of messages) {
      //calling the get method of the gmail.users.threads API to retrieve a specific thread's details
      const res = await gmail.users.threads.get({
        userId: "me",
        id: message.threadId, //current message ID
      });

      //assigning data property of res object
      const thread = res.data;

      //checking if any of the messages in the thread contain a reply.
      const isReply = thread.messages.some(
        (m) => m.labelIds.includes("SENT") && m.from.emailAddress === GMAIL_ID
      );

      //if it is not replied beforehand
      if (!isReply) {
        //creating a mailOptions object with the necessary details
        const mailOptions = {
          from: GMAIL_ID,
          to: thread.messages[0].payload.headers.find(
            (header) => header.name === "From"
          ).value,
          subject: "Thanks for your email",
          text: "I am still on vacation. Will get back to you soon !",
        };

        //sending the email
        const result = await transporter.sendMail(mailOptions);

        //printing the to see where the email is sent
        console.log(`Email sent to ${mailOptions.to}`);
        console.log(message.threadId);

        //storing the message ID to assign it to the label
        const messageId = res.data.messages[0].id;
        console.log(`Message ID: ${messageId}`);
        const labelName = "Replied";

        //calling the API to get the list of messages from the inbox.
        const response = await gmail.users.messages.list({
          userId: "me",
          maxResults: 1,
          q: "in:inbox ", // Only get messages from the inbox
        });

        //calling the API to get the list of labels associated with the user's mailbox.
        const labelsResponse = await gmail.users.labels.list({ userId: "me" });

        //searching for label ID with specified label name
        const labels = labelsResponse.data.labels;
        let labelId = null;
        for (let i = 0; i < labels.length; i++) {
          if (labels[i].name === labelName) {
            labelId = labels[i].id;
            break;
          }
        }
        //if label is not found, creating a new label
        if (!labelId) {
          const createLabelResponse = await gmail.users.labels.create({
            userId: "me",
            //request body specifies the details of the new label
            requestBody: {
              name: labelName,
              labelListVisibility: "labelShow",
              messageListVisibility: "show",
            },
          });
          // storing the label ID for the new label
          labelId = createLabelResponse.data.id;
        }
        //modifying the label for a specific message
        await gmail.users.messages.modify({
          userId: "me",
          id: messageId,
          //adding the new label and removing the old ones
          requestBody: {
            addLabelIds: [labelId],
            removeLabelIds: ["INBOX", "UNREAD"],
          },
        });
        //getting confirmation of whether the email is moved to replied or not
        console.log(`Email moved to replied`);
      }
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}
//exporting the whole module
module.exports = {
  checkForNewEmails,
};
