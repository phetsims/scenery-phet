// Copyright 2023, University of Colorado Boulder

/**
 * GroupSortInteractionModel
 * @author Michael Kauzmann (PhET Interactive Simulations)
 *
 */

import soccerCommon from '../soccerCommon.js';
import optionize from '../../../phet-core/js/optionize.js';
import Property from '../../../axon/js/Property.js';
import Tandem from '../../../tandem/js/Tandem.js';
import SoccerBall from './SoccerBall.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import DragIndicatorModel from './DragIndicatorModel.js';
import Emitter from '../../../axon/js/Emitter.js';


type SelfOptions = {
  dragIndicatorModelTandem?: Tandem | null;
  dragIndicatorModel?: DragIndicatorModel;
};

export type GroupSortInteractionModelOptions = SelfOptions;

// TODO: Of type T https://github.com/phetsims/scenery-phet/issues/815
export default class GroupSortInteractionModel {

  // The model for the visual indicator for dragging soccer balls via mouse, touch or keyboard
  public readonly dragIndicatorModel: DragIndicatorModel;

  // The soccerBall that is receiving highlight focus in the backLayerSoccerBallLayer group highlight
  public readonly focusedSoccerBallProperty = new Property<SoccerBall | null>( null );

  // Whether a soccer ball is being grabbed via keyboard interaction
  public readonly isSoccerBallKeyboardGrabbedProperty = new Property( false );

  // Whether the 'Press SPACE to Grab or Release' dialog is showing
  public readonly isGrabReleaseVisibleProperty: TReadOnlyProperty<boolean>;

  // Whether the keyboard drag arrow is showing
  public readonly isKeyboardDragArrowVisibleProperty: TReadOnlyProperty<boolean>;

  // Whether the keyboard is currently focused on a sim component
  public readonly isKeyboardFocusedProperty = new BooleanProperty( false );

  // Properties that switch to true when the specified action has occurred once.
  public readonly hasKeyboardGrabbedBallProperty = new BooleanProperty( false );

  // Whether a soccer ball has been moved with the keyboard controls
  public readonly hasKeyboardMovedBallProperty = new BooleanProperty( false );

  // Whether the user has changed the selected soccer ball with the keyboard controls
  public readonly hasKeyboardSelectedDifferentBallProperty = new BooleanProperty( false );

  // TODO: ???? https://github.com/phetsims/scenery-phet/issues/815
  public readonly focusResetEmitter = new Emitter();

  public constructor( dragEnabledProperty: TReadOnlyProperty<boolean>, providedOptions: GroupSortInteractionModelOptions ) {
    const dragIndicatorModelTandem = providedOptions?.dragIndicatorModelTandem || Tandem.OPT_OUT;

    const options = optionize<GroupSortInteractionModelOptions, SelfOptions>()( {
      dragIndicatorModelTandem: null,
      dragIndicatorModel: new DragIndicatorModel( this.isKeyboardFocusedProperty, dragEnabledProperty, dragIndicatorModelTandem )
    }, providedOptions );

    this.focusResetEmitter.addListener( () => {
      this.focusedSoccerBallProperty.value = null;
    } );

    this.dragIndicatorModel = options.dragIndicatorModel;

    this.isGrabReleaseVisibleProperty = new DerivedProperty( [ this.focusedSoccerBallProperty, this.hasKeyboardGrabbedBallProperty, this.isKeyboardFocusedProperty ],
      ( focusedSoccerBall, hasGrabbedBall, hasKeyboardFocus ) => {
        return focusedSoccerBall !== null && !hasGrabbedBall && hasKeyboardFocus;
      } );

    const createDerivedProperty = ( conditionProperty: TReadOnlyProperty<boolean>, grabCondition: ( isSoccerBallKeyboardGrabbed: boolean ) => boolean ) => new DerivedProperty(
      [ this.focusedSoccerBallProperty, this.isSoccerBallKeyboardGrabbedProperty, this.isKeyboardFocusedProperty, conditionProperty ],
      ( focusedBall, isSoccerBallKeyboardGrabbed, isKeyboardFocused, condition ) =>
        focusedBall !== null && grabCondition( isSoccerBallKeyboardGrabbed ) && isKeyboardFocused && !condition );

    this.isKeyboardDragArrowVisibleProperty = createDerivedProperty( this.hasKeyboardMovedBallProperty, isSoccerBallKeyboardGrabbed => isSoccerBallKeyboardGrabbed );
  }

  public reset(): void {

    // We need to reset keyboard focus Properties that are used by the sceneModels, before
    // resetting the sceneModels themselves.
    this.focusedSoccerBallProperty.reset();
    this.isSoccerBallKeyboardGrabbedProperty.reset();
    this.hasKeyboardGrabbedBallProperty.reset();
    this.isKeyboardFocusedProperty.reset();
    this.hasKeyboardSelectedDifferentBallProperty.reset();
    this.hasKeyboardMovedBallProperty.reset();
  }

  public clearData(): void {
    this.focusedSoccerBallProperty.value = null;
  }
}

soccerCommon.register( 'GroupSortInteractionModel', GroupSortInteractionModel );