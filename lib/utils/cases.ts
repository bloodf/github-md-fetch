import capitalize from 'lodash/capitalize';

export default (name: string, ext: string) => [
  `${name.toUpperCase()}.${ext}`,
  `${name}.${ext}`,
  `${capitalize(name)}.${ext}`,
];
