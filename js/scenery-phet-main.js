// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main file for the scenery-phet library demo.
 *
 * @author Sam Reid
 */

import Property from '../../axon/js/Property.js';
import Screen from '../../joist/js/Screen.js';
import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../tandem/js/Tandem.js';
import ButtonsScreenView from './demo/ButtonsScreenView.js';
import ComponentsScreenView from './demo/ComponentsScreenView.js';
import DialogsScreenView from './demo/DialogsScreenView.js';
import GreenhouseWavesScreenView from './demo/GreenhouseWavesScreenView.js';
import MemoryTestsScreenView from './demo/MemoryTestsScreenView.js';
import SceneryPhetKeyboardHelpContent from './demo/SceneryPhetKeyboardHelpContent.js';
import SlidersScreenView from './demo/SlidersScreenView.js';
import SpringScreenView from './demo/SpringScreenView.js';
import sceneryPhetStrings from './sceneryPhetStrings.js';
import sceneryPhetQueryParameters from './sceneryPhetQueryParameters.js';

const sceneryPhetTitleString = sceneryPhetStrings[ 'scenery-phet' ].title;

const simOptions = {
  credits: {
    leadDesign: 'PhET'
  },
  keyboardHelpNode: new SceneryPhetKeyboardHelpContent()
};

// Creates a rectangle filled with a specified color
const createScreenIcon = function( color ) {
  return new Rectangle( 0, 0, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height, { fill: color } );
};

// Create and start sim
SimLauncher.launch( function() {

  const buttonsScreenTandem = Tandem.ROOT.createTandem( 'buttonsScreen' );
  const slidersScreenTandem = Tandem.ROOT.createTandem( 'slidersScreen' );
  const componentsScreenTandem = Tandem.ROOT.createTandem( 'componentsScreen' );
  const dialogsScreenTandem = Tandem.ROOT.createTandem( 'dialogsScreen' );
  const springScreenTandem = Tandem.ROOT.createTandem( 'springsScreen' );
  const memoryTestsScreenTandem = Tandem.ROOT.createTandem( 'memoryTestsScreen' );
  new Sim( sceneryPhetTitleString,

    // Prototype for Greenhouse
    sceneryPhetQueryParameters.greenhouseWaves ? [ new Screen(
      function() {return {};},
      function( model ) {return new GreenhouseWavesScreenView();}, {
        name: 'Greenhouse Waves',
        backgroundColorProperty: new Property( 'black' ),
        homeScreenIcon: createScreenIcon( 'green' ),
        tandem: memoryTestsScreenTandem
      } ) ] :

      // Standard screens
      [

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