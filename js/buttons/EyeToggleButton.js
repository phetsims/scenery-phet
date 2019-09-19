// Copyright 2016-2019, University of Colorado Boulder

/**
 * Button that toggles between an open and closed eyeball, used to control the visibility of something.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InstanceRegistry = require( 'PHET_CORE/documentation/InstanceRegistry' );
  const Node = require( 'SCENERY/nodes/Node' );
  const RectangularToggleButton = require( 'SUN/buttons/RectangularToggleButton' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

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

  return inherit( RectangularToggleButton, EyeToggleButton, {

    // @public
    dispose: function() {
      this.disposeEyeToggleButton();
      RectangularToggleButton.prototype.dispose.call( this );
    }
  } );
} );
