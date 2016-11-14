// Copyright 2014-2016, University of Colorado Boulder

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
  var sceneryPhetQueryParameters = require( 'SCENERY_PHET/sceneryPhetQueryParameters' );
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

  // Creates a rectangle filled with a specified color
  var createScreenIcon = function( color ) {
    return new Rectangle( 0, 0, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height, { fill: color } );
  };

  // Create and start sim
  SimLauncher.launch( function() {
    new Sim( sceneryPhetTitleString, [

      new Screen(
        function() {return {};},
        function( model ) {return new ButtonsView();},
        {
          name: 'Buttons',
          backgroundColor: sceneryPhetQueryParameters.backgroundColor,
          homeScreenIcon: createScreenIcon( 'red' )
        }
      ),

      new Screen(
        function() {return {};},
        function( model ) {return new SlidersView();},
        {
          name: 'Sliders',
          backgroundColor: sceneryPhetQueryParameters.backgroundColor,
          homeScreenIcon: createScreenIcon( 'yellow' )
        }
      ),

      new Screen(
        function() {return {};},
        function( model ) {return new ComponentsView();},
        {
          name: 'Components',
          backgroundColor: sceneryPhetQueryParameters.backgroundColor,
          homeScreenIcon: createScreenIcon( 'orange' )
        }
      ),

      new Screen(
        function() {return {};},
        function( model ) {return new SpringView();},
        {
          name: 'Spring',
          backgroundColor: sceneryPhetQueryParameters.backgroundColor,
          homeScreenIcon: createScreenIcon( 'blue' )
        }
      )
    ], simOptions ).start();
  } );
} );