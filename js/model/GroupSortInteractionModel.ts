// Copyright 2023, University of Colorado Boulder

/**
 * GroupSortInteractionModel
 *
 * In general, there is just one instance of this per model, and not per scene. This is because if someone can
 * successfully grab and drag in one scene, then that data should transfer to the next scene.
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

type SelfOptions = {
  dragIndicatorModelTandem?: Tandem | null;
  dragIndicatorModel?: DragIndicatorModel;
};

// TODO: "Soccer ball" -> "group item" https://github.com/phetsims/scenery-phet/issues/815
export type GroupSortInteractionModelOptions = SelfOptions;

// TODO: Of type ItemModel https://github.com/phetsims/scenery-phet/issues/815
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

  // TODO: extend EnabledComponent? This is just a CAV studio thing right now soccerBallsEnabledProperty. https://github.com/phetsims/scenery-phet/issues/815
  public constructor( dragEnabledProperty: TReadOnlyProperty<boolean>, providedOptions: GroupSortInteractionModelOptions ) {
    const dragIndicatorModelTandem = providedOptions?.dragIndicatorModelTandem || Tandem.OPT_OUT;

    const options = optionize<GroupSortInteractionModelOptions, SelfOptions>()( {
      dragIndicatorModelTandem: null,
      dragIndicatorModel: new DragIndicatorModel( this.isKeyboardFocusedProperty, dragEnabledProperty, dragIndicatorModelTandem )
    }, providedOptions );

    this.dragIndicatorModel = options.dragIndicatorModel;

    this.isGrabReleaseVisibleProperty = new DerivedProperty( [ this.focusedSoccerBallProperty, this.hasKeyboardGrabbedBallProperty, this.isKeyboardFocusedProperty ],
      ( focusedSoccerBall, hasGrabbedBall, hasKeyboardFocus ) => {
        return focusedSoccerBall !== null && !hasGrabbedBall && hasKeyboardFocus;
      } );

    // TODO: inline, and likely don't need to make an option for this grabCondition. https://github.com/phetsims/scenery-phet/issues/815
    const createDerivedProperty = ( conditionProperty: TReadOnlyProperty<boolean>, grabCondition: ( isSoccerBallKeyboardGrabbed: boolean ) => boolean ) => new DerivedProperty(
      [ this.focusedSoccerBallProperty, this.isSoccerBallKeyboardGrabbedProperty, this.isKeyboardFocusedProperty, conditionProperty ],
      ( focusedBall, isSoccerBallKeyboardGrabbed, isKeyboardFocused, condition ) =>
        focusedBall !== null && grabCondition( isSoccerBallKeyboardGrabbed ) && isKeyboardFocused && !condition );

    this.isKeyboardDragArrowVisibleProperty = createDerivedProperty( this.hasKeyboardMovedBallProperty, isSoccerBallKeyboardGrabbed => isSoccerBallKeyboardGrabbed );
  }

  /**
   * Reset the interaction without changing the cueing logic.
   */
  public resetInteractionState(): void {
    this.focusedSoccerBallProperty.reset();
    this.isSoccerBallKeyboardGrabbedProperty.reset();
    this.isKeyboardFocusedProperty.reset();
  }

  public reset(): void {
    this.resetInteractionState();

    // TODO: is it ok for this to be after isKeyboardFocusedProperty? https://github.com/phetsims/scenery-phet/issues/815
    this.hasKeyboardGrabbedBallProperty.reset();
    this.hasKeyboardSelectedDifferentBallProperty.reset();
    this.hasKeyboardMovedBallProperty.reset();
  }

  public clearFocus(): void {
    this.focusedSoccerBallProperty.value = null;
  }
}

soccerCommon.register( 'GroupSortInteractionModel', GroupSortInteractionModel );
