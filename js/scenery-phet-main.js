// Copyright 2014-2018, University of Colorado Boulder

/**
 * Main file for the scenery-phet library demo.
 *
 * @author Sam Reid
 */
define( require => {
  'use strict';

  // modules
  const ButtonsScreenView = require( 'SCENERY_PHET/demo/ButtonsScreenView' );
  const ComponentsScreenView = require( 'SCENERY_PHET/demo/ComponentsScreenView' );
  const DialogsScreenView = require( 'SCENERY_PHET/demo/DialogsScreenView' );
  const MemoryTestsScreenView = require( 'SCENERY_PHET/demo/MemoryTestsScreenView' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const sceneryPhetQueryParameters = require( 'SCENERY_PHET/sceneryPhetQueryParameters' );
  const Screen = require( 'JOIST/Screen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const SlidersScreenView = require( 'SCENERY_PHET/demo/SlidersScreenView' );
  const SpringScreenView = require( 'SCENERY_PHET/demo/SpringScreenView' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const sceneryPhetTitleString = require( 'string!SCENERY_PHET/scenery-phet.title' );

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

    const buttonsScreenTandem = Tandem.rootTandem.createTandem( 'buttonsScreen' );
    const slidersScreenTandem = Tandem.rootTandem.createTandem( 'slidersScreen' );
    const componentsScreenTandem = Tandem.rootTandem.createTandem( 'componentsScreen' );
    const dialogsScreenTandem = Tandem.rootTandem.createTandem( 'dialogsScreen' );
    const springScreenTandem = Tandem.rootTandem.createTandem( 'springsScreen' );
    const memoryTestsScreenTandem = Tandem.rootTandem.createTandem( 'memoryTestsScreen' );
    new Sim( sceneryPhetTitleString, [

      // Buttons
      new Screen(
        function() {return {};},
        function( model ) {return new ButtonsScreenView();},
        {
          name: 'Buttons',
          backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
          homeScreenIcon: createScreenIcon( 'red' ),
          tandem: buttonsScreenTandem
        }
      ),

      // Sliders
      new Screen(
        function() {return {};},
        function( model ) {return new SlidersScreenView();},
        {
          name: 'Sliders',
          backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
          homeScreenIcon: createScreenIcon( 'yellow' ),
          tandem: slidersScreenTandem
        }
      ),

      // Components
      new Screen(
        function() {return {};},
        function( model ) {

          return new ComponentsScreenView( { tandem: componentsScreenTandem.createTandem( 'view' ) } );
        },
        {
          name: 'Components',
          backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
          homeScreenIcon: createScreenIcon( 'orange' ),
          tandem: componentsScreenTandem
        }
      ),

      // Dialogs
      new Screen(
        function() {return {};},
        function( model ) {return new DialogsScreenView();},
        {
          name: 'Dialogs',
          backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
          homeScreenIcon: createScreenIcon( 'white' ),
          tandem: dialogsScreenTandem
        }
      ),

      // Spring
      new Screen(
        function() {return {};},
        function( model ) {return new SpringScreenView();},
        {
          name: 'Spring',
          backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
          homeScreenIcon: createScreenIcon( 'blue' ),
          tandem: springScreenTandem
        }
      ),

      // Memory Tests
      new Screen(
        function() {return {};},
        function( model ) {return new MemoryTestsScreenView();},
        {
          name: 'Memory Tests',
          backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
          homeScreenIcon: createScreenIcon( 'purple' ),
          tandem: memoryTestsScreenTandem
        }
      )
    ], simOptions ).start();
  } );
} );