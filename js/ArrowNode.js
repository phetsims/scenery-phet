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

    Path.call( this, null );
    this.shapePoints = [];
    this.options = options;
    this.setTailAndTip( tailX, tailY, tipX, tipY );

    // things you're likely to mess up, add more as needed
    assert && assert( options.headWidth > options.tailWidth );

    this.mutate( options );
  }

  return inherit( Path, ArrowNode, {

    /**
     * Called only once to describe the initial shape. This method is needed since some sims like pendulum-lab
     * and gravity-and-orbits have a pattern of initializing ArrowNodes with new ArrowNode( 0, 0, 0, 0 ), which
     * wouldn't work to draw the shape immediately.
     * @private
     */
    initializeShape: function() {
      this.arrowShape = new Shape();

      var thisNode = this;
      this.arrowShape.moveToPoint( this.shapePoints[ 0 ] );
      var tail = _.tail( this.shapePoints );
      _.each( tail, function( element ) {
        thisNode.arrowShape.lineToPoint( element );
      } );
      this.arrowShape.close();

      this.shape = this.arrowShape;
    },

    // Set the tail and tip locations to update the arrow shape
    // @public
    setTailAndTip: function( tailX, tailY, tipX, tipY ) {

      this.tailX = tailX; // @public {read-only}
      this.tailY = tailY; // @public {read-only}
      this.tipX = tipX; // @public {read-only}
      this.tipY = tipY; // @public {read-only}

      var numberOfPoints = this.shapePoints.length;
      this.shapePoints = ArrowShape.getArrowShapePoints( tailX, tailY, tipX, tipY, this.shapePoints, this.options );

      if ( this.shapePoints.length !== numberOfPoints ) {
        this.initializeShape();
      }
      else {
        this.arrowShape.invalidatePoints();
      }
    },

    setDoubleHead: function( doubleHead ) {
      this.options.doubleHead = doubleHead;
      this.shapePoints = ArrowShape.getArrowShapePoints( this.tailX, this.tailY, this.tipX, this.tipY, this.shapePoints, this.options );
      this.initializeShape();
    }
  } );
} );
