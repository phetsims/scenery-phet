// Copyright 2016-2020, University of Colorado Boulder

/**
 * Button that toggles between an open and closed eyeball, used to control the visibility of something.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import Node from '../../../scenery/js/nodes/Node.js';
import RectangularToggleButton from '../../../sun/js/buttons/RectangularToggleButton.js';
import FontAwesomeNode from '../../../sun/js/FontAwesomeNode.js';
import sceneryPhet from '../sceneryPhet.js';

class EyeToggleButton extends RectangularToggleButton {

  /**
   * @param {Property.<boolean>} eyeOpenProperty - true: eye is open; false: eye is closed
   * @param {Object} [options]
   */
  constructor( eyeOpenProperty, options ) {

    options = options || {};

    // icons
    const eyeOpenNode = new FontAwesomeNode( 'eye_open' );
    const eyeCloseNode = new FontAwesomeNode( 'eye_close', {
      center: eyeOpenNode.center
    } );

    // button content
    assert && assert( !options.content, 'EyeToggleButton sets content' );
    options.content = new Node( {
      children: [ eyeCloseNode, eyeOpenNode ]
    } );

    // toggle which icon is shown
    const eyeOpenObserver = eyeOpen => {
      eyeOpenNode.visible = eyeOpen;
      eyeCloseNode.visible = !eyeOpen;
    };
    eyeOpenProperty.link( eyeOpenObserver ); // unlink required by dispose

    super( true, false, eyeOpenProperty, options );

    // @private
    this.disposeEyeToggleButton = () => {
      eyeOpenProperty.unlink( eyeOpenObserver );
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'EyeToggleButton', this );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeEyeToggleButton();
    super.dispose();
  }
}

sceneryPhet.register( 'EyeToggleButton', EyeToggleButton );
export default EyeToggleButton;