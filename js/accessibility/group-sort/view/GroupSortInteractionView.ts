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

import { animatedPanZoomSingleton, HighlightFromNode, HighlightPath, KeyboardListener, Node } from '../../../../../scenery/js/imports.js';
import sceneryPhet from '../../../sceneryPhet.js';
import Range from '../../../../../dot/js/Range.js';
import Multilink from '../../../../../axon/js/Multilink.js';
import GroupSortInteractionModel, { ItemModelType } from '../model/GroupSortInteractionModel.js';
import Emitter from '../../../../../axon/js/Emitter.js';
import { Shape } from '../../../../../kite/js/imports.js';
import optionize, { combineOptions } from '../../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import SortCueArrowNode from './SortCueArrowNode.js';
import Disposable, { DisposableOptions } from '../../../../../axon/js/Disposable.js';
import GrabReleaseCueNode, { GrabReleaseCueNodeOptions } from '../../nodes/GrabReleaseCueNode.js';

type SelfOptions<ItemModel extends ItemModelType, ItemNode extends Node> = {

  // Given the delta (difference from currentValue to new value), return the corresponding group item model to be active.
  getNextSelectedGroupItem: ( delta: number ) => ItemModel;

  // Called on the focus() event (the start of the interaction), determine the best choice for the item to first select.
  // Only called if selectedGroupItemProperty is null (no selection already).
  getGroupItemToSelect: ( () => ItemModel | null );

  // Given a model item, return the corresponding node. Support 'null' as a way to support multiple scenes. If you
  // return null, it means that the provided itemModel is not associated with this view, and shouldn't be handled.
  getNodeFromModelItem: ( model: ItemModel ) => ItemNode | null;

  // The available range for storing. This is the acceptable range for the ItemModel.valueProperty.
  sortingRange: Range;

  // Called when a group item is sorted. Note that this may not have changed its value.
  onSort?: ( groupItem: ItemModel, oldValue: number ) => void;

  // If provided, listen to the number keys as well. Provide the value that the number key maps to. A direct value,
  // not a delta. If set to null, then number keys will not be listened to for this interaction
  numberKeyMapper?: ( ( pressedKeys: string ) => ( number | null ) ) | null;

  // The value-change delta step size when selecting/sorting the group items. This basic step is applied when using arrow keys or WASD
  sortStep?: number;
  pageSortStep?: number;

  // TODO: Design!! Add this? https://github.com/phetsims/scenery-phet/issues/815
  // shiftSortStep?: number;
};

const sortingKeys = [ 'arrowRight', 'arrowLeft', 'a', 'd', 'arrowUp', 'arrowDown', 'w', 's', 'pageDown', 'pageUp', 'home', 'end' ] as const;

type ParentOptions = DisposableOptions;
export type GroupSortInteractionViewOptions<ItemModel extends ItemModelType, ItemNode extends Node> = SelfOptions<ItemModel, ItemNode> & ParentOptions;

export default class GroupSortInteractionView<ItemModel extends ItemModelType, ItemNode extends Node> extends Disposable {

  // Update group highlight dynamically by setting the `shape` of this path.
  protected readonly groupFocusHighlightPath: HighlightPath;

  // Emitted when the sorting cue should be repositioned. Most likely because the selection has changed.
  public readonly positionSortCueNodeEmitter = new Emitter();

  private readonly getNodeFromModelItem: ( model: ItemModel ) => ItemNode | null;
  private readonly onSort: ( groupItem: ItemModel, oldValue: number ) => void;
  private readonly sortingRange: Range;
  private readonly sortStep: number;
  private readonly pageSortStep: number;

