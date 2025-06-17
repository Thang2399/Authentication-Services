export default () => ({
  email: {
    host: process.env.SEND_EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    user: process.env.AUTH_EMAIL_USER,
    pass: process.env.AUTH_EMAIL_PASSWORD,
  },
});