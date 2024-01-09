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
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import Property from '../../../axon/js/Property.js';
import Tandem from '../../../tandem/js/Tandem.js';
import SoccerBall from './SoccerBall.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import NullableIO from '../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../tandem/js/types/NumberIO.js';
import { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';
import TProperty from '../../../axon/js/TProperty.js';
import SoccerSceneModel from './SoccerSceneModel.js';

type SelfOptions = EmptySelfOptions;

type ParentOptions = Pick<PhetioObjectOptions, 'tandem'>;

// TODO: "Soccer ball" -> "group item" https://github.com/phetsims/scenery-phet/issues/815
export type GroupSortInteractionModelOptions = SelfOptions & ParentOptions;

// TODO: Of type ItemModel https://github.com/phetsims/scenery-phet/issues/815
export default class GroupSortInteractionModel {

  // The ItemModel that is receiving the highlight focus within the group highlight.
  public readonly focusedGroupItemProperty = new Property<SoccerBall | null>( null );

  // Whether a group item is being grabbed via keyboard interaction
  public readonly isGroupItemKeyboardGrabbedProperty = new Property( false );

  // Whether the 'Press SPACE to Grab or Release' dialog is showing
  public readonly isGrabReleaseVisibleProperty: TReadOnlyProperty<boolean>;

  // Whether the keyboard drag arrow is showing
  public readonly isKeyboardDragArrowVisibleProperty: TReadOnlyProperty<boolean>;

  // Whether the keyboard is currently focused on a sim component
  public readonly isKeyboardFocusedProperty = new BooleanProperty( false );

  // Properties that switch to true when the specified action has occurred once.
  public readonly hasKeyboardGrabbedGroupItemProperty = new BooleanProperty( false );

  // Whether a group item has been moved with the keyboard controls
  public readonly hasKeyboardMovedGroupItemProperty = new BooleanProperty( false );

  // Whether the user has changed the selected group item with the keyboard controls
  // TODO: Is this used? https://github.com/phetsims/scenery-phet/issues/815
  public readonly hasKeyboardSelectedDifferentGroupItemProperty = new BooleanProperty( false );

  // Whether the hand drag icon is currently showing on the group item area
  public readonly isDragIndicatorVisibleProperty: TProperty<boolean>;

  // The value on the number line for the group item that the drag indicator is currently over
  public readonly dragIndicatorValueProperty: Property<number | null>;

  // Whether a group item has ever been dragged to a new value in the current scene // TODO: "in the current scene" is likely incorrect. https://github.com/phetsims/scenery-phet/issues/815
  public readonly groupItemHasBeenDraggedProperty: Property<boolean>;

  // TODO: extend EnabledComponent? This is just a CAV studio thing right now soccerBallsEnabledProperty. https://github.com/phetsims/scenery-phet/issues/815
  // TODO: if disabled, should we be able to change selection in group (without grabbing one). https://github.com/phetsims/scenery-phet/issues/815
  public constructor( public readonly dragEnabledProperty: TReadOnlyProperty<boolean>, providedOptions: GroupSortInteractionModelOptions ) {

    const options = optionize<GroupSortInteractionModelOptions, SelfOptions, ParentOptions>()( {
      tandem: Tandem.OPTIONAL
    }, providedOptions );

    // TODO: migration rules when moving to groupSortInteractionModel, https://github.com/phetsims/scenery-phet/issues/815
    // TODO: Rename to hasSoccerBallBeenDraggedProperty https://github.com/phetsims/scenery-phet/issues/815
    // TODO: MS!!! Can you tell me why these are stateful, but the other group sort interaction ones aren't? For example,
    //       the drag indicator position is, but the focused group item isn't? https://github.com/phetsims/scenery-phet/issues/815
    this.groupItemHasBeenDraggedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'groupItemHasBeenDraggedProperty' ),
      phetioFeatured: false
    } );

    this.isDragIndicatorVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isDragIndicatorVisibleProperty' ),
      phetioReadOnly: true,
      phetioFeatured: false
    } );

    // Cannot take a range, since it is nullable
    this.dragIndicatorValueProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'dragIndicatorValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioFeatured: false,
      phetioReadOnly: true,
      // TODO: this seems weird to call a hand. Also "ball", MS!!! https://github.com/phetsims/scenery-phet/issues/815
      phetioDocumentation: 'Sets the location of the hand/arrow on the number line. If one or more group items exist at that location, the indicator appears on the topmost ball.'
    } );

    // TODO: Rename to "cue" https://github.com/phetsims/scenery-phet/issues/815
    this.isGrabReleaseVisibleProperty = new DerivedProperty( [ this.focusedGroupItemProperty, this.hasKeyboardGrabbedGroupItemProperty, this.isKeyboardFocusedProperty ],
      ( focusedGroupItem, hasGrabbedBall, hasKeyboardFocus ) => {
        return focusedGroupItem !== null && !hasGrabbedBall && hasKeyboardFocus;
      } );

    // TODO: inline, and likely don't need to make an option for this grabCondition. https://github.com/phetsims/scenery-phet/issues/815
    const createDerivedProperty = ( conditionProperty: TReadOnlyProperty<boolean>, grabCondition: ( isSoccerBallKeyboardGrabbed: boolean ) => boolean ) => new DerivedProperty(
      [ this.focusedGroupItemProperty, this.isGroupItemKeyboardGrabbedProperty, this.isKeyboardFocusedProperty, conditionProperty ],
      ( focusedBall, isSoccerBallKeyboardGrabbed, isKeyboardFocused, condition ) =>
        focusedBall !== null && grabCondition( isSoccerBallKeyboardGrabbed ) && isKeyboardFocused && !condition );

    this.isKeyboardDragArrowVisibleProperty = createDerivedProperty( this.hasKeyboardMovedGroupItemProperty, isSoccerBallKeyboardGrabbed => isSoccerBallKeyboardGrabbed );
  }


  /**
   * TODO: doc https://github.com/phetsims/scenery-phet/issues/815
   */
  public updateDragIndicator( sceneModel: Pick<SoccerSceneModel, 'getActiveSoccerBalls' | 'getSortedStackedObjects'>, soccerBallCount: number, maxKicks: number ): void {

    //  if an object was moved, objects are not input enabled, or the max number of balls haven't been kicked out
    //  don't show the dragIndicatorArrowNode
    this.isDragIndicatorVisibleProperty.value = !this.groupItemHasBeenDraggedProperty.value &&
                                                !this.isKeyboardFocusedProperty.value &&
                                                soccerBallCount === maxKicks &&
                                                this.dragEnabledProperty.value &&
                                                _.every( sceneModel?.getActiveSoccerBalls(), soccerBall => soccerBall.valueProperty.value !== null );

    const reversedBalls = sceneModel.getActiveSoccerBalls().filter( soccerBall => soccerBall.valueProperty.value !== null ).reverse();

    // Show the drag indicator over the most recently landed ball
    this.dragIndicatorValueProperty.value = reversedBalls.length > 0 ? reversedBalls[ 0 ].valueProperty.value : null;
  }


  public moveToFocus( focusedSoccerBall: SoccerBall | null ): void {
    // TODO: needed for CAV, elsewhere too? https://github.com/phetsims/scenery-phet/issues/815
  }

  /**
   * Reset the interaction without changing the cueing logic.
   */
  public resetInteractionState(): void {
    this.focusedGroupItemProperty.reset();
    this.isGroupItemKeyboardGrabbedProperty.reset();
    this.isKeyboardFocusedProperty.reset();
  }

  // TODO: handle reset for dragIndicator entities. https://github.com/phetsims/scenery-phet/issues/815
  public reset(): void {
    this.resetInteractionState();

    // TODO: is it ok for this to be after isKeyboardFocusedProperty? https://github.com/phetsims/scenery-phet/issues/815
    this.hasKeyboardGrabbedGroupItemProperty.reset();
    this.hasKeyboardSelectedDifferentGroupItemProperty.reset();
    this.hasKeyboardMovedGroupItemProperty.reset();
    this.groupItemHasBeenDraggedProperty.reset(); // TODO: reset this? https://github.com/phetsims/scenery-phet/issues/815
  }

  public clearFocus(): void {
    this.focusedGroupItemProperty.value = null;
  }
}

soccerCommon.register( 'GroupSortInteractionModel', GroupSortInteractionModel );
