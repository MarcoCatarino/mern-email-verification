import { MailtrapClient } from "mailtrap";

import { ENV } from "./env.js";

export const mailtrapClient = new MailtrapClient({
  token: ENV.MAILTRAP_TOKEN,
  endpoint: ENV.MAILTRAP_ENDPOINT,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Tester",
};
