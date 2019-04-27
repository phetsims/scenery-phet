// Copyright 2013-2018, University of Colorado Boulder

/**
 * A single- or double-headed arrow. This is a convenience class, most of the work is done in ArrowShape.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Aaron Davis
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowShape = require( 'SCENERY_PHET/ArrowShape' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {number} tailX
   * @param {number} tailY
   * @param {number} tipX
   * @param {number} tipY
   * @param {Object} [options]
   * @constructor
   */
  function ArrowNode( tailX, tailY, tipX, tipY, options ) {

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
      lineWidth: 1,
      tandem: Tandem.optional
    }, options );
    this.options = options; // @private

    Path.call( this, null );
    this.shapePoints = [];
    this.setTailAndTip( tailX, tailY, tipX, tipY );

    // things you're likely to mess up, add more as needed
    assert && assert( options.headWidth > options.tailWidth );

    this.mutate( options );
  }

  sceneryPhet.register( 'ArrowNode', ArrowNode );

  return inherit( Path, ArrowNode, {

    /**
     * Update the internal shapePoints array which is used to populate the points in the Shape instance.
     *
     * @private
     * @returns {boolean} true if the number of points in the array has changed, which would require building a new
     *                    shape instance.
     */
    updateShapePoints: function() {
      var numberOfPoints = this.shapePoints.length;
      this.shapePoints = ArrowShape.getArrowShapePoints( this.tailX, this.tailY, this.tipX, this.tipY, this.shapePoints, this.options );
      return this.shapePoints.length !== numberOfPoints;
    },

    /**
     * Initialize or update the shape. Only called if the number of points in the shape changes.
     * @private
     */
    updateShape: function() {

      var shape = new Shape();

      if ( this.shapePoints.length > 1 ) {
        shape.moveToPoint( this.shapePoints[ 0 ] );
        for ( var i = 1; i < this.shapePoints.length; i++ ) {
          shape.lineToPoint( this.shapePoints[ i ] );
        }
        shape.close();
      }

      this.shape = shape;
    },

    /**
     * Set the tail and tip locations to update the arrow shape
     * @public
     */
    setTailAndTip: function( tailX, tailY, tipX, tipY ) {

      // assert && assert( !(tailX === tipX && tailY === tipY), 'arrow should have different tail and tip' );

      this.tailX = tailX; // @public {read-only}
      this.tailY = tailY; // @public {read-only}
      this.tipX = tipX; // @public {read-only}
      this.tipY = tipY; // @public {read-only}

      var numberOfPointsChanged = this.updateShapePoints();

      // This bit of logic is to improve performance for the case where the Shape instance can be reused (if the number
      // of points in the array is the same)
      if ( !this.shape || numberOfPointsChanged ) {
        this.updateShape();
      }
      else {

        // This is the higher-performance case where the Shape instance can be reused
        this.shape.invalidatePoints();
      }
    },

    /**
     * Sets the tip location.
     * @param {number} tipX
     * @param {number} tipY
     * @public
     */
    setTip( tipX, tipY ) {
      this.setTailAndTip( this.tailX, this.tailY, tipX, tipY );
    },

    /**
     * @public
     * @param {number} tailWidth
     */
    setTailWidth: function( tailWidth ) {
      this.options.tailWidth = tailWidth;
      this.updateShapePoints();
      this.updateShape();
    },

    /**
     * @public - set whether the arrow has one triangle or two
     * @param {number} doubleHead
     */
    setDoubleHead: function( doubleHead ) {
      this.options.doubleHead = doubleHead;
      this.updateShapePoints();
      this.updateShape();
    }
  } );
} );
