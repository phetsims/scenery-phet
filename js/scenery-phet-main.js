// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main file for the scenery-phet library demo.
 *
 * @author Sam Reid
 */

import Property from '../../axon/js/Property.js';
import Screen from '../../joist/js/Screen.js';
import ScreenIcon from '../../joist/js/ScreenIcon.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../tandem/js/Tandem.js';
import ButtonsScreenView from './demo/ButtonsScreenView.js';
import ComponentsScreenView from './demo/ComponentsScreenView.js';
import DialogsScreenView from './demo/DialogsScreenView.js';
import SceneryPhetMemoryTestsScreenView from './demo/SceneryPhetMemoryTestsScreenView.js';
import SceneryPhetKeyboardHelpContent from './demo/SceneryPhetKeyboardHelpContent.js';
import SlidersScreenView from './demo/SlidersScreenView.js';
import SpringScreenView from './demo/SpringScreenView.js';
import sceneryPhetStrings from './sceneryPhetStrings.js';
import sceneryPhetQueryParameters from './sceneryPhetQueryParameters.js';

// empty model used for all demo screens
const MODEL = {};

const simOptions = {
  credits: {
    leadDesign: 'PhET'
  },
  keyboardHelpNode: new SceneryPhetKeyboardHelpContent(),
  webgl: true
};

/**
 * Creates a simple screen icon, a colored rectangle.
 * @param {ColorDef} color
 * @returns {ScreenIcon}
 */
function createScreenIcon( color ) {
  return new ScreenIcon(
    new Rectangle( 0, 0, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height, {
      fill: color
    } )
  );
}

// Create and start sim
simLauncher.launch( () => {

  const componentsScreenTandem = Tandem.ROOT.createTandem( 'componentsScreen' );

  new Sim( sceneryPhetStrings[ 'scenery-phet' ].title, [

    // Buttons screen
    new Screen(
      () => MODEL,
      () => new ButtonsScreenView(),
      {
        name: 'Buttons',
        backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
        homeScreenIcon: createScreenIcon( 'red' ),
        tandem: Tandem.ROOT.createTandem( 'buttonsScreen' )
      }
    ),

    // Sliders screen
    new Screen(
      () => MODEL,
      () => new SlidersScreenView(),
      {
        name: 'Sliders',
        backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
        homeScreenIcon: createScreenIcon( 'yellow' ),
        tandem: Tandem.ROOT.createTandem( 'slidersScreen' )
      }
    ),

    // Components screen
    new Screen(
      () => MODEL,
      () => new ComponentsScreenView( { tandem: componentsScreenTandem.createTandem( 'view' ) } ),
      {
        name: 'Components',
        backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
        homeScreenIcon: createScreenIcon( 'orange' ),
        tandem: componentsScreenTandem
      }
    ),

    // Dialogs screen
    new Screen(
      () => MODEL,
      () => new DialogsScreenView(),
      {
        name: 'Dialogs',
        backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
        homeScreenIcon: createScreenIcon( 'maroon' ),
        tandem: Tandem.ROOT.createTandem( 'dialogsScreen' )
      }
    ),

    // Spring screen
    new Screen(
      () => MODEL,
      () => new SpringScreenView(),
      {
        name: 'Spring',
        backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
        homeScreenIcon: createScreenIcon( 'blue' ),
        tandem: Tandem.ROOT.createTandem( 'springsScreen' )
      }
    ),

    // Memory Tests screen
    new Screen(
      () => MODEL,
      () => new SceneryPhetMemoryTestsScreenView(),
      {
        name: 'Memory Tests',
        backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
        homeScreenIcon: createScreenIcon( 'purple' ),
        tandem: Tandem.ROOT.createTandem( 'memoryTestsScreen' )
      }
    )
  ], simOptions ).start();
} );