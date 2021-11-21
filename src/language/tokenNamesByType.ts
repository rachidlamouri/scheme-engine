import fs from 'fs';

const tokenConfig = fs.readFileSync('./src/language/compiled/SchemeLexer.tokens', 'utf8');

export const tokenNamesByType = (
  tokenConfig.split('\n')
    .filter((line) => line !== '')
    .map((line) => line.replace(/\r/g, ''))
    .map((line) => line.split('='))
    .reduce(
      (valuesByKey, [name, value]) => {
        // some tokens types repeat, so we don't want to overwrite the more descriptive value
        if (valuesByKey[value] === undefined) {
          valuesByKey[value] = name;
        }

        return valuesByKey;
      },
      {} as Record<string, string>,
    )
);
