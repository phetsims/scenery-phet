// Copyright 2016-2020, University of Colorado Boulder

/**
 * Button that toggles between an open and closed eyeball, used to control the visibility of something.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import inherit from '../../../phet-core/js/inherit.js';
import Node from '../../../scenery/js/nodes/Node.js';
import RectangularToggleButton from '../../../sun/js/buttons/RectangularToggleButton.js';
import FontAwesomeNode from '../../../sun/js/FontAwesomeNode.js';
import sceneryPhet from '../sceneryPhet.js';

/**
 * @param {Property.<boolean>} eyeOpenProperty - true: eye is open; false: eye is closed
 * @param {Object} [options]
 * @constructor
 */
function EyeToggleButton( eyeOpenProperty, options ) {

  options = options || {};

  // icons
  const eyeOpenNode = new FontAwesomeNode( 'eye_open' );
  const eyeCloseNode = new FontAwesomeNode( 'eye_close', {
    center: eyeOpenNode.center
  } );

  // button content
  assert && assert( !options.content );
  options.content = new Node( {
    children: [ eyeCloseNode, eyeOpenNode ]
  } );

  // toggle which icon is shown
  const eyeOpenObserver = function( eyeOpen ) {
    eyeOpenNode.visible = eyeOpen;
    eyeCloseNode.visible = !eyeOpen;
  };
  eyeOpenProperty.link( eyeOpenObserver ); // unlink required by dispose

  RectangularToggleButton.call( this, true, false, eyeOpenProperty, options );

  // @private
  this.disposeEyeToggleButton = function() {
    eyeOpenProperty.unlink( eyeOpenObserver );
  };

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'EyeToggleButton', this );
}

sceneryPhet.register( 'EyeToggleButton', EyeToggleButton );

export default inherit( RectangularToggleButton, EyeToggleButton, {

  // @public
  dispose: function() {
    this.disposeEyeToggleButton();
    RectangularToggleButton.prototype.dispose.call( this );
  }
} );