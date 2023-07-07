const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const oAuth2Client = require("./oauth");

const GMAIL_ID = "sandeep17goswami@gmail.com";
async function checkForNewEmails() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: GMAIL_ID,
        clientId: oAuth2Client._cliendId,
        clientSecret: oAuth2Client._clientSecret,
        refreshToken: oAuth2Client.credentials.refresh_token,
        accessToken: oAuth2Client.credentials.access_token,
      },
    });
    // console.log(oAuth2Client);
    const gmail = google.gmail({
      version: "v1",
      auth: oAuth2Client,
    });

    const res = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
      maxResults: 1, // Only get unread messages
    });
    const messages = res.data.messages || [];
    console.log(messages);
    for (const message of messages) {
      const res = await gmail.users.threads.get({
        userId: "me",
        id: message.threadId,
      });
      const thread = res.data;
      const isReply = thread.messages.some(
        (m) =>
          m.labelIds.includes("SENT") &&
          m.from.emailAddress === "sandeep17goswami@gmail.com"
      );
      if (!isReply) {
        const mailOptions = {
          from: GMAIL_ID,
          to: thread.messages[0].payload.headers.find(
            (header) => header.name === "From"
          ).value,
          subject: "Thanks for your email",
          text: "hello back !!!!",
        };
        const result = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${mailOptions.to}`);
        console.log(message.threadId);

        const messageId = res.data.messages[0].id;
        console.log(`Message ID: ${messageId}`);
        const labelName = "Replied";

        const response = await gmail.users.messages.list({
          userId: "me",
          maxResults: 1,
          q: "in:inbox", // Only get messages from the inbox
        });

        const labelsResponse = await gmail.users.labels.list({ userId: "me" });
        const labels = labelsResponse.data.labels;
        let labelId = null;
        for (let i = 0; i < labels.length; i++) {
          if (labels[i].name === labelName) {
            labelId = labels[i].id;
            break;
          }
        }

        if (!labelId) {
          const createLabelResponse = await gmail.users.labels.create({
            userId: "me",
            requestBody: {
              name: labelName,
              labelListVisibility: "labelShow",
              messageListVisibility: "show",
            },
          });
          labelId = createLabelResponse.data.id;
        }

        await gmail.users.messages.modify({
          userId: "me",
          id: messageId,
          requestBody: {
            addLabelIds: [labelId],
            removeLabelIds: ["INBOX", "UNREAD"],
          },
        });

        console.log(`Email moved to replied`);
      }
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

module.exports = {
  checkForNewEmails,
};
