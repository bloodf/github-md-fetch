import { extname } from 'path';
import { MARKDOWN_EXTENSIONS } from './constants';

export default (path: string) => MARKDOWN_EXTENSIONS.includes(extname(path));
