import { join } from 'path';
import regexParam from 'regexparam';
import isEmpty from 'lodash/isEmpty';
import { $fetch } from 'ohmyfetch';
import isMarkdownPathFunc from './utils/isMarkdownPath';

const githubBlobUrl = regexParam.parse('blob/:ref/*');

const exec = (
  path: string,
  result: {
    keys: string[];
    pattern: RegExp;
  },
): Record<string, unknown> => {
  let i = 0;
  const out: {
    [key: string]: unknown;
    [key: number]: unknown;
  } = {};
  const matches: RegExpExecArray | Record<string | number, unknown> =
    result.pattern.exec(path) || {};
  while (i < result.keys.length) {
    i += 1;
    out[result.keys[i]] = matches[i] || null;
  }
  return out;
};

export default ({
  isMarkdownPath,
  GITHUB_TOKEN,
  ALTERNATIVE_README_NAMES,
}: {
  isMarkdownPath: typeof isMarkdownPathFunc;
  GITHUB_TOKEN: string;
  ALTERNATIVE_README_NAMES: string[];
}) => {
  const fetchReadme = ({
    owner,
    repo,
    path,
    ref,
  }: {
    owner: string;
    repo: string;
    path: string;
    ref: string;
  }) => {
    return $fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${ref}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3.raw',
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      },
    );
  };

  const fetchRepo = async ({
    owner,
    repo,
  }: {
    owner: string;
    repo: string;
  }) => {
    const response = await $fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      },
    );

    return response.json();
  };

  const fetchReadmeFromSource = async ({
    owner,
    repo,
    ref,
    paths,
  }: {
    owner: string;
    repo: string;
    ref: string;
    paths: string[];
  }) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const path of paths) {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetchReadme({
        owner,
        repo,
        ref,
        path,
      });

      if (response.status === 200) {
        // eslint-disable-next-line no-await-in-loop
        const markdown = await response.text();
        return {
          markdown,
          path,
        };
      }
    }

    return {};
  };

  return async ({
    owner,
    repo,
    path = '',
  }: {
    owner: string;
    repo: string;
    path?: string;
  }) => {
    let ref;
    let mutablePath = `${path}`;
    let mutableRepo = `${repo}`;

    if (!isEmpty(mutablePath)) {
      const execResult = exec(`/${mutablePath}`, githubBlobUrl);
      if (execResult.ref) {
        ref = execResult.ref;
        mutablePath = mutablePath.replace(`blob/${ref}`, '');
      }
    } else if (mutableRepo.includes('@')) {
      [mutableRepo, ref] = mutableRepo.split('@');
    }

    const paths = isMarkdownPath(mutablePath)
      ? [mutablePath]
      : ALTERNATIVE_README_NAMES.map((readmeName) =>
          join(mutablePath, readmeName),
        );

    const info = await fetchRepo({
      owner,
      repo: mutableRepo,
    });
    if (!ref) ref = info.default_branch;

    const { markdown, path: inferPath } = await fetchReadmeFromSource({
      owner,
      repo,
      paths,
      ref,
    });
    const source = {
      path: inferPath,
      owner,
      repo,
      paths,
      ref,
    };

    return {
      markdown,
      source,
      ...info,
    };
  };
};
