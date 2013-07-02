// Copyright 2002-2013, University of Colorado Boulder

/**
 * A face that can smile or frown, for universally indicating success or
 * failure.
 *
 * This was ported from a version that was originally written in Java.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // imports
  var assert = require( 'ASSERT/assert' )( 'scenery-phet' );
  var inherit = require( "PHET_CORE/inherit" );
  var Circle = require( "SCENERY/nodes/Circle" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Shape = require( "KITE/Shape" );
  var Text = require( "SCENERY/nodes/Text" ); // TODO - Remove when testing complete.

  /**
   * @param {number} width  distance between left-most and right-most tick, insets will be added to this
   * @param {number} height
   * @param {number} majorTickWidth
   * @param {Array<String>} majorTickLabels
   * @param {String} units
   * @param {object} options
   * @constructor
   */
  function FaceNode( headDiameter, options ) {

    // default options
    options = _.extend(
      {
        headPaint: 'yellow',
        eyePaint: 'black',
        mouthPaint: 'black',
        headStroke: null,
        headLineWidth: '1px'
      }, options );

    var thisNode = this;
    Node.call( thisNode, options );

    this.addChild( new Circle( headDiameter / 2,
                               { fill: options.headPaint,
                                 stroke: options.headStroke,
                                 lineWidth: options.headLineWidth
                               } ) );
  }

  inherit( Node, FaceNode );

  return FaceNode;
} );
