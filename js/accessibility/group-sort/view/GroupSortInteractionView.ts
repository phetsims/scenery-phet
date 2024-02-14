// Copyright 2024, University of Colorado Boulder

/**
 * This doc assumes you have read the doc in GroupSortInteractionModel. Read that first as it explains the "group sort
 * interaction" more generally.
 *
 * The view of the "Group Sort Interaction." This type handles adding the controller for selecting, grabbing, and sorting
 * in the interaction for (keyboard). It also handles the individual and group focus highlights.
 *
 * This class can be used per scene, but the model is best used per screen.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import { animatedPanZoomSingleton, HighlightFromNode, HighlightPath, InteractiveHighlightingNode, KeyboardListener, Node, Path } from '../../../../../scenery/js/imports.js';
import sceneryPhet from '../../../sceneryPhet.js';
import Range from '../../../../../dot/js/Range.js';
import Multilink from '../../../../../axon/js/Multilink.js';
import GroupSortInteractionModel from '../model/GroupSortInteractionModel.js';
import Emitter from '../../../../../axon/js/Emitter.js';
import { Shape } from '../../../../../kite/js/imports.js';
import optionize, { combineOptions } from '../../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import SortCueArrowNode from './SortCueArrowNode.js';
import Disposable, { DisposableOptions } from '../../../../../axon/js/Disposable.js';
import GrabReleaseCueNode, { GrabReleaseCueNodeOptions } from '../../nodes/GrabReleaseCueNode.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions<ItemModel, ItemNode extends Node> = {

  // Given the delta (difference from current value to new value), return the corresponding next group item model to be selected.
  getNextSelectedGroupItem: ( delta: number, currentlySelectedGroupItem: ItemModel ) => ItemModel;

  // If GroupSortInteraction doesn't know what the selection should be, this function is called to set the default or
  // best guess selection. Return null to not supply a selection (no focus).
  getGroupItemToSelect: ( () => ItemModel | null );

  // Given a model item, return the corresponding node. Support 'null' as a way to support multiple scenes. If you
  // return null, it means that the provided itemModel is not associated with this view, and shouldn't be handled.
  getNodeFromModelItem: ( model: ItemModel ) => ItemNode | null;

  // Given a model item, return the corresponding focus highlight node. Defaults to the implementation of getNodeFromModelItem.
  // Return null if no highlight should be shown for the selection (not recommended).
  getHighlightNodeFromModelItem?: ( model: ItemModel ) => Node | null;

  // The available range for storing. This is the acceptable range for the valueProperty of ItemModel (see model.getGroupItemValue()).
  sortingRangeProperty: TReadOnlyProperty<Range>;

  // Do the sort operation, allowing for custom actions, must be implemented by all implementation, but likely just
  // should default to updating the "valueProperty" of the selected group item to the new value that is provided.
  sortGroupItem: ( groupItem: ItemModel, newValue: number ) => void;

  // Callback called after a group item is sorted. Note that sorting may not have changed its value (like if at the boundary
  // trying to move past the range).
  onSort?: ( groupItem: ItemModel, oldValue: number ) => void;

  // When the selected group item has been grabbed (into "sorting" state).
  onGrab?: ( groupItem: ItemModel ) => void;

  // When the selected group item is released (back into "selecting" state).
  onRelease?: ( groupItem: ItemModel ) => void;

  // If provided, listen to the number keys as well to sort the selected group item. Provide the value that the
  // number key maps to. A direct value, not a delta. If the function returns null, then no action takes place for the
  // input. If the option is set to null, then number keys will not be listened to for this interaction.
  numberKeyMapper?: ( ( pressedKeys: string ) => ( number | null ) ) | null;

  // The value-change delta step size when selecting/sorting the group items.
  sortStep?: number;   // arrow keys or WASD
  pageSortStep?: number; // page-up/down keys
  shiftSortStep?: number; // shift+arrow keys or shift+WASD

  // To be passed to the grab/release cue node (which is added to the group focus highlight). The visibleProperty is
  // always GroupSortInteractionModel.grabReleaseCueVisibleProperty
  grabReleaseCueOptions?: Partial<StrictOmit<GrabReleaseCueNodeOptions, 'visibleProperty'>>;
};

// A list of all keys that are listened to, except those covered by the numberKeyMapper
const sortingKeys = [
  'd', 'arrowRight', 'a', 'arrowLeft', 'arrowUp', 'arrowDown', 'w', 's', // default-step sort
  'shift+d', 'shift+arrowRight', 'shift+a', 'shift+arrowLeft', 'shift+arrowUp', 'shift+arrowDown', 'shift+w', 'shift+s', // shift-step sort
  'pageUp', 'pageDown', // page-step sort
  'home', 'end' // min/max
] as const;

type ParentOptions = DisposableOptions;
export type GroupSortInteractionViewOptions<ItemModel, ItemNode extends Node> = SelfOptions<ItemModel, ItemNode> & ParentOptions;

export default class GroupSortInteractionView<ItemModel, ItemNode extends Node> extends Disposable {

  // Update group highlight dynamically by setting the `shape` of this path.
  public readonly groupSortGroupFocusHighlightPath: Path;

  // The cue node for grab/release.
  public readonly grabReleaseCueNode: Node;

  // Emitted when the sorting cue should be repositioned. Most likely because the selection has changed.
  public readonly positionSortCueNodeEmitter = new Emitter();

  private readonly getNodeFromModelItem: ( model: ItemModel ) => ItemNode | null;
  private readonly sortGroupItem: ( groupItem: ItemModel, newValue: number ) => void;
  private readonly onSort: ( groupItem: ItemModel, oldValue: number ) => void;
  private readonly sortingRangeProperty: TReadOnlyProperty<Range>;
  private readonly sortStep: number;
  private readonly shiftSortStep: number;
  private readonly pageSortStep: number;

  public constructor(
    protected readonly model: GroupSortInteractionModel<ItemModel>,
    primaryFocusedNode: Node,
    providedOptions: GroupSortInteractionViewOptions<ItemModel, ItemNode> ) {

    const options = optionize<
      GroupSortInteractionViewOptions<ItemModel, ItemNode>,
      SelfOptions<ItemModel, ItemNode>,
      ParentOptions>()( {
      numberKeyMapper: null,
      onSort: _.noop,
      onGrab: _.noop,
      onRelease: _.noop,
      sortStep: 1,
      shiftSortStep: 2,
      pageSortStep: Math.ceil( providedOptions.sortingRangeProperty.value.getLength() / 5 ),
      getHighlightNodeFromModelItem: providedOptions.getNodeFromModelItem,
      grabReleaseCueOptions: {}
    }, providedOptions );

    super( options );

    this.getNodeFromModelItem = options.getNodeFromModelItem;
    this.sortGroupItem = options.sortGroupItem;
    this.onSort = options.onSort;
    this.sortingRangeProperty = options.sortingRangeProperty;
    this.sortStep = options.sortStep;
    this.shiftSortStep = options.shiftSortStep;
    this.pageSortStep = options.pageSortStep;

    const selectedGroupItemProperty = this.model.selectedGroupItemProperty;
    const isKeyboardFocusedProperty = this.model.isKeyboardFocusedProperty;
    const isGroupItemKeyboardGrabbedProperty = this.model.isGroupItemKeyboardGrabbedProperty;
    const hasKeyboardGrabbedGroupItemProperty = this.model.hasKeyboardGrabbedGroupItemProperty;

    const grabbedPropertyListener = ( grabbed: boolean ) => {
      const selectedGroupItem = selectedGroupItemProperty.value;
      if ( selectedGroupItem ) {
        if ( grabbed ) {
          options.onGrab( selectedGroupItem );
        }
        else {
          options.onRelease( selectedGroupItem );
        }
      }
    };
    isGroupItemKeyboardGrabbedProperty.lazyLink( grabbedPropertyListener );

    // If the new range doesn't include the current selection, reset back to the default heuristic.
    const rangeListener = ( newRange: Range ) => {
      const selectedGroupItem = this.model.selectedGroupItemProperty.value;
      if ( selectedGroupItem ) {
        const currentValue = this.model.getGroupItemValue( selectedGroupItem );
        if ( currentValue && !newRange.contains( currentValue ) ) {
          this.model.selectedGroupItemProperty.value = options.getGroupItemToSelect();
        }
      }
    };
    options.sortingRangeProperty.lazyLink( rangeListener );
    this.disposeEmitter.addListener( () => {
      isGroupItemKeyboardGrabbedProperty.unlink( grabbedPropertyListener );
      options.sortingRangeProperty.unlink( rangeListener );
    } );

    const focusListener = {
      focus: () => {

        // It's possible that getGroupItemToSelect's heuristic said that there is nothing to focus here
        if ( selectedGroupItemProperty.value === null ) {
          selectedGroupItemProperty.value = options.getGroupItemToSelect();
        }

        isKeyboardFocusedProperty.value = true;

        // When the group receives keyboard focus, make sure that the selected group item is displayed
        if ( selectedGroupItemProperty.value !== null ) {
          const node = options.getNodeFromModelItem( selectedGroupItemProperty.value );
          node && animatedPanZoomSingleton.listener.panToNode( node, true );
        }
      },
      blur: () => {
        isGroupItemKeyboardGrabbedProperty.value = false;
        isKeyboardFocusedProperty.value = false;
      },
      over: () => {

        // When you mouse over while focused, the highlights are hidden, and so update the state (even though we are
        // still technically keyboard focused). This will assist in showing the mouse cue, https://github.com/phetsims/center-and-variability/issues/406
        isKeyboardFocusedProperty.value = false;
      }
    };

    // When interactive highlights become active on the group, interaction with a mouse has begun while using
    // Interactive Highlighting. When that happens, clear the selection to prevent focus highlight flickering/thrashing.
    // See https://github.com/phetsims/center-and-variability/issues/557 and https://github.com/phetsims/scenery-phet/issues/815
    if ( ( primaryFocusedNode as InteractiveHighlightingNode ).isInteractiveHighlighting ) {
      const asHighlightingNodeAlias = primaryFocusedNode as InteractiveHighlightingNode;
      const interactiveHighlightingActiveListener = ( active: boolean ) => {
        if ( active ) {
          if ( model.selectedGroupItemProperty.value !== null ) {

            // Release the selection if grabbed
            model.isGroupItemKeyboardGrabbedProperty.value = false;

            // Clear the selection so that there isn't potential for flickering in between input modalities
            model.selectedGroupItemProperty.value = null;
          }

          // This controls the visibility of interaction cues (keyboard vs mouse), so we need to clear it when
          // switching interaction modes.
          isKeyboardFocusedProperty.value = false;
        }
      };
      asHighlightingNodeAlias.isInteractiveHighlightActiveProperty.lazyLink( interactiveHighlightingActiveListener );

      this.disposeEmitter.addListener( () => {
        asHighlightingNodeAlias.isInteractiveHighlightActiveProperty.unlink( interactiveHighlightingActiveListener );
      } );
    }

    const updateFocusHighlight = new Multilink( [
        selectedGroupItemProperty,
        isGroupItemKeyboardGrabbedProperty
      ],
      ( selectedGroupItem, isGroupItemGrabbed ) => {
        let focusHighlightSet = false;
        if ( selectedGroupItem ) {
          const node = options.getHighlightNodeFromModelItem( selectedGroupItem );
          if ( node ) {
            const focusForSelectedGroupItem = new HighlightFromNode( node, { dashed: isGroupItemGrabbed } );

            // If available, set to the focused selection for this scene.
            primaryFocusedNode.setFocusHighlight( focusForSelectedGroupItem );
            focusHighlightSet = true;
          }
        }

        // If not set above, then actively hide it.
        !focusHighlightSet && primaryFocusedNode.setFocusHighlight( 'invisible' );

        if ( selectedGroupItem !== null ) {
          this.positionSortCueNodeEmitter.emit();
        }
      }
    );

    // "release" into selecting state when disabled
    const enabledListener = ( enabled: boolean ) => {
      if ( !enabled ) {
        hasKeyboardGrabbedGroupItemProperty.value = false;
      }
    };
    this.model.enabledProperty.link( enabledListener );
    this.disposeEmitter.addListener( () => {
      this.model.enabledProperty.unlink( enabledListener );
    } );

    // A KeyboardListener that changes the "sorting" vs "selecting" state of the interaction.
    const grabReleaseKeyboardListener = new KeyboardListener( {
      fireOnHold: true,
      keys: [ 'enter', 'space', 'escape' ],
      callback: ( event, keysPressed ) => {
        if ( this.model.enabled && selectedGroupItemProperty.value !== null ) {

          // Do the "Grab/release" action to switch to sorting or selecting
          if ( keysPressed === 'enter' || keysPressed === 'space' ) {
            isGroupItemKeyboardGrabbedProperty.toggle();
            hasKeyboardGrabbedGroupItemProperty.value = true;
          }
          else if ( isGroupItemKeyboardGrabbedProperty.value && keysPressed === 'escape' ) {
            isGroupItemKeyboardGrabbedProperty.value = false;
          }

          // Reset to true from keyboard input, in case mouse/touch input set to false during the keyboard interaction.
          isKeyboardFocusedProperty.value = true;
        }
      }
    } );

    const deltaKeyboardListener = new KeyboardListener( {
      fireOnHold: true,
      keys: sortingKeys,
      callback: ( event, keysPressed ) => {

        if ( selectedGroupItemProperty.value !== null ) {

          const groupItem = selectedGroupItemProperty.value;
          const oldValue = this.model.getGroupItemValue( groupItem )!;
          assert && assert( oldValue !== null, 'We should have a group item when responding to input?' );

          // Sorting an item
          if ( isGroupItemKeyboardGrabbedProperty.value ) {

            // Don't do any sorting when disabled
            // For these keys, the item will move by a particular delta
            if ( this.model.enabled && sortingKeys.includes( keysPressed ) ) {
              const delta = this.getDeltaForKey( keysPressed )!;
              assert && assert( delta !== null, 'should be a supported key' );
              const newValue = oldValue + delta;
              this.onSortedValue( groupItem, newValue, oldValue );
            }
          }
          else {
            // Selecting an item
            const unclampedDelta = this.getDeltaForKey( keysPressed );
            if ( unclampedDelta !== null ) {
              this.model.hasKeyboardSelectedGroupItemProperty.value = true;

              const clampedDelta = this.sortingRangeProperty.value.clampDelta( oldValue, unclampedDelta );
              selectedGroupItemProperty.value = options.getNextSelectedGroupItem( clampedDelta, groupItem );
            }
          }
          this.onGroupItemChange( groupItem );
        }
      }
    } );

    if ( options.numberKeyMapper ) {
      const numbersKeyboardListener = new KeyboardListener( {
        fireOnHold: true,
        keys: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' ],
        callback: ( event, keysPressed ) => {
          if ( selectedGroupItemProperty.value !== null && isGroupItemKeyboardGrabbedProperty.value &&
               isSingleDigit( keysPressed ) ) {

            const groupItem = selectedGroupItemProperty.value;
            const oldValue = this.model.getGroupItemValue( groupItem )!;
            assert && assert( oldValue !== null, 'We should have a group item when responding to input?' );
            assert && assert( isSingleDigit( keysPressed ), 'sanity check on numbers for keyboard listener' );

            const mappedValue = options.numberKeyMapper!( keysPressed );
            if ( mappedValue ) {
              this.onSortedValue( groupItem, mappedValue, oldValue );
              this.onGroupItemChange( groupItem );
            }
          }
        }
      } );
      primaryFocusedNode.addInputListener( numbersKeyboardListener );
      this.disposeEmitter.addListener( () => {
        primaryFocusedNode.removeInputListener( numbersKeyboardListener );
        numbersKeyboardListener.dispose();
      } );
    }

    const defaultGroupShape = primaryFocusedNode.visibleBounds.isFinite() ? Shape.bounds( primaryFocusedNode.visibleBounds ) : null;

    // Set the outer group focus highlight to surround the entire area where group items are located.
    this.groupSortGroupFocusHighlightPath = new HighlightPath( defaultGroupShape, {
      outerStroke: HighlightPath.OUTER_LIGHT_GROUP_FOCUS_COLOR,
      innerStroke: HighlightPath.INNER_LIGHT_GROUP_FOCUS_COLOR,
      outerLineWidth: HighlightPath.GROUP_OUTER_LINE_WIDTH,
      innerLineWidth: HighlightPath.GROUP_INNER_LINE_WIDTH
    } );

    this.grabReleaseCueNode = new GrabReleaseCueNode( combineOptions<GrabReleaseCueNodeOptions>( {
      visibleProperty: this.model.grabReleaseCueVisibleProperty
    }, options.grabReleaseCueOptions ) );
    this.groupSortGroupFocusHighlightPath.addChild( this.grabReleaseCueNode );

    primaryFocusedNode.setGroupFocusHighlight( this.groupSortGroupFocusHighlightPath );
    primaryFocusedNode.addInputListener( focusListener );
    primaryFocusedNode.addInputListener( grabReleaseKeyboardListener );
    primaryFocusedNode.addInputListener( deltaKeyboardListener );

    this.disposeEmitter.addListener( () => {
      primaryFocusedNode.setGroupFocusHighlight( false );
      primaryFocusedNode.setFocusHighlight( null );
      primaryFocusedNode.removeInputListener( deltaKeyboardListener );
      primaryFocusedNode.removeInputListener( grabReleaseKeyboardListener );
      primaryFocusedNode.removeInputListener( focusListener );
      updateFocusHighlight.dispose();
      deltaKeyboardListener.dispose();
      grabReleaseKeyboardListener.dispose;
    } );
  }

  // By "change" we mean sort or selection.
  private onGroupItemChange( newGroupItem: ItemModel ): void {
    // When using keyboard input, make sure that the selected group item is still displayed by panning to keep it
    // in view. `panToCenter` is false because centering the group item in the screen is too much movement.
    const node = this.getNodeFromModelItem( newGroupItem );
    node && animatedPanZoomSingleton.listener.panToNode( node, false );

    // Reset to true from keyboard input, in case mouse/touch input set to false during the keyboard interaction.
    this.model.isKeyboardFocusedProperty.value = true;
  }

  // Conduct the sorting of a value
  private onSortedValue( groupItem: ItemModel, value: number, oldValue: number ): void {
    assert && assert( value !== null, 'We should have a value for the group item by the end of the listener.' );

    this.sortGroupItem( groupItem, this.sortingRangeProperty.value.constrainValue( value ) );
    this.onSort( groupItem, oldValue );
    this.model.hasKeyboardSortedGroupItemProperty.value = true;
  }

  /**
   * Get the delta to change the value given what key was pressed. The returned delta may not result in a value in range,
   * please constrain value from range or provide your own defensive measures to this delta.
   */
  private getDeltaForKey( key: string ): number | null {
    const fullRange = this.sortingRangeProperty.value.getLength();
    return key === 'home' ? -fullRange :
           key === 'end' ? fullRange :
           key === 'pageDown' ? -this.pageSortStep :
           key === 'pageUp' ? this.pageSortStep :
           [ 'arrowLeft', 'a', 'arrowDown', 's' ].includes( key ) ? -this.sortStep :
           [ 'arrowRight', 'd', 'arrowUp', 'w' ].includes( key ) ? this.sortStep :
           [ 'shift+arrowLeft', 'shift+a', 'shift+arrowDown', 'shift+s' ].includes( key ) ? -this.shiftSortStep :
           [ 'shift+arrowRight', 'shift+d', 'shift+arrowUp', 'shift+w' ].includes( key ) ? this.shiftSortStep :
           null;
  }

  public override dispose(): void {
    this.groupSortGroupFocusHighlightPath.dispose();
    this.grabReleaseCueNode.dispose();
    this.positionSortCueNodeEmitter.dispose();
    super.dispose();
  }

  /**
   * Use SortCueArrowNode to create a Node for the keyboard sorting cue. Can also be used as the mouse/touch cue
   * Node if desired.
   */
  public static createSortCueNode( visibleProperty: TReadOnlyProperty<boolean>, scale = 1 ): SortCueArrowNode {
    return new SortCueArrowNode( {
      doubleHead: true,
      dashWidth: 3.5 * scale,
      dashHeight: 2.8 * scale,
      numberOfDashes: 3,
      spacing: 2 * scale,
      triangleNodeOptions: {
        triangleWidth: 12 * scale,
        triangleHeight: 11 * scale
      },
      visibleProperty: visibleProperty
    } );
  }

  /**
   * Creator factory, similar to PhetioObject.create(). This is most useful if you don't need to keep the instance of
   * your GroupSortInteractionView.
   */
  public static create<ItemModel, ItemNode extends Node>(
    model: GroupSortInteractionModel<ItemModel>,
    primaryFocusedNode: Node,
    providedOptions: GroupSortInteractionViewOptions<ItemModel, ItemNode> ): GroupSortInteractionView<ItemModel, ItemNode> {

    return new GroupSortInteractionView<ItemModel, ItemNode>( model, primaryFocusedNode, providedOptions );
  }
}

function isSingleDigit( key: string ): boolean { return /^\d$/.test( key );}

sceneryPhet.register( 'GroupSortInteractionView', GroupSortInteractionView );