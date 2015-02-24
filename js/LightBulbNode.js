// Copyright 2002-2014, University of Colorado Boulder

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
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Util = require( 'DOT/Util' );

  // images
  var onImage = require( 'image!SCENERY_PHET/light-bulb-on.png' );
  var offImage = require( 'image!SCENERY_PHET/light-bulb-off.png' );

  // constants, these are specific to bulb images
  var RAYS_START_ANGLE = 3 * Math.PI / 4;
  var RAYS_ARC_ANGLE = 3 * Math.PI / 2;

  /**
   * @param {Property.<number>} brightnessProperty 0 (off) to 1 (full brightness)
   * @param {Object} [options]
   * @constructor
   */
  function LightBulbNode( brightnessProperty, options ) {

    var defaultOptions = {
      bulbImageScale: 0.33,
      rayStroke: 'yellow',
      minRays: 8,
      maxRays: 60,
      minRayLength: 0,
      maxRayLength: 200,
      longRayLineWidth: 1.5, // for long rays
      mediumRayLineWidth: 1, // for medium-length rays
      shortRayLineWidth: 0.5 // for short rays
    };

    options = _.extend( {}, defaultOptions, options ); // don't modify defaultOptions!

    var thisNode = this;

    thisNode.onNode = new Image( onImage, {
      scale: options.bulbImageScale,
      centerX: 0,
      bottom: 0
    } ); // @private

    var offNode = new Image( offImage, {
      scale: options.bulbImageScale,
      centerX: thisNode.onNode.centerX,
      bottom: thisNode.onNode.bottom
    } );

    // rays
    var bulbRadius = offNode.width / 2; // use 'off' node, the 'on' node is wider because it has a glow around it.
    var rayOptions = _.pick( options, _.keys( defaultOptions ) ); // cherry-pick options that are specific to rays
    rayOptions.x = this.onNode.centerX;
    rayOptions.y = offNode.top + bulbRadius;
    thisNode.raysNode = new LightRaysNode( bulbRadius, rayOptions ); // @private

    options.children = [ thisNode.raysNode, offNode, thisNode.onNode ];
    Node.call( thisNode, options );

    thisNode.brightnessObserver = function( brightness ) { thisNode.update(); }; // @private
    thisNode.brightnessProperty = brightnessProperty; // @private
    thisNode.brightnessProperty.link( this.brightnessObserver );
  }

  inherit( Node, LightBulbNode, {

    // Ensures that this object is eligible for GC
    dispose: function() {
      this.brightnessProperty.unlink( this.brightnessObserver );
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

  /**
   * Rays of light that come out of the light bulb.
   * @param {number} bulbRadius
   * @param {Object} [options]
   * @constructor
   */
  function LightRaysNode( bulbRadius, options ) {

    assert && assert( bulbRadius > 0 );
    assert && assert( options ); // assumes that options are properly populated by LightBulbNode

    this.bulbRadius = bulbRadius; //@private
    this.options = options; // @private

    Node.call( this, options );

    // @private pre-calculate reusable rays {Line}
    this.cachedLines = [];
    for ( var i = options.maxRays; i--; ) {
      this.cachedLines[ i ] = new Line( 0, 0, 0, 0, { stroke: options.rayStroke } );
      this.addChild( this.cachedLines[ i ] );
    }
  }

  inherit( Node, LightRaysNode, {

    // updates light rays based on brightness, which varies from 0 to 1.
    setBrightness: function( brightness ) {

      assert && assert( brightness >= 0 && brightness <= 1 );

      // local vars to improve readability
      var minRays = this.options.minRays;
      var maxRays = this.options.maxRays;
      var minRayLength = this.options.minRayLength;
      var maxRayLength = this.options.maxRayLength;

      // number of rays is a function of brightness
      var numberOfRays = ( brightness === 0 ) ? 0 : minRays + Math.round( brightness * ( maxRays - minRays ) );
      // ray length is a function of brightness
      var rayLength = minRayLength + ( brightness * ( maxRayLength - minRayLength ) );

      var angle = RAYS_START_ANGLE;
      var deltaAngle = RAYS_ARC_ANGLE / ( numberOfRays - 1 );

      // Pick one of 3 pre-allocated ray widths.
      var lineWidth = this.options.shortRayLineWidth;
      if ( rayLength > ( 0.6 * maxRayLength ) ) {
        lineWidth = this.options.longRayLineWidth;
      }
      else if ( rayLength > ( 0.3 * maxRayLength ) ) {
        lineWidth = this.options.shortRayLineWidth;
      }

      // rays fill part of a circle, incrementing clockwise
      for ( var i = 0, x1, x2, y1, y2; i < maxRays; i++ ) {
        if ( i < numberOfRays ) {

          // determine the end points of the ray
          x1 = Math.cos( angle ) * this.bulbRadius;
          y1 = Math.sin( angle ) * this.bulbRadius;
          x2 = Math.cos( angle ) * ( this.bulbRadius + rayLength );
          y2 = Math.sin( angle ) * ( this.bulbRadius + rayLength );

          // set properties of line from the cache
          this.cachedLines[ i ].visible = true;
          this.cachedLines[ i ].lineWidth = lineWidth;
          this.cachedLines[ i ].setLine( x1, y1, x2, y2 );

          // increment the angle
          angle += deltaAngle;
        }
        else {
          // hide unusable lined
          this.cachedLines[ i ].visible = false;
        }
      }
    }
  } );

  return LightBulbNode;
} );
