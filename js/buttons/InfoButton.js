// Copyright 2018-2020, University of Colorado Boulder

/**
 * Standard PhET button for 'info', uses the international symbol for 'information'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import RoundPushButton from '../../../sun/js/buttons/RoundPushButton.js';
import FontAwesomeNode from '../../../sun/js/FontAwesomeNode.js';
import sceneryPhet from '../sceneryPhet.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function InfoButton( options ) {

  options = merge( {
    minXMargin: 10,
    minYMargin: 10,
    touchAreaXDilation: 10,
    touchAreaYDilation: 5,
    baseColor: 'rgb( 238, 238, 238 )',
    iconFill: 'black'
  }, options );

  assert && assert( !options.content, 'InfoButton sets content' );
  options.content = new FontAwesomeNode( 'info_circle', {
    fill: options.iconFill
  } );

  RoundPushButton.call( this, options );

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'InfoButton', this );
}

sceneryPhet.register( 'InfoButton', InfoButton );

inherit( RoundPushButton, InfoButton );
export default InfoButton;