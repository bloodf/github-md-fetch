import { ALTERNATIVE_README_NAMES } from './utils/constants';
import isMarkdownPath from './utils/isMarkdownPath';
import createFetchRepo from './fetchRepo';
import fetchMeta from './fetchRepoMeta';

const fetchRepo = (GITHUB_TOKEN: string) =>
  createFetchRepo({
    isMarkdownPath,
    GITHUB_TOKEN,
    ALTERNATIVE_README_NAMES,
  });

export { fetchMeta, fetchRepo, isMarkdownPath };
