// Copyright 2002-2014, University of Colorado Boulder

/**
 * This class aims to have the same interface as ArrowNode and support the same API but to do it by transforming shapes where
 * possible instead of creating new shapes, in order to improve performance, see https://github.com/phetsims/scenery-phet/issues/28
 *
 * TODO: Add support for strokes and shrunken arrowheads.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // Imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Shape = require( 'KITE/Shape' );

  /*
   * @param {number} tailX
   * @param {number} tailY
   * @param {number} tipX
   * @param {number} tipY
   * @param {Object} options
   * @constructor
   */
  function MutableArrowNode( tailX, tailY, tipX, tipY, options ) {

    // default options
    options = _.extend( {
      headHeight: 10,
      headWidth: 10,
      tailWidth: 5,
      doubleHead: false, // true puts heads on both ends of the arrow, false puts a head at the tip
      fill: 'black',
      stroke: 'black',
      lineWidth: 1
    }, options );

    // things you're likely to mess up, add more as needed
    assert && assert( options.headWidth > options.tailWidth );

    //The tail of the Arrow is a
    Node.call( this, options );

    //Intermediate parent for setting the rotation of the node
    this.parent = new Node();

    this.body = new Rectangle( 0, 0, options.tailWidth, 1, {fill: options.fill} );
    var headShape = new Shape().moveTo( -options.headWidth / 2, 0 ).lineTo( 0, options.headHeight ).lineTo( options.headWidth / 2, 0 ).close();
    this.head = new Path( headShape, {fill: options.fill} );

    this.parent.addChild( this.body );
    this.parent.addChild( this.head );
    this.addChild( this.parent );
    this.options = options;

    this.setTailAndTip( tailX, tailY, tipX, tipY );
  }

  return inherit( Node, MutableArrowNode, {
    getMatrix: function( tailX, tailY, angle, scaleX, scaleY, offsetX, offsetY ) {

      //Translate to the desired location
      var matrix = Matrix3.translation( tailX, tailY );

      //Rotation and translation can happen in any order
      matrix = matrix.multiplyMatrix( Matrix3.rotation2( angle ) );
      matrix = matrix.multiplyMatrix( Matrix3.scaling( scaleX, scaleY ) );

      //Think of it as a multiplying the Vector2 to the right, so this step happens first actually.  Use it to center the registration point
      matrix = matrix.multiplyMatrix( Matrix3.translation( -offsetX, -offsetY ) );

      return matrix;
    },
    setTailAndTip: function( tailX, tailY, tipX, tipY ) {
      if ( this.tailX !== tailX || this.tailY !== tailY || this.tipX !== tipX || this.tipY !== tipY ) {
        var dx = tipX - tailX;
        var dy = tipY - tailY;

        var distance = Math.sqrt( dx * dx + dy * dy );
        var angle = Math.atan2( dy, dx ) - Math.PI / 2;

        this.body.setMatrix( this.getMatrix( tailX, tailY, angle, 1, distance, this.options.tailWidth / 2, 0 ) );
        this.head.setMatrix( this.getMatrix( tipX, tipY, angle, 1, 1, 0, 0 ) );
        this.tailX = tailX;
        this.tailY = tailY;
        this.tipX = tipX;
        this.tipY = tipY;
      }
    },
    setShape: function() {
      console.log( 'set shape called on MutableArrowNode.' );
    }
  } );
} );
