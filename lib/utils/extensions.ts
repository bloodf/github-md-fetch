// @ts-ignore
import fileExtension from 'file-extension';
import url from 'url';

export const extension = (str = '') => {
  const urlObj = url.parse(str);
  urlObj.hash = '';
  urlObj.search = '';
  return fileExtension(url.format(urlObj));
};
