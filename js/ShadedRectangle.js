// Copyright 2014-2018, University of Colorado Boulder

/**
 * A rectangle with pseudo-3D shading.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PaintColorProperty = require( 'SCENERY/util/PaintColorProperty' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );

  /**
   * Creates a pseudo-3D shaded rounded rectangle that takes up rectBounds {Bounds2} in size. See below documentation
   * for options (it is passed through to the Node also).
   *
   * @param {Bounds2} rectBounds
   * @param {Object} [options]
   * @constructor
   */
  function ShadedRectangle( rectBounds, options ) {

    Node.call( this );

    options = _.extend( {
      // {ColorDef} default base color
      baseColor: new Color( 80, 130, 230 ),

      // {number} how much lighter the "light" parts (top and left) are
      lightFactor: 0.5,
      // {number} how much lighter is the top than the left
      lighterFactor: 0.1,
      // {number} how much darker the "dark" parts (bottom and right) are
      darkFactor: 0.5,
      // {number} how much darker the bottom is than the right
      darkerFactor: 0.1,
      // the radius of curvature at the corners (also determines the size of the faux-3D shading)
      cornerRadius: 10,

      lightSource: 'leftTop', // {string}, one of 'leftTop', 'rightTop', 'leftBottom', 'rightBottom',

      // {number} What fraction of the cornerRadius should the light and dark gradients extend into the rectangle?
      // Should always be less than 1.
      lightOffset: 0.525,
      darkOffset: 0.375
    }, options );

    assert && assert( options.lightSource === 'leftTop' ||
                      options.lightSource === 'rightTop' ||
                      options.lightSource === 'leftBottom' ||
                      options.lightSource === 'rightBottom',
      'The lightSource ' + options.lightSource + ' is not supported' );
    assert && assert( options.lightOffset < 1, 'options.lightOffset needs to be less than 1' );
    assert && assert( options.darkOffset < 1, 'options.darkOffset needs to be less than 1' );

    var lightFromLeft = options.lightSource.indexOf( 'left' ) >= 0;
    var lightFromTop = options.lightSource.indexOf( 'Top' ) >= 0;

    var cornerRadius = options.cornerRadius;

    // @private {Property.<Color>} - compute our colors (properly handle color-Property cases for baseColor)
    this.lighterPaint = new PaintColorProperty( options.baseColor, { luminanceFactor: options.lightFactor + options.lighterFactor } );
    this.lightPaint = new PaintColorProperty( options.baseColor, { luminanceFactor: options.lightFactor } );
    this.darkPaint = new PaintColorProperty( options.baseColor, { luminanceFactor: -options.darkFactor } );
    this.darkerPaint = new PaintColorProperty( options.baseColor, { luminanceFactor: -options.darkFactor - options.darkerFactor } );

    // change colors based on orientation
    var topColorProperty = lightFromTop ? this.lighterPaint : this.darkerPaint;
    var leftColorProperty = lightFromLeft ? this.lightPaint : this.darkPaint;
    var rightColorProperty = lightFromLeft ? this.darkPaint : this.lightPaint;
    var bottomColorProperty = lightFromTop ? this.darkerPaint : this.lighterPaint;

    // how far our light and dark gradients will extend into the rectangle
    var lightOffset = options.lightOffset * cornerRadius;
    var darkOffset = options.darkOffset * cornerRadius;

    // change offsets based on orientation
    var topOffset = lightFromTop ? lightOffset : darkOffset;
    var leftOffset = lightFromLeft ? lightOffset : darkOffset;
    var rightOffset = lightFromLeft ? darkOffset : lightOffset;
    var bottomOffset = lightFromTop ? darkOffset : lightOffset;

    // we layer two gradients on top of each other as the base (using the same rounded rectangle shape)
    var horizontalNode = Rectangle.roundedBounds( rectBounds, cornerRadius, cornerRadius, { pickable: false } );
    var verticalNode = Rectangle.roundedBounds( rectBounds, cornerRadius, cornerRadius, { pickable: false } );

    horizontalNode.fill = new LinearGradient( horizontalNode.left, 0, horizontalNode.right, 0 )
      .addColorStop( 0, leftColorProperty )
      .addColorStop( leftOffset / verticalNode.width, options.baseColor )
      .addColorStop( 1 - rightOffset / verticalNode.width, options.baseColor )
      .addColorStop( 1, rightColorProperty );

    verticalNode.fill = new LinearGradient( 0, verticalNode.top, 0, verticalNode.bottom )
      .addColorStop( 0, topColorProperty )
      .addColorStop( topOffset / verticalNode.height, new DerivedProperty( [ topColorProperty ], function( color ) {
        return color.withAlpha( 0 );
      } ) )
      .addColorStop( 1 - bottomOffset / verticalNode.height, new DerivedProperty( [ bottomColorProperty ], function( color ) {
        return color.withAlpha( 0 );
      } ) )
      .addColorStop( 1, bottomColorProperty );

    // shape of our corner (in this case, top-right)
    var cornerShape = new Shape().moveTo( 0, 0 )
      .arc( 0, 0, cornerRadius, -Math.PI / 2, 0, false )
      .close();
    // rotation needed to move the cornerShape into the proper orientation as the light corner (Math.PI more for dark corner)
    var lightCornerRotation = {
      leftTop:     -Math.PI / 2,
      rightTop: 0,
      rightBottom: Math.PI / 2,
      leftBottom: Math.PI
    }[ options.lightSource ];

    var innerBounds = rectBounds.eroded( cornerRadius );

    // since both the top and left are "lighter", we have a rounded gradient along that corner
    var lightCorner = new Path( cornerShape, {
      x: lightFromLeft ? innerBounds.minX : innerBounds.maxX,
      y: lightFromTop ? innerBounds.minY : innerBounds.maxY,
      rotation: lightCornerRotation,
      fill: new RadialGradient( 0, 0, 0, 0, 0, cornerRadius )
        .addColorStop( 0, options.baseColor )
        .addColorStop( 1 - lightOffset / cornerRadius, options.baseColor )
        .addColorStop( 1, this.lighterPaint ),
      pickable: false
    } );

    // since both the bottom and right are "darker", we have a rounded gradient along that corner
    var darkCorner = new Path( cornerShape, {
      x: lightFromLeft ? innerBounds.maxX : innerBounds.minX,
      y: lightFromTop ? innerBounds.maxY : innerBounds.minY,
      rotation: lightCornerRotation + Math.PI, // opposite direction from our light corner
      fill: new RadialGradient( 0, 0, 0, 0, 0, cornerRadius )
        .addColorStop( 0, options.baseColor )
        .addColorStop( 1 - darkOffset / cornerRadius, options.baseColor )
        .addColorStop( 1, this.darkerPaint ),
      pickable: false
    } );

    // the stroke around the outside
    var panelStroke = Rectangle.roundedBounds( rectBounds, cornerRadius, cornerRadius, {
      stroke: new DerivedProperty( [ rightColorProperty ], function( color ) {
        return color.withAlpha( 0.4 );
      } )
    } );

    // layout
    this.addChild( horizontalNode );
    this.addChild( verticalNode );
    this.addChild( lightCorner );
    this.addChild( darkCorner );
    this.addChild( panelStroke ); // NOTE: this is the pickable child used for hit testing. Ensure something is pickable.

    this.mutate( options );
  }

  sceneryPhet.register( 'ShadedRectangle', ShadedRectangle );

  return inherit( Node, ShadedRectangle, {
    /**
     * Releases references.
     * @public
     * @override
     */
    dispose: function() {
      this.lighterPaint.dispose();
      this.lightPaint.dispose();
      this.darkPaint.dispose();
      this.darkerPaint.dispose();

      Node.prototype.dispose.call( this );
    }
  } );
} );

