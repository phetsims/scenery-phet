// Copyright 2015-2018, University of Colorado Boulder

/**
 * A spinnable busy indicator, to indicate something behind the scenes is in progress (but with no indication of how
 * far along it is).
 *
 * The actual rectangles/circles/etc. (called elements in the documentation) stay in fixed positions, but their fill is
 * changed to give the impression of rotation.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PaintColorProperty = require( 'SCENERY/util/PaintColorProperty' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Object} options
   * @constructor
   */
  function SpinningIndicatorNode( options ) {
    Tandem.indicateUninstrumentedCode();

    // default options
    options = _.extend( {
      indicatorSize: 15, // {number} - The width/height taken up by the indicator.
      indicatorSpeed: 1, // {number} - A multiplier for how fast/slow the indicator will spin.
      elementFactory: SpinningIndicatorNode.rectangleFactory, // {function( options ) => {Node}} - To create the elements
      elementQuantity: 16, // {number} - How many elements should exist
      activeColor: 'rgba(0,0,0,1)', // {string|Color} - The active "mostly visible" color at the lead.
      inactiveColor: 'rgba(0,0,0,0.15)' // {string|Color} - The inactive "mostly invisible" color at the tail.
    }, options );
    this.options = options;

    Node.call( this, options );

    this.indicatorRotation = Math.PI * 2; // @private Current angle of rotation (starts at 2pi so our modulo opreation is safe below)

    // parse the colors (if necessary) so we can quickly interpolate between the two
    this.activeColorProperty = new PaintColorProperty( options.activeColor ); // @private
    this.inactiveColorProperty = new PaintColorProperty( options.inactiveColor ); // @private

    // @private the angle between each element
    this.angleDelta = 2 * Math.PI / options.elementQuantity;

    // @private create and add all of the elements
    this.elements = [];
    var angle = 0;
    for ( var i = 0; i < options.elementQuantity; i++ ) {
      var element = options.elementFactory( this.options );

      // push the element to the outside of the circle
      element.right = options.indicatorSize / 2;

      // center it vertically, so it can be rotated nicely into place
      element.centerY = 0;

      // rotate each element by its specific angle
      element.rotate( angle, true );

      angle += this.angleDelta;
      this.elements.push( element );
      this.addChild( element );
    }

    this.step( 0 ); // initialize colors
  }

  sceneryPhet.register( 'SpinningIndicatorNode', SpinningIndicatorNode );

  return inherit( Node, SpinningIndicatorNode, {

    // @public
    step: function( dt ) {
      // increment rotation based on DT
      this.indicatorRotation += dt * 10.0 * this.options.indicatorSpeed;

      // update each element
      var angle = this.indicatorRotation;
      for ( var i = 0; i < this.elements.length; i++ ) {
        // a number from 0 (active head) to 1 (inactive tail).
        var ratio = Math.pow( ( angle / ( 2 * Math.PI ) ) % 1, 0.5 );

        // Smoother transition, mapping our ratio from [0,0.2] => [1,0] and [0.2,1] => [0,1].
        // Otherwise, elements can instantly switch from one color to the other, which is visually displeasing.
        if ( ratio < 0.2 ) {
          ratio = 1 - ratio * 5;
        }
        else {
          ratio = ( ratio - 0.2 ) * 10 / 8;
        }

        // Fill it with the interpolated color
        var red = ratio * this.inactiveColorProperty.value.red + ( 1 - ratio ) * this.activeColorProperty.value.red;
        var green = ratio * this.inactiveColorProperty.value.green + ( 1 - ratio ) * this.activeColorProperty.value.green;
        var blue = ratio * this.inactiveColorProperty.value.blue + ( 1 - ratio ) * this.activeColorProperty.value.blue;
        var alpha = ratio * this.inactiveColorProperty.value.alpha + ( 1 - ratio ) * this.activeColorProperty.value.alpha;
        this.elements[i].fill = new Color( red, green, blue, alpha );

        // And rotate to the next element (in the opposite direction, so our motion is towards the head)
        angle -= this.angleDelta;
      }
    },

    /**
     * Releases references.
     * @public
     * @override
     */
    dispose: function() {
      this.activeColorProperty.dispose();
      this.inactiveColorProperty.dispose();

      Node.prototype.dispose.call( this );
    }
  }, {
    // @static Factory method for creating rectangular-shaped elements, sized to fit.
    rectangleFactory: function( options ) {
      return new Rectangle( 0, 0, options.indicatorSize * 0.175, 1.2 * options.indicatorSize / options.elementQuantity );
    },

    // @static Factory method for creating circle-shaped elements, sized to fit.
    circleFactory: function( options ) {
      return new Circle( 0.8 * options.indicatorSize / options.elementQuantity );
    }
  } );
} );
