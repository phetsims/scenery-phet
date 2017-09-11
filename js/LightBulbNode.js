// Copyright 2015-2017, University of Colorado Boulder

/**
 * Light bulb, made to 'glow' by modulating opacity of the 'on' image.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightRaysNode = require( 'SCENERY_PHET/LightRaysNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Util = require( 'DOT/Util' );

  // images
  var offImage = require( 'mipmap!SCENERY_PHET/light-bulb-off.png' );
  var onImage = require( 'mipmap!SCENERY_PHET/light-bulb-on.png' );

  /**
   * @param {Property.<number>} brightnessProperty 0 (off) to 1 (full brightness)
   * @param {Object} [options]
   * @constructor
   */
  function LightBulbNode( brightnessProperty, options ) {
    Tandem.indicateUninstrumentedCode();

    options = _.extend( {
      bulbImageScale: 0.33

      // any options in LightRaysNode.DEFAULT_OPTIONS may also be passed in
    }, options );

    var self = this;

    // @private
    self.onNode = new Image( onImage, {
      scale: options.bulbImageScale,
      centerX: 0,
      bottom: 0
    } ); // @private

    var offNode = new Image( offImage, {
      scale: options.bulbImageScale,
      centerX: self.onNode.centerX,
      bottom: self.onNode.bottom
    } );

    // rays
    var bulbRadius = offNode.width / 2; // use 'off' node, the 'on' node is wider because it has a glow around it.
    var rayOptions = _.pick( options, _.keys( LightRaysNode.DEFAULT_OPTIONS ) ); // cherry-pick options that are specific to rays
    rayOptions.x = this.onNode.centerX;
    rayOptions.y = offNode.top + bulbRadius;
    self.raysNode = new LightRaysNode( bulbRadius, rayOptions ); // @private

    options.children = [ self.raysNode, offNode, self.onNode ];
    Node.call( self, options );

    self.brightnessObserver = function( brightness ) { self.update(); }; // @private
    self.brightnessProperty = brightnessProperty; // @private
    self.brightnessProperty.link( this.brightnessObserver );
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
        var brightness = this.brightnessProperty.value;
        assert && assert( brightness >= 0 && brightness <= 1 );
        this.onNode.visible = ( brightness > 0 );
        if ( this.onNode.visible ) {
          this.onNode.opacity = Util.linear( 0, 1, 0.3, 1, brightness );
        }
        this.raysNode.setBrightness( brightness );
      }
    },

    // @override update when this node becomes visible
    setVisible: function( visible ) {
      var wasVisible = this.visible;
      Node.prototype.setVisible.call( this, visible );
      if ( !wasVisible && visible ) {
        this.update();
      }
    }
  } );

  return LightBulbNode;
} );