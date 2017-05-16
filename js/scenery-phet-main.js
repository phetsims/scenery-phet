// Copyright 2014-2016, University of Colorado Boulder

/**
 * Main file for the scenery-phet library demo.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonsScreenView = require( 'SCENERY_PHET/demo/ButtonsScreenView' );
  var ComponentsScreenView = require( 'SCENERY_PHET/demo/ComponentsScreenView' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var sceneryPhetQueryParameters = require( 'SCENERY_PHET/sceneryPhetQueryParameters' );
  var Screen = require( 'JOIST/Screen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var SlidersScreenView = require( 'SCENERY_PHET/demo/SlidersScreenView' );
  var SpringScreenView = require( 'SCENERY_PHET/demo/SpringScreenView' );

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
        function( model ) {return new ButtonsScreenView();},
        {
          name: 'Buttons',
          backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
          homeScreenIcon: createScreenIcon( 'red' )
        }
      ),

      new Screen(
        function() {return {};},
        function( model ) {return new SlidersScreenView();},
        {
          name: 'Sliders',
          backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
          homeScreenIcon: createScreenIcon( 'yellow' )
        }
      ),

      new Screen(
        function() {return {};},
        function( model ) {return new ComponentsScreenView();},
        {
          name: 'Components',
          backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
          homeScreenIcon: createScreenIcon( 'orange' )
        }
      ),

      new Screen(
        function() {return {};},
        function( model ) {return new SpringScreenView();},
        {
          name: 'Spring',
          backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
          homeScreenIcon: createScreenIcon( 'blue' )
        }
      )
    ], simOptions ).start();
  } );
} );