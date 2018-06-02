export const createEmail =
  (domain: string = "example.com"): string => `${Math.floor(Math.random() * 100000)}@${domain}`;
