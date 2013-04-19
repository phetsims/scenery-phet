//The content for a tab of a simulation.
//Specifies the layout strategy.
//Simulations tab contents should extend this to be compatible with the Sim.js framework.
define( function( require ) {
  'use strict';

  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );

  function Tab( options ) {
    Node.call( this, options );
  }

  inherit( Tab, Node, {

    //Default to width and height for iPad3 running Safari with default tabs and decorations
    //Simulations can change this to provide their own sizes or aspect ratios
    layoutWidth: 768,
    layoutHeight: 504,

    //Get the scale to use for laying out the sim components and the tab navigation bar, so its size will track with the sim size
    getLayoutScale: function( width, height ) {
      return Math.min( width / this.layoutWidth, height / this.layoutHeight );
    },

    //Default layout function resizes the 
    layout: function( width, height ) {
      this.resetTransform();

      var scale = this.getLayoutScale( width, height );
      this.setScaleMagnitude( scale );

      //center vertically
      if ( scale === width / this.layoutWidth ) {
        this.translate( 0, (height - this.layoutHeight * scale) / 2 / scale );
      }

      //center horizontally
      else if ( scale === height / this.layoutHeight ) {
        this.translate( (width - this.layoutWidth * scale) / 2 / scale, 0 );
      }
    }
  } );

  return Tab;
} );