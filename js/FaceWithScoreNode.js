// Copyright 2002-2014, University of Colorado Boulder

/**
 * A node that represents a smiling face with the additional points gained for
 * getting the answer correct shown immediately below.
 */
define( function( require ) {
  'use strict';

  // modules
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Object} options
   * @constructor
   */
  function FaceWithScoreNode( options ) {
    Node.call( this );

    this.options = _.extend( {
      faceDiameter: 100, //faceDiameter In screen coords, which are fairly close to pixels
      faceOpacity: 0.6,
      scoreAlignment: 'rightBottom', //or bottom
      scoreTextSize: 44,
      scoreFill: 'yellow',
      scoreStroke: 'black',
      score: 0
    }, options );

    this.faceNode = new FaceNode( this.options.faceDiameter, { opacity: this.options.faceOpacity } );
    this.addChild( this.faceNode );

    this.pointDisplay = new Text( '',
      {
        font: new PhetFont( { size: this.options.scoreTextSize, weight: 'bold', lineWidth: 1.5, fill: 'yellow' } ),
        fill: this.options.scoreFill,
        stroke: this.options.scoreStroke,
        lineWidth: 1
      } );
    this.addChild( this.pointDisplay );

    this.setScore( this.options.score );

    // Pass options through to the parent class.
    this.mutate( this.options );
  }

  return inherit( Node, FaceWithScoreNode, {

    smile: function() {
      this.faceNode.smile();
      this.pointDisplay.visible = true;
    },

    frown: function() {
      this.faceNode.frown();
      this.pointDisplay.visible = false;
    },

    setScore: function( score ) {
      assert && assert( score >= 0 );

      //If the score is zero, then don't show any text.  It could be odd to show "+0"
      this.pointDisplay.text = score === 0 ? '???' : '+' + score;
      this.updateScoreLocation();
    },

    updateScoreLocation: function() {

      if ( this.options.scoreAlignment === 'bottom' ) {
        this.pointDisplay.centerX = this.faceNode.centerX;
        this.pointDisplay.top = this.faceNode.bottom + 2;
      }
      else if ( this.options.scoreAlignment === 'bottomRight' ) {
        this.pointDisplay.centerX = this.options.faceDiameter * 0.4;
        this.pointDisplay.centerY = this.options.faceDiameter / 2;
      }
    }
  } );
} );