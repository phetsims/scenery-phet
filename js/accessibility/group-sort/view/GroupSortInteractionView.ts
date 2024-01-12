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
import optionize from '../../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import SortCueArrowNode from './SortCueArrowNode.js';
import Disposable, { DisposableOptions } from '../../../../../axon/js/Disposable.js';

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

type ParentOptions = DisposableOptions;
export type GroupSortInteractionViewOptions<ItemModel extends ItemModelType, ItemNode extends Node> = SelfOptions<ItemModel, ItemNode> & ParentOptions;

export default class GroupSortInteractionView<ItemModel extends ItemModelType, ItemNode extends Node> extends Disposable {

  // Update group highlight dynamically by setting the `shape` of this path.
  protected readonly groupFocusHighlightPath: HighlightPath;

  // Emitted when the sorting cue should be repositioned. Most likely because the selection has changed.
  public readonly positionSortCueNodeEmitter = new Emitter();

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

    this.sortingRange = options.sortingRange;
    this.sortStep = options.sortStep;
    this.pageSortStep = options.pageSortStep;

    const selectedGroupItemProperty = this.groupSortInteractionModel.selectedGroupItemProperty;
    const isKeyboardFocusedProperty = this.groupSortInteractionModel.isKeyboardFocusedProperty;
    const isGroupItemKeyboardGrabbedProperty = this.groupSortInteractionModel.isGroupItemKeyboardGrabbedProperty;
    const hasKeyboardGrabbedGroupItemProperty = this.groupSortInteractionModel.hasKeyboardGrabbedGroupItemProperty;
    const sortIndicatorValueProperty = this.groupSortInteractionModel.sortIndicatorValueProperty;

    const focusListener = {
      focus: () => {

        if ( selectedGroupItemProperty.value === null ) {
          selectedGroupItemProperty.value = options.getGroupItemToSelect();
        }

        // It's possible that getGroupItemToSelect's heuristic said that there is nothing to focus here
        isKeyboardFocusedProperty.value = selectedGroupItemProperty.value !== null;

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
        //     https://github.com/phetsims/scenery-phet/issues/815
        isKeyboardFocusedProperty.value = false;
      }
    };
    primaryFocusedNode.addInputListener( focusListener );

    const updateFocusHighlight = new Multilink( [
        selectedGroupItemProperty,
        isGroupItemKeyboardGrabbedProperty,
        sortIndicatorValueProperty
      ],
      ( selectedGroupItem, isGroupItemGrabbed, sortIndicatorValue ) => {
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

        if ( sortIndicatorValue !== null ) {
          this.positionSortCueNodeEmitter.emit();
        }
      }
    );

    // A KeyboardListener that changes the "sorting" vs "selecting" state of the interaction.
    const grabReleaseKeyboardListener = new KeyboardListener( {
      fireOnHold: true,
      keys: [ 'enter', 'space', 'escape' ],
      callback: ( event, keysPressed ) => {
        if ( selectedGroupItemProperty.value !== null ) {

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
    const keyboardListener = new KeyboardListener( {
      fireOnHold: true,

      // TODO: See https://github.com/phetsims/scenery-phet/issues/815 - Conditionally add teh number keys, based on
      //    option numberKeyMapper,
      keys: [ 'd', 'arrowRight', 'a', 'arrowLeft', 'arrowUp', 'arrowDown', 'w', 's', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'home', 'end', 'pageUp', 'pageDown' ],
      callback: ( event, keysPressed ) => {

        if ( selectedGroupItemProperty.value !== null ) {

          const groupItem = selectedGroupItemProperty.value;
          const oldValue = groupItem.valueProperty.value!;
          assert && assert( oldValue !== null, 'We should have a group item when responding to input?' );

          // Sorting an item
          if ( isGroupItemKeyboardGrabbedProperty.value ) {
            let newValue: number = oldValue;

            // For these keys, the item will move by a particular delta
            if ( [ 'arrowRight', 'arrowLeft', 'a', 'd', 'arrowUp', 'arrowDown', 'w', 's', 'pageDown', 'pageUp', 'home', 'end' ].includes( keysPressed ) ) {

              const delta = this.getDeltaForKey( keysPressed )!;
              assert && assert( delta !== null );
              newValue = oldValue + delta;
            }
            else if ( options.numberKeyMapper && isSingleDigit( keysPressed ) ) {
              const mappedValue = options.numberKeyMapper( keysPressed );
              if ( mappedValue ) {
                newValue = mappedValue;
              }
            }

            assert && assert( newValue !== null, 'We should have a value for the group item by the end of the listener.' );
            groupItem.valueProperty.value = options.sortingRange.constrainValue( newValue );

            // TODO: DESIGN!!! fire this even if the value didn't change? Yes likely, for the sound https://github.com/phetsims/scenery-phet/issues/815
            options.onSort( groupItem, oldValue );
            this.groupSortInteractionModel.hasKeyboardSortedGroupItemProperty.value = true;
            this.groupSortInteractionModel.hasGroupItemBeenSortedProperty.value = true;
          }
          else {

            // TODO: DESIGN!!! This changes the behavior because now the WASD, page up/page down keys work
            //   for the selection too - they don't on published version (Note that home and end DO work on published
            //   version for selection), https://github.com/phetsims/scenery-phet/issues/815
            const delta = this.getDeltaForKey( keysPressed );
            if ( delta !== null ) {
              this.groupSortInteractionModel.hasKeyboardSelectedDifferentGroupItemProperty.value = true;
              selectedGroupItemProperty.value = options.getNextSelectedGroupItem( delta );
            }
          }

          // When using keyboard input, make sure that the selected group item is still displayed by panning to keep it
          // in view. `panToCenter` is false because centering the group item in the screen is too much movement.
          const node = options.getNodeFromModelItem( groupItem );
          node && animatedPanZoomSingleton.listener.panToNode( node, false );
        }
      }
    } );

    const defaultGroupShape = primaryFocusedNode.bounds.isFinite() ? Shape.bounds( primaryFocusedNode.visibleBounds ) : null;

    // Set the outer group focus highlight to surround the entire area where group items are located.
    this.groupFocusHighlightPath = new HighlightPath( defaultGroupShape, {
      outerStroke: HighlightPath.OUTER_LIGHT_GROUP_FOCUS_COLOR,
      innerStroke: HighlightPath.INNER_LIGHT_GROUP_FOCUS_COLOR,
      outerLineWidth: HighlightPath.GROUP_OUTER_LINE_WIDTH,
      innerLineWidth: HighlightPath.GROUP_INNER_LINE_WIDTH
    } );
    primaryFocusedNode.setGroupFocusHighlight( this.groupFocusHighlightPath );
    primaryFocusedNode.addInputListener( keyboardListener );
    primaryFocusedNode.addInputListener( grabReleaseKeyboardListener );

    this.disposeEmitter.addListener( () => {
      primaryFocusedNode.setGroupFocusHighlight( false );
      primaryFocusedNode.setFocusHighlight( null );
      primaryFocusedNode.removeInputListener( grabReleaseKeyboardListener );
      primaryFocusedNode.removeInputListener( keyboardListener );
      primaryFocusedNode.removeInputListener( focusListener );
      updateFocusHighlight.dispose();
      keyboardListener.dispose();
      grabReleaseKeyboardListener.dispose;
    } );
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