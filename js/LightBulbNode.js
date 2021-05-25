// Copyright 2015-2021, University of Colorado Boulder

/**
 * Light bulb, made to 'glow' by modulating opacity of the 'on' image.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../dot/js/Utils.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import Image from '../../scenery/js/nodes/Image.js';
import Node from '../../scenery/js/nodes/Node.js';
import offImage from '../mipmaps/light-bulb-off_png.js';
import onImage from '../mipmaps/light-bulb-on_png.js';
import LightRaysNode from './LightRaysNode.js';
import sceneryPhet from './sceneryPhet.js';

class LightBulbNode extends Node {

  /**
   * @param {Property.<number>} brightnessProperty - brightness of the bulb, 0 (off) to 1 (full brightness)
   * @param {Object} [options]
   */
  constructor( brightnessProperty, options ) {

    options = merge( {
      bulbImageScale: 0.33

      // any options in LightRaysNode.DEFAULT_OPTIONS may also be passed in
    }, options );

    const onNode = new Image( onImage, {
      scale: options.bulbImageScale,
      centerX: 0,
      bottom: 0
    } ); // @private

    const offNode = new Image( offImage, {
      scale: options.bulbImageScale,
      centerX: onNode.centerX,
      bottom: onNode.bottom
    } );

    // rays
    const bulbRadius = offNode.width / 2; // use 'off' node, the 'on' node is wider because it has a glow around it.
    const rayOptions = _.pick( options, _.keys( LightRaysNode.DEFAULT_OPTIONS ) ); // cherry-pick options that are specific to rays
    rayOptions.x = onNode.centerX;
    rayOptions.y = offNode.top + bulbRadius;
    const raysNode = new LightRaysNode( bulbRadius, rayOptions ); // @private

    assert && assert( !options.children, 'LightBulbNode sets children' );
    options.children = [ raysNode, offNode, onNode ];

    super( options );

    // @private needed by other methods
    this.onNode = onNode;
    this.raysNode = raysNode;
    this.brightnessProperty = brightnessProperty;

    const brightnessObserver = brightness => this.update();
    brightnessProperty.link( brightnessObserver );

    // Updates this Node when it becomes visible.
    this.visibleProperty.link( visible => visible && this.update() );

    // @private
    this.disposeLightBulbNode = () => {
      brightnessProperty.unlink( brightnessObserver );
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'LightBulbNode', this );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeLightBulbNode();
    super.dispose();
  }

  /**
   * Updates the bulb. For performance, this is a no-op when the bulb is not visible.
   * @private
   */
  update() {
    if ( this.visible ) {
      const brightness = this.brightnessProperty.value;
      assert && assert( brightness >= 0 && brightness <= 1 );
      this.onNode.visible = ( brightness > 0 );
      if ( this.onNode.visible ) {
        this.onNode.opacity = Utils.linear( 0, 1, 0.3, 1, brightness );
      }
      this.raysNode.setBrightness( brightness );
    }
  }
}

sceneryPhet.register( 'LightBulbNode', LightBulbNode );
export default LightBulbNode;