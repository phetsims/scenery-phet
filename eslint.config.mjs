// Copyright 2024, University of Colorado Boulder

/**
 * ESLint configuration for scenery-phet.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import phetLibraryEslintConfig from '../perennial-alias/js/eslint/config/phet-library.eslint.config.mjs';

export default [
  ...phetLibraryEslintConfig,
  {
    languageOptions: {
      globals: {
        katex: 'readonly'
      }
    }
  },
  {
    files: [ '**/*.ts' ],
    rules: {
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-check': true,
          'ts-nocheck': true
        }
      ]
    }
  }
];