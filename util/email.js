import { google } from "googleapis";
import path from "path";

const sendEmail = function () {
  const sgMail = require("@sendgrid/mail");

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const name = "John Doe";

  const msg = {
    to: "milesthedisch@gmail.com", // Change to your recipient
    from: "miles@balmoral.digital", // Change to your verified sender
    templateId: "d-3022e8d9421d45e090c159945290fc5a",
    dynamicTemplateData: {
      subject: `Hey ${name}, you've been invited.`,
      name,
    },
  };
};

export default sendEmail;
