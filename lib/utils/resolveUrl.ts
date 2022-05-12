import url from 'url';

export const resolveUrl = (from: string, to: string) => {
  url.resolve(from, to);
};
