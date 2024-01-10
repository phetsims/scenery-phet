// Copyright 2023, University of Colorado Boulder

/**
 * GroupSortInteractionModel
 *
 * In general, there is just one instance of this per model, and not per scene. This is because if someone can
 * successfully grab and sort in one scene, then that data should transfer to the next scene.
 *
 * To implement:
 * - use with GroupSortInteractionView
 * - call updateSortIndicator() manually (see CAV)
 * - Handle your own GrabReleaseCueNode (grabReleaseCueVisibleProperty as its visibleProperty)
 * - handle your own sort indicator cue node (see registerUpdateSortIndicatorNode())
 * - hasGroupItemBeenSortedProperty set to true on mouse/touch sorting interactions.
 *
 *
 * TODO: Dispose? Yes, once it isn't in soccer common anymore https://github.com/phetsims/scenery-phet/issues/815
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 *
 */

import soccerCommon from '../soccerCommon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import Property from '../../../axon/js/Property.js';
import Tandem from '../../../tandem/js/Tandem.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import NullableIO from '../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../tandem/js/types/NumberIO.js';
import { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';
import TProperty from '../../../axon/js/TProperty.js';
import Vector2 from '../../../dot/js/Vector2.js';
import { SoccerBallPhase } from './SoccerBallPhase.js';
import TEmitter from '../../../axon/js/TEmitter.js';

type SelfOptions = EmptySelfOptions;

// TODO: Remove me? https://github.com/phetsims/scenery-phet/issues/815
// TODO: same parametric type for number as the sortIndicatorValue. https://github.com/phetsims/scenery-phet/issues/815
export type ItemModelType = {
  valueProperty: TProperty<number | null>;
  positionProperty: TProperty<Vector2>;
  soccerBallPhaseProperty: TProperty<SoccerBallPhase>;
  toneEmitter: TEmitter<[ number ]>;
};

type ParentOptions = Pick<PhetioObjectOptions, 'tandem'>;

// TODO: "Soccer ball" -> "group item" https://github.com/phetsims/scenery-phet/issues/815
export type GroupSortInteractionModelOptions = SelfOptions & ParentOptions;

export default class GroupSortInteractionModel<ItemModel extends ItemModelType> {

  // The ItemModel that is receiving the highlight focus within the group highlight.
  public readonly focusedGroupItemProperty = new Property<ItemModel | null>( null, {
    isValidValue: x => !!x || x === null
  } );

  // Whether a group item is being grabbed via keyboard interaction
  public readonly isGroupItemKeyboardGrabbedProperty = new Property( false );

  // Whether the 'Press SPACE to Grab or Release' dialog is showing
  public readonly grabReleaseCueVisibleProperty: TReadOnlyProperty<boolean>;

  // Whether the keyboard sort icon cue is showing // TODO: Not specific to "arrow" https://github.com/phetsims/scenery-phet/issues/815
  public readonly keyboardSortArrowCueVisibleProperty: TReadOnlyProperty<boolean>;

  // Whether the keyboard is currently focused on a sim component
  public readonly isKeyboardFocusedProperty = new BooleanProperty( false );

  // Properties that switch to true when the specified action has occurred once.
  public readonly hasKeyboardGrabbedGroupItemProperty = new BooleanProperty( false );

  // Whether a group item has been sorted with keyboard input.
  public readonly hasKeyboardSortedGroupItemProperty = new BooleanProperty( false );

  // Whether the user has changed the selected group item with the keyboard controls
  // TODO: MS!!! Is this used? https://github.com/phetsims/scenery-phet/issues/815
  public readonly hasKeyboardSelectedDifferentGroupItemProperty = new BooleanProperty( false );

  // Whether the mouse/touch sort icon cue is currently showing on the group item area
  public readonly sortIndicatorCueVisibleProperty: TProperty<boolean>;

  // The value for group item that the sort indicator is set to; null when there are no group items to sort.
  /*
    TODO: Delete and inline with focusedGroupItem.valueProperty? https://github.com/phetsims/scenery-phet/issues/815
    MS and MK talked. YES!!!
    potential reasons?
        interactive highlighting controls focusGroupItemProperty also? No this isn't true, that is separate.
        the hand when you kick out all balls, that can ALWAYS match the focused group item Property
        Make sure to test interativeHighlighting + keyboard + mousetouch.
   */
  public readonly sortIndicatorValueProperty: Property<number | null>; // TODO: should this be parametrized to support Vector2 also? https://github.com/phetsims/scenery-phet/issues/815

  // Whether any group item has ever been sorted to a new value, even if not by the group sort interaction. For best results,
  // set this to true from other interactions too (like mouse/touch).
  public readonly hasGroupItemBeenSortedProperty: Property<boolean>;

  // TODO: extend EnabledComponent? This is just a CAV studio thing right now soccerBallsEnabledProperty. https://github.com/phetsims/scenery-phet/issues/815
  // TODO: if disabled, should we be able to change selection in group (without grabbing one). https://github.com/phetsims/scenery-phet/issues/815
  public constructor( public readonly sortEnabledProperty: TReadOnlyProperty<boolean>, providedOptions?: GroupSortInteractionModelOptions ) {

    const options = optionize<GroupSortInteractionModelOptions, SelfOptions, ParentOptions>()( {
      tandem: Tandem.OPTIONAL
    }, providedOptions );

    // TODO: migration rules when moving to groupSortInteractionModel, https://github.com/phetsims/scenery-phet/issues/815
    // TODO: MS!!! Can you tell me why these are stateful, but the other group sort interaction ones aren't? For example,
    //       the sort indicator position is, but the focused group item isn't? https://github.com/phetsims/scenery-phet/issues/815
    this.hasGroupItemBeenSortedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'hasGroupItemBeenSortedProperty' ),
      phetioFeatured: false
    } );

    this.sortIndicatorCueVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'sortIndicatorCueVisibleProperty' ),
      phetioReadOnly: true,
      phetioFeatured: false
    } );

    // Cannot take a range, since it is nullable
    this.sortIndicatorValueProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'sortIndicatorValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioFeatured: false,
      phetioReadOnly: true,
      // TODO: this seems weird to call a hand. Also "ball", MS!!! https://github.com/phetsims/scenery-phet/issues/815
      phetioDocumentation: 'Sets the location of the hand/arrow on the number line. If one or more group items exist at that location, the indicator appears on the topmost ball.'
    } );

    this.grabReleaseCueVisibleProperty = new DerivedProperty( [
      this.focusedGroupItemProperty,
      this.hasKeyboardGrabbedGroupItemProperty,
      this.isKeyboardFocusedProperty
    ], ( focusedGroupItem, hasGrabbedBall, hasKeyboardFocus ) => {
      return focusedGroupItem !== null && !hasGrabbedBall && hasKeyboardFocus;
    } );

    this.keyboardSortArrowCueVisibleProperty = new DerivedProperty( [
      this.focusedGroupItemProperty,
      this.isGroupItemKeyboardGrabbedProperty,
      this.isKeyboardFocusedProperty,
      this.hasKeyboardSortedGroupItemProperty
    ], ( focusedGroupItem, isGroupItemKeyboardGrabbed, isKeyboardFocused, hasKeyboardSortedGroupItem ) =>
      focusedGroupItem !== null && isGroupItemKeyboardGrabbed && isKeyboardFocused && !hasKeyboardSortedGroupItem );
  }

  /**
   * Apply a heuristic to set the sort indicator value
   */
  public updateSortIndicator(): void {
    this.moveSortIndicatorToFocusedGroupItem();
  }

  // No op if there is no stored focusedGroupItem.
  public moveSortIndicatorToFocusedGroupItem(): void {
    const focusedGroupItem = this.focusedGroupItemProperty.value;
    if ( focusedGroupItem !== null ) {

      // If there is an already focused group item, i.e. a group item that has been selected or tabbed to via the keyboard,
      // that takes precedence for indication.
      this.sortIndicatorValueProperty.value = focusedGroupItem.valueProperty.value;
    }
  }

  /**
   * Reset the interaction without changing the cueing logic.
   */
  public resetInteractionState(): void {
    this.focusedGroupItemProperty.reset();
    this.isGroupItemKeyboardGrabbedProperty.reset();
    this.isKeyboardFocusedProperty.reset();
  }

  // TODO: MS!!!! handle reset for sortIndicator entities? None were reset before this refactor https://github.com/phetsims/scenery-phet/issues/815
  public reset(): void {
    this.resetInteractionState();

    this.hasGroupItemBeenSortedProperty.reset();
    this.hasKeyboardGrabbedGroupItemProperty.reset();
    this.hasKeyboardSelectedDifferentGroupItemProperty.reset();
    this.hasKeyboardSortedGroupItemProperty.reset();
  }

  public clearFocus(): void {
    this.focusedGroupItemProperty.value = null;
  }

  // Register your closure responsible for updating the sort-indicator node.
  public registerUpdateSortIndicatorNode( updateSortIndicatorNode: () => void ): void {
    this.sortIndicatorCueVisibleProperty.link( updateSortIndicatorNode );
    this.sortIndicatorValueProperty.link( updateSortIndicatorNode );
    this.focusedGroupItemProperty.link( updateSortIndicatorNode );
  }
}

soccerCommon.register( 'GroupSortInteractionModel', GroupSortInteractionModel );
