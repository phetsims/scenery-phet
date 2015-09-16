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

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var ArrowShape = require( 'SCENERY_PHET/ArrowShape' );

  /**
   * @param {number} tailX
   * @param {number} tailY
   * @param {number} tipX
   * @param {number} tipY
   * @param {Object} [options]
   * @constructor
   */
  function ArrowNode( tailX, tailY, tipX, tipY, options ) {

    var arrowNode = this;

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

    // @private
    this.updateShapePoints = function() {
      var numberOfPoints = this.shapePoints.length;
      arrowNode.shapePoints = ArrowShape.getArrowShapePoints( arrowNode.tailX, arrowNode.tailY, arrowNode.tipX, arrowNode.tipY, arrowNode.shapePoints, options );
      return arrowNode.shapePoints.length !== numberOfPoints;
    };

    // @private
    this.setDoubleHeaded = function( doubleHead ) {
      options.doubleHead = doubleHead;
    };

    Path.call( this, null );
    this.shapePoints = [];
    this.setTailAndTip( tailX, tailY, tipX, tipY );

    // things you're likely to mess up, add more as needed
    assert && assert( options.headWidth > options.tailWidth );

    this.mutate( options );
  }

  return inherit( Path, ArrowNode, {

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

      this.tailX = tailX; // @public {read-only}
      this.tailY = tailY; // @public {read-only}
      this.tipX = tipX; // @public {read-only}
      this.tipY = tipY; // @public {read-only}

      var numberOfPointsChanged = this.updateShapePoints();

      if ( !this.shape || numberOfPointsChanged ) {
        this.updateShape();
      }
      else {
        this.shape.invalidatePoints();
      }
    },

    setDoubleHead: function( doubleHead ) {
      this.setDoubleHeaded( doubleHead );
      this.updateShapePoints();
      this.updateShape();
    }
  } );
} );
