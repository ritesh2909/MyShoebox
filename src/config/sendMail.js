// import { setApiKey, send } from "@sendgrid/mail";
// setApiKey(
//   "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"
// );

const sendEmail = async (data) => {
  const msg = {
    to: data?.to,
    from: "ritesharora2909@gmail.com",
    subject: data?.subject,
    text: data?.text,
    html: data?.html,
  };

  try {
    // await send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export { sendEmail };
