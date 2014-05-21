// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main ScreenView container for Buttons portion of the UI component demo.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var OutsideBackgroundNode = require( 'SCENERY_PHET/OutsideBackgroundNode' );
  var ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );
  var Property = require( 'AXON/Property' );

  function SceneryPhetView() {
    ScreenView.call( this, { renderer: 'svg' } );

    // background
    this.addChild( new OutsideBackgroundNode( this.layoutBounds.centerX, this.layoutBounds.centerY + 20, this.layoutBounds.width * 3, this.layoutBounds.height, this.layoutBounds.height ) );

    this.addChild( new ThermometerNode( 0, 100, new Property( 50 ), { centerX: this.layoutBounds.centerX, centerY: this.layoutBounds.centerY } ) );

  }

  return inherit( ScreenView, SceneryPhetView, {
    step: function( timeElapsed ) {
      // Does nothing for now.
    }
  } );
} );