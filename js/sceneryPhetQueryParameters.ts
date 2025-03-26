// Copyright 2016-2025, University of Colorado Boulder

/**
 * Query parameters for the scenery-phet demo application.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { QueryStringMachine } from '../../query-string-machine/js/QueryStringMachineModule.js';
import sceneryPhet from './sceneryPhet.js';

const sceneryPhetQueryParameters = QueryStringMachine.getAll( {

  // background color of the screens
  backgroundColor: {
    type: 'string', // CSS color format, e.g. 'green', 'ff8c00', 'rgb(255,0,255)'
    defaultValue: 'white'
  },

  // Should be a CSS font-family compatible string, see https://developer.mozilla.org/en-US/docs/Web/CSS/font-family
  fontFamily: {
    type: 'string',
    defaultValue: 'Arial'
  }
} );

sceneryPhet.register( 'sceneryPhetQueryParameters', sceneryPhetQueryParameters );

export default sceneryPhetQueryParameters;