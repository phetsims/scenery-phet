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
  var SceneryPhetScreenView = require( 'SCENERY_PHET/SceneryPhetScreenView' );

  // Strings
  var simTitle = 'scenery-phet';

  var simOptions = {
    credits: {
      leadDesign: 'PhET'
    }
  };

  SimLauncher.launch( function() {
    // Create and start the sim
    //Create and start the sim
    new Sim( simTitle, [
      new Screen( simTitle, null,
        function() {return {};},
        function( model ) {return new SceneryPhetScreenView();},
        { backgroundColor: '#fff' }
      )
    ], simOptions ).start();
  } );
} );