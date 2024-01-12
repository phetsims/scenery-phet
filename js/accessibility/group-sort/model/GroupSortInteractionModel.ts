// Copyright 2024, University of Colorado Boulder

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
 * - reset selectedGroupItemProperty with a sim-specific heuristic when the underlying model needs to update the best
 *     first selection. (Also see GroupSortInteractionView.getGroupItemToSelect for a hook to apply this on group focus).
 * - Handle your own GrabReleaseCueNode (grabReleaseCueVisibleProperty as its visibleProperty)
 * - Handle your own "sort indicator cue node" (see registerUpdateSortIndicatorNode())
 * - hasGroupItemBeenSortedProperty set to true also on mouse/touch sorting interactions.
 * - mouseSortCueVisibleProperty should be set by client, taking into consideration: `!this.hasGroupItemBeenSortedProperty.value && !this.isKeyboardFocusedProperty.value`
 * - Set up well for one model per screen to be used with one view per scene.
 * - use GroupSortInteractionView.groupFocusHighlightPath.shape to set the group highlight dynamically
 * - use positionSortCueNodeEmitter to update the position of the sort cue.
 * - use enabledProperty to control if sorting is enabled. Note that focus and selection are always available (for keyboard tab order consistency) // TODO: DESIGN! Right? https://github.com/phetsims/scenery-phet/issues/815
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import sceneryPhet from '../../../sceneryPhet.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import Property from '../../../../../axon/js/Property.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import { PhetioObjectOptions } from '../../../../../tandem/js/PhetioObject.js';
import TProperty from '../../../../../axon/js/TProperty.js';
import EnabledComponent, { EnabledComponentOptions } from '../../../../../axon/js/EnabledComponent.js';

type SelfOptions = Pick<PhetioObjectOptions, 'tandem'>;

export type ItemModelType = {
  valueProperty: TProperty<number | null>;
};

type ParentOptions = EnabledComponentOptions;

export type GroupSortInteractionModelOptions = SelfOptions & ParentOptions;

export default class GroupSortInteractionModel<ItemModel extends ItemModelType> extends EnabledComponent {

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

  // Whether any group item has ever been sorted to a new value, even if not by the group sort interaction. For best results,
  // set this to true from other interactions too (like mouse/touch).
  public readonly hasGroupItemBeenSortedProperty: Property<boolean>;

  // TODO: DESIGN!!! if disabled, should we be able to change selection in group (without grabbing one). https://github.com/phetsims/scenery-phet/issues/815
  public constructor( providedOptions?: GroupSortInteractionModelOptions ) {

    const options = optionize<GroupSortInteractionModelOptions, SelfOptions, ParentOptions>()( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

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

    this.grabReleaseCueVisibleProperty = new DerivedProperty( [
      this.selectedGroupItemProperty,
      this.hasKeyboardGrabbedGroupItemProperty,
      this.isKeyboardFocusedProperty,
      this.enabledProperty
    ], ( selectedGroupItem, hasGrabbedBall, hasKeyboardFocus, enabled ) => {
      return selectedGroupItem !== null && !hasGrabbedBall && hasKeyboardFocus && enabled;
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

  public clearSelection(): void {
    this.selectedGroupItemProperty.value = null;
  }

  // Register your closure responsible for updating the sort-indicator node.
  public registerUpdateSortIndicatorNode( updateSortIndicatorNode: () => void ): void {
    this.mouseSortCueVisibleProperty.link( updateSortIndicatorNode );
    this.selectedGroupItemProperty.link( updateSortIndicatorNode );

    this.disposeEmitter.addListener( () => {
      this.mouseSortCueVisibleProperty.unlink( updateSortIndicatorNode );
      this.selectedGroupItemProperty.unlink( updateSortIndicatorNode );
    } );
  }

  public override dispose(): void {
    this.selectedGroupItemProperty.dispose();
    this.isGroupItemKeyboardGrabbedProperty.dispose();
    this.grabReleaseCueVisibleProperty.dispose();
    this.keyboardSortCueVisibleProperty.dispose();
    this.isKeyboardFocusedProperty.dispose();
    this.hasKeyboardGrabbedGroupItemProperty.dispose();
    this.hasKeyboardSortedGroupItemProperty.dispose();
    this.hasKeyboardSelectedDifferentGroupItemProperty.dispose();
    this.mouseSortCueVisibleProperty.dispose();
    this.hasGroupItemBeenSortedProperty.dispose();
    super.dispose();
  }
}

sceneryPhet.register( 'GroupSortInteractionModel', GroupSortInteractionModel );
