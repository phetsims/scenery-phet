// Copyright 2002-2014, University of Colorado Boulder

/**
 * A node that represents a smiling face with the additional points gained for
 * getting the answer correct shown immediately below.
 *
 * @author John Blanco
 * @author Sam Reid
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var pattern_0sign_1number = require( 'string!SCENERY_PHET/pattern_0sign_1number' );

  /**
   * @param {Object} options
   * @constructor
   */
  function FaceWithScoreNode( options ) {

    this.options = _.extend( {
      faceDiameter: 100, // in screen coords, which are fairly close to pixels
      faceOpacity: 0.6,
      pointsAlignment: 'rightBottom', // valid values are 'rightBottom' and 'centerBottom'
      pointsTextSize: 44,
      pointsFill: 'yellow',
      pointsStroke: 'black',
      points: 0
    }, options );

    this.faceNode = new FaceNode( this.options.faceDiameter, { opacity: this.options.faceOpacity } ); // @private

    // @private
    this.pointsNode = new Text( '',
      {
        font: new PhetFont( { size: this.options.pointsTextSize, weight: 'bold', lineWidth: 1.5, fill: 'yellow' } ),
        fill: this.options.pointsFill,
        stroke: this.options.pointsStroke,
        lineWidth: 1
      } );

    this.options.children = [ this.faceNode, this.pointsNode ];
    Node.call( this, this.options );

    this.setPoints( this.options.points );
  }

  return inherit( Node, FaceWithScoreNode, {

    smile: function() {
      this.faceNode.smile();
      this.pointsNode.visible = true;
    },

    frown: function() {
      this.faceNode.frown();
      this.pointsNode.visible = false;
    },

    setPoints: function( points ) {
      assert && assert( points >= 0 );

      if ( points === 0 ) {
        // If zero, then don't show any text, since "0" is just weird.
        this.pointsNode.text = '';
      }
      else if ( points < 0 ) {
        this.pointsNode.text = points + '';
      }
      else {
        // + sign for positive numbers, order localized
        this.pointsNode.text = StringUtils.format( pattern_0sign_1number, '+', points );
      }
      this.updatePointsLocation();
    },

    // @private
    updatePointsLocation: function() {
      if ( this.options.pointsAlignment === 'centerBottom' ) {
        this.pointsNode.centerX = this.faceNode.centerX;
        this.pointsNode.top = this.faceNode.bottom + 2;
      }
      else if ( this.options.pointsAlignment === 'rightBottom' ) {
        this.pointsNode.centerX = this.options.faceDiameter * 0.4;
        this.pointsNode.centerY = this.options.faceDiameter / 2;
      }
    }
  } );
} );