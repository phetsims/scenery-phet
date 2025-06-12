// Copyright 2024-2025, University of Colorado Boulder

/**
 * "Group Sort Interaction" overview:
 * Model type for the "group sort" interaction. This interaction behaves as such:
 * - Alt input treats the entire group as a single entity. Instead of using scenery focus control, it is handled internally.
 * - Focusing on the group highlights a "selected" group item. The interaction starts in "selection" state.
 * - Interaction keys change the "selection" (focus) of a group item. Focus highlight around the selected item is solid.
 * - The selected item is grabbable (see note below).
 * - Space/enter are used to "grab" the selection, turning the interaction state to "sorting" state. Pressing again
 *   toggles back to "selection" state. In sorting state, the focus highlight is dashed.
 * - Interaction keys in "sorting" state sort the group item, which changes the value of that group item.
 *
 * NOTE: "focus" in this interaction is called "selection" as to not overload the term. This is because the
 * "focused" group item is stored and changed even when it doesn't have browser focus on it. See selectedGroupItemProperty.
 *
 * Class Overview:
 * This class holds model information about the state of the group sort interaction. This includes specifics about
 * whether the interaction is in "selection" or "sorting" state. Also about if portions of the interaction have
 * "successfully" occurred such that hint cues don't need to be displayed anymore.
 *
 * A note about mouse input:
 * All group sort instances thus far have been accompanied by mouse/touch input as well. Though this goes beyond the
 * scope of group sort to implement, there are mouse-specific Properties here in the model that help sync group
 * sort state/cueing with the visual cueing too. Please follow instructions below to make sure those are used
 * appropriately.
 *
 * A note about using with scenes:
 * In general, there is just one instance of this per model, and not per scene. This is because if someone can
 * successfully grab and sort in one scene, then that learned understanding about the interaction should transfer to
 * the next scene.
 *
 * A note about PhET-iO:
 * Properties that handle visual cue states are not PhET-iO instrumented, because they are considered transient.
 * See showMouseCueProperty for the extent of PhET-iO customization.
 *
 * Implementation steps (these steps apply to the model and view):
 * - use with GroupSortInteractionView
 * - reset selectedGroupItemProperty with a sim-specific heuristic when the underlying model needs to update the best
 *   first selection. (Also see GroupSortInteractionView.getGroupItemToSelect for a hook to apply this on group focus).
 * - the grab/release cue is created for you, and can be repositioned by accessing from your GroupSortInteractionView instance.
 * - Handle your own keyboard and mouse "sort indicator cue node" (see registerUpdateSortCueNode())
 * - use setMouseSortedGroupItem( true ) on mouse/touch sorting interactions to make sure that the mouse sort cue visibility is correct.
 * - mouseSortCueVisibleProperty should be set by client, using mouseSortCueShouldBeVisible() in addition to any sim-specific logic required.
 * - It is best to use one model per screen and one view per scene.
 * - use GroupSortInteractionView.groupSortGroupFocusHighlightPath.shape to set the group highlight dynamically
 * - use positionSortCueNodeEmitter to update the position of the sort cue for the keyboard interaction.
 * - use enabledProperty to control if sorting is enabled. Note that focus and selection are always available (for keyboard tab order consistency)
 * - Note that if GroupSelectModel is PhET-iO instrumented, ItemModel must be a PhetioObject.
 * - Note that "null" is a reserved value, and should not be a value of ItemModel.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import EnabledComponent, { EnabledComponentOptions } from '../../../../../axon/js/EnabledComponent.js';
import Property from '../../../../../axon/js/Property.js';
import TProperty from '../../../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../../tandem/js/PhetioObject.js';
import phetioStateSetEmitter from '../../../../../tandem/js/phetioStateSetEmitter.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import IOType from '../../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../../tandem/js/types/NullableIO.js';
import ReferenceIO from '../../../../../tandem/js/types/ReferenceIO.js';
import sceneryPhet from '../../../sceneryPhet.js';

type SelfOptions<ItemModel> = {

  // A function that returns the "value" for a group item set to it. The value is where the item should be sorted.
  // Null means that it isn't part of this interaction (different scene/not active/etc).
  getGroupItemValue: ( itemModel: ItemModel ) => number | null;

  // Define the startup value of the mouseSortCue. False by default.
  initialMouseSortCueVisible?: boolean;

  phetioMouseSortCueInstrumented?: boolean;
} & Pick<PhetioObjectOptions, 'tandem'>;

type ParentOptions = EnabledComponentOptions;

export type GroupSelectModelOptions<ItemModel> = SelfOptions<ItemModel> & ParentOptions;

export default class GroupSelectModel<ItemModel> extends EnabledComponent {

  // The group item that is the selected/focused/sorted. If null, then there is nothing to sort (no items?), and the
  // interaction will no-op. Feel free to dynamically change this value to update the realtime selection of the
  // group sort interaction.
  public readonly selectedGroupItemProperty: Property<ItemModel | null>;

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

  // Whether the user has changed the selected group item with the keyboard controls. Note, this will not be true until
  // the selection changes from the default upon focus.
  public readonly hasKeyboardSelectedGroupItemProperty = new BooleanProperty( false );

  // Whether the mouse/touch sort icon cue is currently showing on the group item area.
  // Client should set this Property as well as use it for their mouse sort cue node.
  // Client should manually register callbacks to update the visual cue with registerUpdateSortCueNode().
  public readonly mouseSortCueVisibleProperty: Property<boolean>;

  // A PhET-iO specific Property for opting out of showing the visual mouse cue. This is not reset, and is used to
  // calculate the visibility of the mouse cue. If true, it doesn't mean that the cue is visible, but that it is possible
  // to show the cue when appropriate. Set to false to opt out of cue visibility.
  private readonly showMouseCueProperty: TProperty<boolean>;

  // Whether a group item has been sorted with mouse/touch (non keyboard) input. This is set to true from outside
  // input (not from keyboard/group sort input), but is important for cue showing.
  public readonly hasMouseSortedGroupItemProperty = new BooleanProperty( false );

  private readonly initialMouseSortCueVisible: boolean;

  // Whether any group item has yet been sorted to a new value, even if not by the "group sort" interaction. This
  // Property should be used to control the mouseSortCueVisibleProperty. The mouse sort cue does not need to be shown
  // if a keyboard sort has occurred (because now the user knows that the group items are sortable).
  public readonly hasGroupItemBeenSortedProperty: TReadOnlyProperty<boolean>;

  public readonly getGroupItemValue: ( itemModel: ItemModel ) => number | null;

  public constructor( providedOptions?: GroupSelectModelOptions<ItemModel> ) {
    const options = optionize<GroupSelectModelOptions<ItemModel>, SelfOptions<ItemModel>, ParentOptions>()( {
      tandem: Tandem.REQUIRED,
      phetioEnabledPropertyInstrumented: false,
      initialMouseSortCueVisible: false,
      phetioMouseSortCueInstrumented: true
    }, providedOptions );

    super( options );

    this.getGroupItemValue = options.getGroupItemValue;
    this.initialMouseSortCueVisible = options.initialMouseSortCueVisible;

    this.selectedGroupItemProperty = new Property<ItemModel | null>( null, {
      isValidValue: x => x !== undefined,
      tandem: options.tandem.createTandem( 'selectedGroupItemProperty' ),
      phetioValueType: NullableIO( ReferenceIO( IOType.ObjectIO ) ),
      phetioReadOnly: true,
      phetioDocumentation: 'For PhET-iO internal use only. Tracks the current selection for the interaction. Null means there is no selection.'
    } );

    assert && this.selectedGroupItemProperty.lazyLink( ( selectedGroupItem, oldSelectedGroupItem ) => {
      if ( this.isGroupItemKeyboardGrabbedProperty.value && ( selectedGroupItem !== null ) && ( oldSelectedGroupItem !== null ) ) {
        assert && assert( this.getGroupItemValue( selectedGroupItem ) === this.getGroupItemValue( oldSelectedGroupItem ),
          'should not change both the selection and the value when sorting' );
      }

      // If we are PhET-iO instrumented, so should the selection.
      if ( Tandem.VALIDATION && selectedGroupItem !== null && options.tandem.supplied ) {
        assert && assert( selectedGroupItem instanceof PhetioObject && selectedGroupItem.isPhetioInstrumented(),
          'instrumented GroupSortInteractionModels require its group items to be instrumented.' );
      }
    } );

    this.mouseSortCueVisibleProperty = new Property( options.initialMouseSortCueVisible );

    this.showMouseCueProperty = new BooleanProperty( true, {
      tandem: options.phetioMouseSortCueInstrumented ? options.tandem.createTandem( 'showMouseCueProperty' ) : Tandem.OPT_OUT,
      phetioDocumentation: 'This controls if the visual cue Node for mouse/touch sorting is displayed. Set to false ' +
                           'to hide the cue. A value of true does not mean the cue is visible, but instead that it can ' +
                           'be shown when appropriate'
    } );

    this.hasGroupItemBeenSortedProperty = new DerivedProperty( [
      this.hasMouseSortedGroupItemProperty,
      this.hasKeyboardSortedGroupItemProperty
    ], ( hasMouseSortedGroupItem, hasKeyboardSortedGroupItem ) => {
      return hasMouseSortedGroupItem || hasKeyboardSortedGroupItem;
    } );

    this.grabReleaseCueVisibleProperty = new DerivedProperty( [
      this.selectedGroupItemProperty,
      this.hasKeyboardGrabbedGroupItemProperty,
      this.isKeyboardFocusedProperty,
      this.enabledProperty
    ], ( selectedGroupItem, hasGrabbedGroupItem, hasKeyboardFocus, enabled ) => {
      return selectedGroupItem !== null && !hasGrabbedGroupItem && hasKeyboardFocus && enabled;
    } );

    this.keyboardSortCueVisibleProperty = new DerivedProperty( [
      this.selectedGroupItemProperty,
      this.isGroupItemKeyboardGrabbedProperty,
      this.isKeyboardFocusedProperty,
      this.hasKeyboardSortedGroupItemProperty
    ], ( selectedGroupItem, isGroupItemKeyboardGrabbed, isKeyboardFocused, hasKeyboardSortedGroupItem ) =>
      selectedGroupItem !== null && isGroupItemKeyboardGrabbed && isKeyboardFocused && !hasKeyboardSortedGroupItem );
  }

  // Wrap this in a function to make sure that hasMouseSortedGroupItemProperty is never read or listened to. Instead,
  // listen to hasGroupItemBeenSortedProperty (like to set the mouseSortCueVisibleProperty).
  public setMouseSortedGroupItem( sortedByMouse: boolean ): void {
    this.hasMouseSortedGroupItemProperty.value = sortedByMouse;
  }

  // Given the knowledge that GroupSelectModel has, should the mouse sort cue be visible? This most often
  // isn't the complete boolean, since there will be sim-specific knowledge that contributes to the final visibility
  // of the Node.
  public mouseSortCueShouldBeVisible(): boolean {
    return this.showMouseCueProperty.value &&
           !this.hasGroupItemBeenSortedProperty.value &&
           !this.isKeyboardFocusedProperty.value &&
           this.enabled;
  }

  /**
   * Reset the interaction without changing the cueing logic. This is best called during a data "erase" and also when
   * switching between scenes.
   */
  public resetInteractionState(): void {

    // isGroupItemKeyboardGrabbedProperty needs to be reset before the selectedGroupItemProperty, because a
    // selectedGroupItemProperty listener is relying on an accurate isGroupItemKeyboardGrabbedProperty.value
    // to fire an assertion.
    this.isGroupItemKeyboardGrabbedProperty.reset();
    this.selectedGroupItemProperty.reset();
    this.isKeyboardFocusedProperty.reset();
  }

  public reset(): void {
    this.resetInteractionState();

    // Don't reset showMouseCueProperty because it is set only by PhET-iO, and should persist
    this.hasMouseSortedGroupItemProperty.reset();
    this.hasKeyboardGrabbedGroupItemProperty.reset();
    this.hasKeyboardSelectedGroupItemProperty.reset();
    this.hasKeyboardSortedGroupItemProperty.reset();

    // If a PhET-iO client has set showMouseCueProperty to false, then the mouseSortCueVisibleProperty needs to respect
    // that. It should only be shown on reset if mouseSortCueShouldBeVisible is true and our initial value is true.
    this.mouseSortCueVisibleProperty.value = this.initialMouseSortCueVisible && this.mouseSortCueShouldBeVisible();
  }

  // Clear the selection state for the interaction (setting to null)
  public clearSelection(): void {
    this.selectedGroupItemProperty.value = null;
  }

  // Register your closure responsible for updating the sort-indicator node. This should be called with a callback that
  // updates mouseSortCueVisibleProperty and maybe does other things. You will likely need to call this update function
  // for sim specific usages as well.
  public registerUpdateSortCueNode( updateSortIndicatorNode: () => void ): void {
    this.showMouseCueProperty.link( updateSortIndicatorNode );
    this.enabledProperty.link( updateSortIndicatorNode );
    this.selectedGroupItemProperty.link( updateSortIndicatorNode );
    this.hasGroupItemBeenSortedProperty.link( updateSortIndicatorNode );
    this.isKeyboardFocusedProperty.link( updateSortIndicatorNode );
    phetioStateSetEmitter.addListener( updateSortIndicatorNode );

    this.disposeEmitter.addListener( () => {
      phetioStateSetEmitter.removeListener( updateSortIndicatorNode );
      this.isKeyboardFocusedProperty.unlink( updateSortIndicatorNode );
      this.hasGroupItemBeenSortedProperty.unlink( updateSortIndicatorNode );
      this.mouseSortCueVisibleProperty.unlink( updateSortIndicatorNode );
      this.enabledProperty.unlink( updateSortIndicatorNode );
      this.showMouseCueProperty.unlink( updateSortIndicatorNode );
      this.selectedGroupItemProperty.unlink( updateSortIndicatorNode );
    } );
  }

  // Interrupt the group sort interaction
  public interrupt(): void {
    this.isKeyboardFocusedProperty.value = false;
    this.isGroupItemKeyboardGrabbedProperty.value = false;
  }

  public override dispose(): void {
    this.selectedGroupItemProperty.dispose();
    this.isGroupItemKeyboardGrabbedProperty.dispose();
    this.grabReleaseCueVisibleProperty.dispose();
    this.keyboardSortCueVisibleProperty.dispose();
    this.isKeyboardFocusedProperty.dispose();
    this.showMouseCueProperty.dispose();
    this.hasKeyboardGrabbedGroupItemProperty.dispose();
    this.hasKeyboardSortedGroupItemProperty.dispose();
    this.hasKeyboardSelectedGroupItemProperty.dispose();
    this.mouseSortCueVisibleProperty.dispose();
    this.hasGroupItemBeenSortedProperty.dispose();
    super.dispose();
  }
}

sceneryPhet.register( 'GroupSelectModel', GroupSelectModel );