  public constructor(
    protected readonly groupSortInteractionModel: GroupSortInteractionModel<ItemModel>,
    primaryFocusedNode: Node,
    providedOptions: GroupSortInteractionViewOptions<ItemModel, ItemNode> ) {

    const options = optionize<
      GroupSortInteractionViewOptions<ItemModel, ItemNode>,
      SelfOptions<ItemModel, ItemNode>,
      ParentOptions>()( {
      numberKeyMapper: null,
      onSort: _.noop,
      sortStep: 1,
      pageSortStep: Math.ceil( providedOptions.sortingRange.getLength() / 5 )
    }, providedOptions );

    super( options );

    this.getNodeFromModelItem = options.getNodeFromModelItem;
    this.onSort = options.onSort;
    this.sortingRange = options.sortingRange;
    this.sortStep = options.sortStep;
    this.pageSortStep = options.pageSortStep;

    const selectedGroupItemProperty = this.groupSortInteractionModel.selectedGroupItemProperty;
    const isKeyboardFocusedProperty = this.groupSortInteractionModel.isKeyboardFocusedProperty;
    const isGroupItemKeyboardGrabbedProperty = this.groupSortInteractionModel.isGroupItemKeyboardGrabbedProperty;
    const hasKeyboardGrabbedGroupItemProperty = this.groupSortInteractionModel.hasKeyboardGrabbedGroupItemProperty;

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
        // TODO: MS!!!! this is awkward. In this situation:
        //     1. tab to populated node, the keyboard grab cue is shown.
        //     2. Move the mouse over a group item, the keyboard grab cue goes away.
        //     3. Press an arrow key to change focus to another in the group, the keyboard grab cue does not show up.
        //        I bet it still thinks that isKeyboardFocusedProperty is false (!!!!)
        //     4. It is even worse than the above now that we got rid of sortIndicatorValue, because this triggers a change in selection in CAVGroupSortInteractionModel
        //     https://github.com/phetsims/scenery-phet/issues/815
        isKeyboardFocusedProperty.value = false;
      }
    };

    const updateFocusHighlight = new Multilink( [
        selectedGroupItemProperty,
        isGroupItemKeyboardGrabbedProperty
      ],
      ( selectedGroupItem, isGroupItemGrabbed ) => {
        let focusHighlightSet = false;
        if ( selectedGroupItem ) {
          const node = options.getNodeFromModelItem( selectedGroupItem );
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

    // "release" into selection mode when disabled
    const enabledListener = ( enabled: boolean ) => {
      if ( !enabled ) {
        hasKeyboardGrabbedGroupItemProperty.value = false;
      }
    };
    this.groupSortInteractionModel.enabledProperty.link( enabledListener );
    this.disposeEmitter.addListener( () => {
      this.groupSortInteractionModel.enabledProperty.unlink( enabledListener );
    } );

    // A KeyboardListener that changes the "sorting" vs "selecting" state of the interaction.
    const grabReleaseKeyboardListener = new KeyboardListener( {
      fireOnHold: true,
      keys: [ 'enter', 'space', 'escape' ],
      callback: ( event, keysPressed ) => {
        if ( this.groupSortInteractionModel.enabled && selectedGroupItemProperty.value !== null ) {

          // Do the "Grab/release" action to switch to sorting or selecting
          if ( keysPressed === 'enter' || keysPressed === 'space' ) {
            isGroupItemKeyboardGrabbedProperty.toggle();
            hasKeyboardGrabbedGroupItemProperty.value = true;
          }
          else if ( isGroupItemKeyboardGrabbedProperty.value && keysPressed === 'escape' ) {
            isGroupItemKeyboardGrabbedProperty.value = false;
          }
        }
      }
    } );

    // TODO: DESIGN!!! adding a modifier key means the arrow keys don't work. https://github.com/phetsims/scenery-phet/issues/815
    // TODO: DESIGN!!! should we add a "shift+arrow keys" for a larger or smaller step size than the default? https://github.com/phetsims/scenery-phet/issues/815
    const deltaKeyboardListener = new KeyboardListener( {
      fireOnHold: true,
      keys: [ 'd', 'arrowRight', 'a', 'arrowLeft', 'arrowUp', 'arrowDown', 'w', 's', 'home', 'end', 'pageUp', 'pageDown' ],
      callback: ( event, keysPressed ) => {

        if ( selectedGroupItemProperty.value !== null ) {

          const groupItem = selectedGroupItemProperty.value;
          const oldValue = groupItem.valueProperty.value!;
          assert && assert( oldValue !== null, 'We should have a group item when responding to input?' );

          // Sorting an item
          if ( isGroupItemKeyboardGrabbedProperty.value ) {

            // Don't do any sorting when disabled
            // For these keys, the item will move by a particular delta
            if ( this.groupSortInteractionModel.enabled && sortingKeys.includes( keysPressed ) ) {
              const delta = this.getDeltaForKey( keysPressed )!;
              assert && assert( delta !== null, 'should be a supported key' );
              const newValue = oldValue + delta;
              this.onSortedValue( groupItem, newValue, oldValue );
            }
          }
          else {
            // Selecting an item

            // TODO: DESIGN!!! This changes the behavior because now the WASD, page up/page down keys work
            //   for the selection too - they don't on published version (Note that home and end DO work on published
            //   version for selection), https://github.com/phetsims/scenery-phet/issues/815
            const delta = this.getDeltaForKey( keysPressed );
            if ( delta !== null ) {
              this.groupSortInteractionModel.hasKeyboardSelectedDifferentGroupItemProperty.value = true;
              selectedGroupItemProperty.value = options.getNextSelectedGroupItem( delta );
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
            const oldValue = groupItem.valueProperty.value!;
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

    const defaultGroupShape = primaryFocusedNode.bounds.isFinite() ? Shape.bounds( primaryFocusedNode.visibleBounds ) : null;

    // Set the outer group focus highlight to surround the entire area where group items are located.
    this.groupFocusHighlightPath = new HighlightPath( defaultGroupShape, {
      outerStroke: HighlightPath.OUTER_LIGHT_GROUP_FOCUS_COLOR,
      innerStroke: HighlightPath.INNER_LIGHT_GROUP_FOCUS_COLOR,
      outerLineWidth: HighlightPath.GROUP_OUTER_LINE_WIDTH,
      innerLineWidth: HighlightPath.GROUP_INNER_LINE_WIDTH
    } );
    primaryFocusedNode.setGroupFocusHighlight( this.groupFocusHighlightPath );
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
  }

  private onSortedValue( groupItem: ItemModel, value: number, oldValue: number ): void {
    assert && assert( value !== null, 'We should have a value for the group item by the end of the listener.' );

    groupItem.valueProperty.value = this.sortingRange.constrainValue( value );

    // TODO: DESIGN!!! fire this even if the value didn't change? Yes likely, for the sound https://github.com/phetsims/scenery-phet/issues/815
    this.onSort( groupItem, oldValue );
    this.groupSortInteractionModel.hasKeyboardSortedGroupItemProperty.value = true;
    this.groupSortInteractionModel.hasGroupItemBeenSortedProperty.value = true;
  }

  private getDeltaForKey( key: string ): number | null {
    const fullRange = this.sortingRange.getLength();
    return key === 'home' ? -fullRange :
           key === 'end' ? fullRange :
           key === 'pageDown' ? -this.pageSortStep :
           key === 'pageUp' ? this.pageSortStep :
           [ 'arrowLeft', 'a', 'arrowDown', 's' ].includes( key ) ? -this.sortStep :
           [ 'arrowRight', 'd', 'arrowUp', 'w' ].includes( key ) ? this.sortStep :
           null;
  }

  public override dispose(): void {
    this.groupFocusHighlightPath.dispose();
    this.positionSortCueNodeEmitter.dispose();
    super.dispose();
  }

  // Required visibleProperty so you don't forget to wire it up with GroupSortInteractionModel
  public static createGrabReleaseCueNode( visibleProperty: TReadOnlyProperty<boolean>, providedOptions?: GrabReleaseCueNodeOptions ): Node {
    return new GrabReleaseCueNode( combineOptions<GrabReleaseCueNodeOptions>( {
      visibleProperty: visibleProperty
    }, providedOptions ) );
  }

  /**
   * Use SortCueArrowNode to create a Node for the sorting cue.
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
  public static create<ItemModel extends ItemModelType, ItemNode extends Node>(
    groupSortInteractionModel: GroupSortInteractionModel<ItemModel>,
    primaryFocusedNode: Node,
    providedOptions: GroupSortInteractionViewOptions<ItemModel, ItemNode> ): GroupSortInteractionView<ItemModel, ItemNode> {

    return new GroupSortInteractionView<ItemModel, ItemNode>( groupSortInteractionModel, primaryFocusedNode, providedOptions );
  }
}

function isSingleDigit( key: string ): boolean { return /^\d$/.test( key );}

sceneryPhet.register( 'GroupSortInteractionView', GroupSortInteractionView );