// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main file for the scenery-phet library demo.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonsView = require( 'SCENERY_PHET/demo/ButtonsView' );
  var ComponentsView = require( 'SCENERY_PHET/demo/ComponentsView' );
  var SpringView = require( 'SCENERY_PHET/demo/SpringView' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var SlidersView = require( 'SCENERY_PHET/demo/SlidersView' );

  // strings
  var sceneryPhetTitleString = require( 'string!SCENERY_PHET/scenery-phet.title' );

  var simOptions = {
    credits: {
      leadDesign: 'PhET'
    }
  };

  var backgroundColor = phet.chipper.getQueryParameter( 'backgroundColor' ) || 'white';
  var screenOptions = { backgroundColor: backgroundColor };

  var createScreenIcon = function( color ) { return new Rectangle( 0, 0, 147, 100, { fill: color } ); };

  // Create and start sim
  SimLauncher.launch( function() {
    new Sim( sceneryPhetTitleString, [
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
      ),
      new Screen( 'Spring',
        createScreenIcon( 'blue' ),
        function() {return {};},
        function( model ) {return new SpringView();},
        screenOptions
      )
    ], simOptions ).start();
  } );
} );