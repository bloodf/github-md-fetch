import { URL } from 'url';

export const isGithubUrl = (url: string) => {
  try {
    return new URL(url).hostname === 'github.com';
  } catch (err) {
    return false;
  }
};
