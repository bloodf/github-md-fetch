import isRelativeUrl from 'is-relative-url';
import url from 'url';
import { isGithubUrl } from './isGithubUrl';

export const resolveAssetUrl: (
  src: string,
  options: { path: string; owner: string; repo: string; ref: string },
) => string = (src, { path, owner, repo, ref }) => {
  const slug = `${owner}/${repo}`;
  let mutablePath = `${path}`;
  let mutableSrc = `${src}`;

  if (!mutablePath.startsWith('/')) mutablePath = `/${path}`;

  if (isRelativeUrl(mutableSrc)) {
    const base = `https://raw.githubusercontent.com/${slug}/${ref}${path}`;
    if (mutableSrc.startsWith('/')) mutableSrc = mutableSrc.substring(1);
    return url.resolve(base, mutableSrc);
  }

  if (!isGithubUrl(mutableSrc)) return mutableSrc;

  return mutableSrc
    .replace('github.com', 'raw.githubusercontent.com')
    .replace('blob/', '');
};
