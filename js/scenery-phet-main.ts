// Copyright 2014-2023, University of Colorado Boulder

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
import TModel from '../../joist/js/TModel.js';
import { Color, TColor, Rectangle } from '../../scenery/js/imports.js';
import Tandem from '../../tandem/js/Tandem.js';
import ButtonsScreenView from './demo/buttons/ButtonsScreenView.js';
import ComponentsScreenView from './demo/components/ComponentsScreenView.js';
import DialogsScreenView from './demo/dialogs/DialogsScreenView.js';
import KeyboardScreenView from './demo/keyboard/KeyboardScreenView.js';
import SceneryPhetKeyboardHelpContent from './demo/SceneryPhetKeyboardHelpContent.js';
import SlidersScreenView from './demo/sliders/SlidersScreenView.js';
import SpinnersScreenView from './demo/spinners/SpinnersScreenView.js';
import sceneryPhetQueryParameters from './sceneryPhetQueryParameters.js';
import SceneryPhetStrings from './SceneryPhetStrings.js';

// empty model used for all demo screens
class Model implements TModel {
  public reset(): void { /* nothing to do */ }
}

// Create and start sim
simLauncher.launch( () => {

  const screens = [
    new ButtonsScreen( Tandem.ROOT.createTandem( 'buttonsScreen' ) ),
    new ComponentsScreen( Tandem.ROOT.createTandem( 'componentsScreen' ) ),
    new DialogsScreen( Tandem.ROOT.createTandem( 'dialogsScreen' ) ),
    new KeyboardScreen( Tandem.ROOT.createTandem( 'keyboardScreen' ) ),
    new SlidersScreen( Tandem.ROOT.createTandem( 'slidersScreen' ) ),
    new SpinnersScreen( Tandem.ROOT.createTandem( 'spinnersScreen' ) )
  ];

  const sim = new Sim( SceneryPhetStrings[ 'scenery-phet' ].titleStringProperty, screens, {
    credits: {
      leadDesign: 'PhET'
    },
    webgl: true
  } );

  sim.start();
} );

class ButtonsScreen extends Screen<Model, ButtonsScreenView> {
  public constructor( tandem: Tandem ) {
    super(
      () => new Model(),
      () => new ButtonsScreenView( { tandem: tandem.createTandem( 'view' ) } ), {
        name: new Property( 'Buttons' ),
        backgroundColorProperty: new Property( Color.toColor( sceneryPhetQueryParameters.backgroundColor ) ),
        homeScreenIcon: createScreenIcon( 'red' ),
        tandem: tandem,
        createKeyboardHelpNode: () => new SceneryPhetKeyboardHelpContent()
      }
    );
  }
}

class ComponentsScreen extends Screen<Model, ComponentsScreenView> {
  public constructor( tandem: Tandem ) {
    super(
      () => new Model(),
      () => new ComponentsScreenView( { tandem: tandem.createTandem( 'view' ) } ), {
        name: new Property( 'Components' ),
        backgroundColorProperty: new Property( Color.toColor( sceneryPhetQueryParameters.backgroundColor ) ),
        homeScreenIcon: createScreenIcon( 'orange' ),
        tandem: tandem,
        createKeyboardHelpNode: () => new SceneryPhetKeyboardHelpContent()
      }
    );
  }
}

class DialogsScreen extends Screen<Model, DialogsScreenView> {
  public constructor( tandem: Tandem ) {
    super(
      () => new Model(),
      () => new DialogsScreenView( { tandem: tandem.createTandem( 'view' ) } ), {
        name: new Property( 'Dialogs' ),
        backgroundColorProperty: new Property( Color.toColor( sceneryPhetQueryParameters.backgroundColor ) ),
        homeScreenIcon: createScreenIcon( 'maroon' ),
        tandem: tandem,
        createKeyboardHelpNode: () => new SceneryPhetKeyboardHelpContent()
      }
    );
  }
}

class KeyboardScreen extends Screen<Model, DialogsScreenView> {
  public constructor( tandem: Tandem ) {
    super(
      () => new Model(),
      () => new KeyboardScreenView( { tandem: tandem.createTandem( 'view' ) } ), {
        name: new Property( 'Keyboard' ),
        backgroundColorProperty: new Property( Color.toColor( sceneryPhetQueryParameters.backgroundColor ) ),
        homeScreenIcon: createScreenIcon( 'pink' ),
        tandem: tandem,
        createKeyboardHelpNode: () => new SceneryPhetKeyboardHelpContent()
      }
    );
  }
}

class SlidersScreen extends Screen<Model, SlidersScreenView> {
  public constructor( tandem: Tandem ) {
    super(
      () => new Model(),
      () => new SlidersScreenView( { tandem: tandem.createTandem( 'view' ) } ), {
        name: new Property( 'Sliders' ),
        backgroundColorProperty: new Property( Color.toColor( sceneryPhetQueryParameters.backgroundColor ) ),
        homeScreenIcon: createScreenIcon( 'yellow' ),
        tandem: tandem,
        createKeyboardHelpNode: () => new SceneryPhetKeyboardHelpContent()
      }
    );
  }
}

class SpinnersScreen extends Screen<Model, SpinnersScreenView> {
  public constructor( tandem: Tandem ) {
    super(
      () => new Model(),
      () => new SpinnersScreenView( { tandem: tandem.createTandem( 'view' ) } ), {
        name: new Property( 'Spinners' ),
        backgroundColorProperty: new Property( Color.toColor( sceneryPhetQueryParameters.backgroundColor ) ),
        homeScreenIcon: createScreenIcon( 'green' ),
        tandem: tandem,
        createKeyboardHelpNode: () => new SceneryPhetKeyboardHelpContent()
      }
    );
  }
}

/**
 * Creates a simple screen icon, a colored rectangle.
 */
function createScreenIcon( color: TColor ): ScreenIcon {
  return new ScreenIcon(
    new Rectangle( 0, 0, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height, {
      fill: color
    } )
  );
}