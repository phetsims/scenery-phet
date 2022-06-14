// Copyright 2019-2022, University of Colorado Boulder

/**
 * A data structure that holds a string in its lowercase and capitalized form. For example, 'more' and 'More'.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import sceneryPhet from '../sceneryPhet.js';

export default class StringCasingPair {

  public readonly lowercase: string;
  public readonly capitalized: string;

  public constructor( lowercase: string, capitalized: string ) {
    this.lowercase = lowercase;
    this.capitalized = capitalized;
  }
}

sceneryPhet.register( 'StringCasingPair', StringCasingPair );