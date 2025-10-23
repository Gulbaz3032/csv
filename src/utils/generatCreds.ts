export const randomString = (length = 8) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let s = "";
  for (let i = 0; i < length; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
};

export const generateEmail = (firstName: string, lastName: string) => {
  const domain = process.env.DEFAULT_EMAIL_DOMAIN || "example.com";
  const rand = Math.floor(1000 + Math.random() * 9000);
  const clean = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const email = `${clean(firstName)}.${clean(lastName)}.${rand}@${domain}`;
  return email;
};

export const generateTempPassword = () => {
  return randomString(10);
};
