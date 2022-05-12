import cases from '~/libs/github/utils/cases';

export const MARKDOWN_EXTENSIONS = [
  '.markdown',
  '.mdown',
  '.mkdn',
  '.md',
  '.textile',
  '.rdoc',
  '.org',
  '.creole',
  '.mediawiki',
  '.wiki',
  '.rst',
  '.asciidoc',
  '.adoc',
  '.asc',
  '.pod',
  '.pod6',
];

export const ALTERNATIVE_README_NAMES = cases('readme', 'md').concat(
  cases('readme', 'markdown'),
  cases('readme', 'rst'),
);
