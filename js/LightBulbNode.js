// Copyright 2015-2020, University of Colorado Boulder

/**
 * Light bulb, made to 'glow' by modulating opacity of the 'on' image.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../dot/js/Utils.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Image from '../../scenery/js/nodes/Image.js';
import Node from '../../scenery/js/nodes/Node.js';
import offImage from '../mipmaps/light-bulb-off_png.js';
import onImage from '../mipmaps/light-bulb-on_png.js';
import LightRaysNode from './LightRaysNode.js';
import sceneryPhet from './sceneryPhet.js';

/**
 * @param {Property.<number>} brightnessProperty 0 (off) to 1 (full brightness)
 * @param {Object} [options]
 * @constructor
 */
function LightBulbNode( brightnessProperty, options ) {
  options = merge( {
    bulbImageScale: 0.33

    // any options in LightRaysNode.DEFAULT_OPTIONS may also be passed in
  }, options );

  const self = this;

  // @private
  self.onNode = new Image( onImage, {
    scale: options.bulbImageScale,
    centerX: 0,
    bottom: 0
  } ); // @private

  const offNode = new Image( offImage, {
    scale: options.bulbImageScale,
    centerX: self.onNode.centerX,
    bottom: self.onNode.bottom
  } );

  // rays
  const bulbRadius = offNode.width / 2; // use 'off' node, the 'on' node is wider because it has a glow around it.
  const rayOptions = _.pick( options, _.keys( LightRaysNode.DEFAULT_OPTIONS ) ); // cherry-pick options that are specific to rays
  rayOptions.x = this.onNode.centerX;
  rayOptions.y = offNode.top + bulbRadius;
  self.raysNode = new LightRaysNode( bulbRadius, rayOptions ); // @private

  options.children = [ self.raysNode, offNode, self.onNode ];
  Node.call( self, options );

  self.brightnessObserver = function( brightness ) { self.update(); }; // @private
  self.brightnessProperty = brightnessProperty; // @private
  self.brightnessProperty.link( this.brightnessObserver );

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'LightBulbNode', this );
}

sceneryPhet.register( 'LightBulbNode', LightBulbNode );

inherit( Node, LightBulbNode, {

  // @public Ensures that this object is eligible for GC
  dispose: function() {
    this.brightnessProperty.unlink( this.brightnessObserver );
    Node.prototype.dispose.call( this );
  },

  // @private
  update: function() {
    if ( this.visible ) {
      const brightness = this.brightnessProperty.value;
      assert && assert( brightness >= 0 && brightness <= 1 );
      this.onNode.visible = ( brightness > 0 );
      if ( this.onNode.visible ) {
        this.onNode.opacity = Utils.linear( 0, 1, 0.3, 1, brightness );
      }
      this.raysNode.setBrightness( brightness );
    }
  },

  // @override update when this node becomes visible
  setVisible: function( visible ) {
    const wasVisible = this.visible;
    Node.prototype.setVisible.call( this, visible );
    if ( !wasVisible && visible ) {
      this.update();
    }
  }
} );

export default LightBulbNode;