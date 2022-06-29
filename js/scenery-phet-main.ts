// Copyright 2014-2022, University of Colorado Boulder

/**
 * Main file for the scenery-phet library demo.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../axon/js/Property.js';
import Screen from '../../joist/js/Screen.js';
import ScreenIcon from '../../joist/js/ScreenIcon.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import { IColor, Rectangle } from '../../scenery/js/imports.js';
import Tandem from '../../tandem/js/Tandem.js';
import ButtonsScreenView from './demo/ButtonsScreenView.js';
import ComponentsScreenView from './demo/components/ComponentsScreenView.js';
import DialogsScreenView from './demo/DialogsScreenView.js';
import SceneryPhetKeyboardHelpContent from './demo/SceneryPhetKeyboardHelpContent.js';
import SlidersScreenView from './demo/SlidersScreenView.js';
import SpinnersScreenView from './demo/SpinnersScreenView.js';
import SpringScreenView from './demo/springs/SpringScreenView.js';
import sceneryPhetQueryParameters from './sceneryPhetQueryParameters.js';
import sceneryPhetStrings from './sceneryPhetStrings.js';

// empty model used for all demo screens
const MODEL = {};

// Keyboard help used for all screens
const keyboardHelpNode = new SceneryPhetKeyboardHelpContent();

// Create and start sim
simLauncher.launch( () => {

  const screens = [
    new ButtonsScreen( Tandem.ROOT.createTandem( 'buttonsScreen' ) ),
    new ComponentsScreen( Tandem.ROOT.createTandem( 'componentsScreen' ) ),
    new DialogsScreen( Tandem.ROOT.createTandem( 'dialogsScreen' ) ),
    new SlidersScreen( Tandem.ROOT.createTandem( 'slidersScreen' ) ),
    new SpinnersScreen( Tandem.ROOT.createTandem( 'spinnersScreen' ) ),
    new SpringScreen( Tandem.ROOT.createTandem( 'springScreen' ) )
  ];

  const sim = new Sim( sceneryPhetStrings[ 'scenery-phet' ].title, screens, {
    credits: {
      leadDesign: 'PhET'
    },
    hasKeyboardHelpContent: true,
    webgl: true
  } );

  sim.start();
} );

class ButtonsScreen extends Screen<typeof MODEL, ButtonsScreenView> {
  public constructor( tandem: Tandem ) {
    super(
      () => MODEL,
      () => new ButtonsScreenView( { tandem: tandem.createTandem( 'view' ) } ),
      {
        name: 'Buttons',
        backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
        homeScreenIcon: createScreenIcon( 'red' ),
        tandem: tandem,
        keyboardHelpNode: keyboardHelpNode
      }
    );
  }
}

class ComponentsScreen extends Screen<typeof MODEL, ComponentsScreenView> {
  public constructor( tandem: Tandem ) {
    super(
      () => MODEL,
      () => new ComponentsScreenView( { tandem: tandem.createTandem( 'view' ) } ),
      {
        name: 'Components',
        backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
        homeScreenIcon: createScreenIcon( 'orange' ),
        tandem: tandem,
        keyboardHelpNode: keyboardHelpNode
      }
    );
  }
}

class DialogsScreen extends Screen<typeof MODEL, DialogsScreenView> {
  public constructor( tandem: Tandem ) {
    super(
      () => MODEL,
      () => new DialogsScreenView( { tandem: tandem.createTandem( 'view' ) } ),
      {
        name: 'Dialogs',
        backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
        homeScreenIcon: createScreenIcon( 'maroon' ),
        tandem: tandem,
        keyboardHelpNode: keyboardHelpNode
      }
    );
  }
}

class SlidersScreen extends Screen<typeof MODEL, SlidersScreenView> {
  public constructor( tandem: Tandem ) {
    super(
      () => MODEL,
      () => new SlidersScreenView( { tandem: tandem.createTandem( 'view' ) } ),
      {
        name: 'Sliders',
        backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
        homeScreenIcon: createScreenIcon( 'yellow' ),
        tandem: tandem,
        keyboardHelpNode: keyboardHelpNode
      }
    );
  }
}

class SpinnersScreen extends Screen<typeof MODEL, SpinnersScreenView> {
  public constructor( tandem: Tandem ) {
    super(
      () => MODEL,
      () => new SpinnersScreenView( { tandem: tandem.createTandem( 'view' ) } ),
      {
        name: 'Spinners',
        backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
        homeScreenIcon: createScreenIcon( 'green' ),
        tandem: tandem,
        keyboardHelpNode: keyboardHelpNode
      }
    );
  }
}

class SpringScreen extends Screen<typeof MODEL, SpringScreenView> {
  public constructor( tandem: Tandem ) {
    super(
      () => MODEL,
      () => new SpringScreenView( { tandem: tandem.createTandem( 'view' ) } ),
      {
        name: 'Spring',
        backgroundColorProperty: new Property( sceneryPhetQueryParameters.backgroundColor ),
        homeScreenIcon: createScreenIcon( 'blue' ),
        tandem: tandem,
        keyboardHelpNode: keyboardHelpNode
      }
    );
  }
}

/**
 * Creates a simple screen icon, a colored rectangle.
 */
function createScreenIcon( color: IColor ): ScreenIcon {
  return new ScreenIcon(
    new Rectangle( 0, 0, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height, {
      fill: color
    } )
  );
}