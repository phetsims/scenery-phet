// Copyright 2024, University of Colorado Boulder
    
/* eslint-disable */
/* @formatter:off */

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */

import getFluentModule from '../../chipper/js/browser/getFluentModule.js';
import sceneryPhet from '../js/sceneryPhet.js';
import LocalizedMessageProperty from '../../chipper/js/LocalizedMessageProperty.js';

// TODO: Generate type safety for this.
type FluentStringsType = Record<string, LocalizedMessageProperty>;

const SceneryPhetStrings = getFluentModule( {
  "en": "first-string = First string",
  "fr": "some-content = Bonjour, monde!"
} ) as FluentStringsType;

sceneryPhet.register( 'SceneryPhetStrings', SceneryPhetStrings );

export default SceneryPhetStrings;
