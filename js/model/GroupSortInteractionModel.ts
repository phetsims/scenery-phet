// Copyright 2023, University of Colorado Boulder

/**
 * "Group Sort Interaction" overview:
 * Model type for the "group sort" interaction. This interaction behaves as such:
 * - Alt input treats the entire group as a single entity.
 * - Focusing on the group highlights a "selected" group item. The interaction starts in "selection" mode.
 * - Interaction keys change the "selection" (focus) of a group item to grab (see note below). Focus highlight is solid.
 * - Space/enter are used to "grab" the selection, turning the interaction into "sorting" mode. Pressing again goes back
 *   to "selection" mode. In sorting mode, the focus highlight is dashed.
 * - Interaction keys in "sorting" mode sort the group item.
 *
 * NOTE: "focus" in this interaction is called "selection" as to not overload the term. This is because the
 * "focused" group item is stored and changed even when it doesn't have browser focus on it. See selectedGroupItemProperty.
 *
 * Class Overview:
 * This class Holds model information about the state of the group sort interaction. This includes specifics about
 * whether the interaction is in "selection" or "sorting" mode. Also about if the interaction has "successfully" occurred
 * such that hint cues don't need to be displayed anymore.
 *
 * In general, there is just one instance of this per model, and not per scene. This is because if someone can
 * successfully grab and sort in one scene, then that data should transfer to the next scene.
 *
 * This implementation relies on the model elements to be sorted to have a valueProperty that gets the value set to it.
 *
 * Implementation steps (these steps apply to the model and view):
 * - use with GroupSortInteractionView
 * - call updateSortIndicator() manually (see CAV)
 * - Handle your own GrabReleaseCueNode (grabReleaseCueVisibleProperty as its visibleProperty)
 * - Handle your own "sort indicator cue node" (see registerUpdateSortIndicatorNode())
 * - hasGroupItemBeenSortedProperty set to true also on mouse/touch sorting interactions.
 * - Set up well for one model per screen to be used with one view per scene.
 * - use GroupSortInteractionView.groupFocusHighlightPath.shape to set the group highlight dynamically
 * - use positionSortCueNodeEmitter to update the position of the sort cue.
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

type SelfOptions = EmptySelfOptions;

export type ItemModelType = {
  valueProperty: TProperty<number | null>;
};

type ParentOptions = Pick<PhetioObjectOptions, 'tandem'>;

export type GroupSortInteractionModelOptions = SelfOptions & ParentOptions;

export default class GroupSortInteractionModel<ItemModel extends ItemModelType> {

  // The group item that is the selected/focused/sorted. If null, then there is nothing to sort (no items?), and the
  // interaction will no-op. Feel free to dynamically change this value to update the realtime selection of the
  // group sort interaction.
  public readonly selectedGroupItemProperty = new Property<ItemModel | null>( null, {
    isValidValue: x => !!x || x === null
  } );

  // Whether a group item is being grabbed via keyboard interaction. When true, the focus highlight will display as
  // dashed instead of solid.
  public readonly isGroupItemKeyboardGrabbedProperty = new BooleanProperty( false );

  // Whether the 'Press SPACE to Grab or Release' dialog is showing
  public readonly grabReleaseCueVisibleProperty: TReadOnlyProperty<boolean>;

  // Whether the keyboard sort icon cue is showing
  public readonly keyboardSortCueVisibleProperty: TReadOnlyProperty<boolean>;

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
  public readonly mouseSortCueVisibleProperty: Property<boolean>;

  // The value for group item that the sort indicator is set to; null when there are no group items to sort.
  /*
    TODO: Delete and inline with focusedGroupItem.valueProperty? https://github.com/phetsims/scenery-phet/issues/815
    MS and MK talked. YES!!!
    potential reasons?
        interactive highlighting controls selectedGroupItemProperty also? No this isn't true, that is separate.
        the hand when you kick out all balls, that can ALWAYS match the selected group item Property
        Make sure to test interativeHighlighting + keyboard + mousetouch.
   */
  public readonly sortIndicatorValueProperty: Property<number | null>;

  // Whether any group item has ever been sorted to a new value, even if not by the group sort interaction. For best results,
  // set this to true from other interactions too (like mouse/touch).
  public readonly hasGroupItemBeenSortedProperty: Property<boolean>;

  // TODO: extend EnabledComponent? This is just a CAV studio thing right now soccerBallsEnabledProperty. https://github.com/phetsims/scenery-phet/issues/815
  // TODO: if disabled, should we be able to change selection in group (without grabbing one). https://github.com/phetsims/scenery-phet/issues/815
  public constructor( public readonly sortEnabledProperty: TReadOnlyProperty<boolean>, providedOptions?: GroupSortInteractionModelOptions ) {

    const options = optionize<GroupSortInteractionModelOptions, SelfOptions, ParentOptions>()( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    // TODO: Redo the PhET-iO Design, (including "ball" documentation) https://github.com/phetsims/scenery-phet/issues/815
    this.hasGroupItemBeenSortedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'hasGroupItemBeenSortedProperty' ),
      phetioFeatured: false
    } );

    this.mouseSortCueVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'mouseSortCueVisibleProperty' ),
      phetioReadOnly: true,
      phetioFeatured: false
    } );

    // Cannot take a range, since it is nullable
    this.sortIndicatorValueProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'sortIndicatorValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioFeatured: false,
      phetioReadOnly: true,
      phetioDocumentation: 'Sets the location of the hand/arrow on the number line. If one or more group items exist at that location, the indicator appears on the topmost ball.'
    } );

    this.grabReleaseCueVisibleProperty = new DerivedProperty( [
      this.selectedGroupItemProperty,
      this.hasKeyboardGrabbedGroupItemProperty,
      this.isKeyboardFocusedProperty
    ], ( selectedGroupItem, hasGrabbedBall, hasKeyboardFocus ) => {
      return selectedGroupItem !== null && !hasGrabbedBall && hasKeyboardFocus;
    } );

    this.keyboardSortCueVisibleProperty = new DerivedProperty( [
      this.selectedGroupItemProperty,
      this.isGroupItemKeyboardGrabbedProperty,
      this.isKeyboardFocusedProperty,
      this.hasKeyboardSortedGroupItemProperty
    ], ( selectedGroupItem, isGroupItemKeyboardGrabbed, isKeyboardFocused, hasKeyboardSortedGroupItem ) =>
      selectedGroupItem !== null && isGroupItemKeyboardGrabbed && isKeyboardFocused && !hasKeyboardSortedGroupItem );
  }

  /**
   * Apply a heuristic to set the sort indicator value
   */
  public updateSortIndicator(): void {
    this.moveSortIndicatorToSelectedGroupItem();
  }

  // No op if there is no stored selectedGroupItem.
  public moveSortIndicatorToSelectedGroupItem(): void {
    const selectedGroupItem = this.selectedGroupItemProperty.value;
    if ( selectedGroupItem !== null ) {

      // If there is an already selected group item, i.e. a group item that has been selected or tabbed to via the keyboard,
      // that takes precedence for indication.
      this.sortIndicatorValueProperty.value = selectedGroupItem.valueProperty.value;
    }
  }

  /**
   * Reset the interaction without changing the cueing logic. This is best called during a data "erase" and also when
   * switching between scenes.
   */
  public resetInteractionState(): void {
    this.selectedGroupItemProperty.reset();
    this.isGroupItemKeyboardGrabbedProperty.reset();
    this.isKeyboardFocusedProperty.reset();
  }

  public reset(): void {
    this.resetInteractionState();

    this.hasGroupItemBeenSortedProperty.reset();
    this.hasKeyboardGrabbedGroupItemProperty.reset();
    this.hasKeyboardSelectedDifferentGroupItemProperty.reset();
    this.hasKeyboardSortedGroupItemProperty.reset();
    this.mouseSortCueVisibleProperty.reset();
  }

  public clearFocus(): void {
    this.selectedGroupItemProperty.value = null;
  }

  // Register your closure responsible for updating the sort-indicator node.
  public registerUpdateSortIndicatorNode( updateSortIndicatorNode: () => void ): void {
    this.mouseSortCueVisibleProperty.link( updateSortIndicatorNode );
    this.sortIndicatorValueProperty.link( updateSortIndicatorNode );
    this.selectedGroupItemProperty.link( updateSortIndicatorNode );
  }
}

soccerCommon.register( 'GroupSortInteractionModel', GroupSortInteractionModel );
