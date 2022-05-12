import { shortnameToUnicode } from 'emojione';
import { get } from 'lodash';

const mapMeta = async (
  info: Record<string, unknown>,
  { path, ref }: { path: string; ref: string },
) => {
  const repoUrl = get(info, 'html_url');
  const issues = get(info, 'open_issues');
  const stars = get(info, 'stargazers_count');
  const updatedAt = get(info, 'pushed_at', 'updated_at');
  const license = get(info, 'license.spdx_id');
  const licenseUrl = get(info, 'license.url');
  const description = (get(info, 'description') as string) || '';

  return {
    githubUrl: `${repoUrl}/tree/${ref}/${path}`,
    description: shortnameToUnicode(description),
    owner: get(info, 'owner.login'),
    repo: get(info, 'name'),
    logo: get(info, 'owner.avatar_url'),
    license: license && licenseUrl ? license : undefined,
    licenseUrl:
      license && licenseUrl
        ? (licenseUrl as string).replace(
            'https://api.github.com',
            'https://choosealicense.com',
          )
        : undefined,
    stars,
    issues,
    starsUrl: `${repoUrl}/stargazers`,
    issuesUrl: `${repoUrl}/issues`,
    watchers: get(info, 'watchers_count'),
    forks: get(info, 'forks_count'),
    updatedAt: new Date(updatedAt as string),
    activityUrl: `${repoUrl}/commits/${ref}`,
  };
};

export default async ({
  source,
  info,
}: {
  source: { path: string; ref: string };
  info: Record<string, unknown>;
}) => mapMeta(info, source);
