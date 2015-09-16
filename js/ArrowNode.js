// Copyright 2002-2013, University of Colorado Boulder

/**
 * A single- or double-headed arrow. This is a convenience class, most of the
 * work is done in ArrowShape.
 *
 * @author John Blanco
 * @author Chris Malley
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // Imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {number} tailX
   * @param {number} tailY
   * @param {number} tipX
   * @param {number} tipY
   * @param {Object} [options]
   * @constructor
   */
  function ArrowNode( tailX, tailY, tipX, tipY, options ) {

    this.shapeInitialized = false; // @private

    // default options
    options = _.extend( {
      headHeight: 10,
      headWidth: 10,
      tailWidth: 5,
      isHeadDynamic: false,
      scaleTailToo: false,
      fractionalHeadHeight: 0.5, // head will be scaled when head size is less than fractionalHeadHeight * arrow length
      doubleHead: false, // true puts heads on both ends of the arrow, false puts a head at the tip
      fill: 'black',
      stroke: 'black',
      lineWidth: 1
    }, options );

    this.arrowShape = new Shape();
    this.shapePoints = []; // store all of the shape points here so they can be mutated
    Path.call( this, this.arrowShape, options );

    // if the arrow has dimensions describe the shape now, otherwise wait until later
    if ( tipX !== tailX || tipY !== tailY ) {
      this.computeArrowShapePoints( tailX, tailY, tipX, tipY, options );
      this.describeShape();
    }

    // things you're likely to mess up, add more as needed
    assert && assert( options.headWidth > options.tailWidth );

    this.options = options;
  }

  return inherit( Path, ArrowNode, {

    /**
     * Called only once to describe the initial shape. This method is needed since some sims like pendulum-lab
     * and gravity-and-orbits have a pattern of initializing ArrowNodes with new ArrowNode( 0, 0, 0, 0 ), which
     * wouldn't work to draw the shape immediately.
     * @private
     */
    describeShape: function() {
      var thisNode = this;
      this.arrowShape.moveToPoint( this.shapePoints[ 0 ] );
      var tail = _.tail( this.shapePoints );
      _.each( tail, function( element ) {
        thisNode.arrowShape.lineToPoint( element );
      } );
      this.arrowShape.close();
      this.shapeInitialized = true;
    },

    // Set the tail and tip locations to update the arrow shape
    // @public
    setTailAndTip: function( tailX, tailY, tipX, tipY ) {
      if ( tipX !== tailX || tipY !== tailY ) {
        this.computeArrowShapePoints( tailX, tailY, tipX, tipY, this.options );
        if ( !this.shapeInitialized ) {
          this.describeShape();
        }
        else {
          this.arrowShape.invalidatePoints();
        }
      }
    },

    /**
     * @private
     * @param tailX
     * @param tailY
     * @param tipX
     * @param tipY
     * @param options
     * @returns {Array}
     */
    computeArrowShapePoints: function( tailX, tailY, tipX, tipY, options ) {

      var vector = new Vector2( tipX - tailX, tipY - tailY );
      var xHatUnit = vector.normalized();
      var yHatUnit = xHatUnit.rotated( Math.PI / 2 );
      var length = vector.magnitude();

      // scale down the head if head is dynamic.
      var headWidth = options.headWidth;
      var headHeight = options.headHeight;
      var tailWidth = options.tailWidth;
      if ( options.isHeadDynamic ) {
        if ( length < options.headHeight / options.fractionalHeadHeight ) {
          headHeight = length * options.fractionalHeadHeight;
          if ( options.scaleTailToo ) {
            tailWidth = options.tailWidth * headHeight / options.headHeight;
            headWidth = options.headWidth * headHeight / options.headHeight;
          }
        }
        else {
          // nothing to do; headHeight is already large enough, and previously computed values will be correct.
        }
      }
      // otherwise, just make sure that head height is less than arrow length
      else {
        headHeight = Math.min( options.headHeight, options.doubleHead ? 0.35 * length : 0.99 * length );
      }

      var index = 0;
      var initializing = this.shapePoints.length === 0;
      var shapePoints = this.shapePoints;

      // Set up a coordinate frame that goes from the tail of the arrow to the tip.
      // Either create a new vector or mutate the existing one if it exists
      var getPoint = function( xHat, yHat ) {
        var x = xHatUnit.x * xHat + yHatUnit.x * yHat + tailX;
        var y = xHatUnit.y * xHat + yHatUnit.y * yHat + tailY;
        if ( initializing ) {
          shapePoints.push( new Vector2( x, y ) );
        }
        else {
          shapePoints[ index ].x = x;
          shapePoints[ index ].y = y;
          index++;
        }
      };

      // Compute points for single- or double-headed arrow
      if ( options.doubleHead ) {
        getPoint( 0, 0 );
        getPoint( headHeight, headWidth / 2 );
        getPoint( headHeight, tailWidth / 2 );
      }
      else {
        getPoint( 0, tailWidth / 2 );
      }
      getPoint( length - headHeight, tailWidth / 2 );
      getPoint( length - headHeight, headWidth / 2 );
      getPoint( length, 0 );
      getPoint( length - headHeight, -headWidth / 2 );
      getPoint( length - headHeight, -tailWidth / 2 );
      if ( options.doubleHead ) {
        getPoint( headHeight, -tailWidth / 2 );
        getPoint( headHeight, -headWidth / 2 );
      }
      else {
        getPoint( 0, -tailWidth / 2 );
      }
    }
  } );
} );
