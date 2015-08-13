// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main file for the scenery-phet library demo.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // Imports
  var Screen = require( 'JOIST/Screen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var ButtonsView = require( 'SCENERY_PHET/demo/ButtonsView' );
  var SlidersView = require( 'SCENERY_PHET/demo/SlidersView' );
  var ComponentsView = require( 'SCENERY_PHET/demo/ComponentsView' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // Strings
  var title = require( 'string!SCENERY_PHET/scenery-phet.name' );

  var simOptions = {
    credits: {
      leadDesign: 'PhET'
    }
  };

  var backgroundColor = phet.chipper.getQueryParameter( 'backgroundColor' ) || 'white';
  var screenOptions = { backgroundColor: backgroundColor };

  var createScreenIcon = function( color ) { return new Rectangle( 0, 0, 147, 100, { fill: color } ); };

  SimLauncher.launch( function() {
    // Create and start the sim
    //Create and start the sim
    new Sim( title, [
      new Screen( 'Buttons',
        createScreenIcon( 'red' ),
        function() {return {};},
        function( model ) {return new ButtonsView();},
        screenOptions
      ),
      new Screen( 'Sliders',
        createScreenIcon( 'yellow' ),
        function() {return {};},
        function( model ) {return new SlidersView();},
        screenOptions
      ),
      new Screen( 'Components',
        createScreenIcon( 'orange' ),
        function() {return {};},
        function( model ) {return new ComponentsView();},
        screenOptions
      )
    ], simOptions ).start();
  } );
} );