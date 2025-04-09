// Copyright 2024-2025, University of Colorado Boulder

/**
 * This doc assumes you have read the doc in GroupSelectModel. Read that first as it explains the "group select
 * interaction" more generally.
 *
 * This type adds sorting on top of the GroupSelectView
 * in the interaction for (keyboard).
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../../dot/js/Range.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import KeyboardListener from '../../../../../scenery/js/listeners/KeyboardListener.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import sceneryPhet from '../../../sceneryPhet.js';
import GroupSelectModel from '../model/GroupSelectModel.js';
import GroupSelectView, { GroupSelectViewOptions } from './GroupSelectView.js';
import SortCueArrowNode from './SortCueArrowNode.js';

type SelfOptions<ItemModel> = {

  // Given the delta (difference from current value to new value), return the corresponding next group item model to be selected.
  getNextSelectedGroupItem: ( delta: number, currentlySelectedGroupItem: ItemModel ) => ItemModel;

  // The available range for sorting. This is the acceptable range for the valueProperty of ItemModel (see model.getGroupItemValue()).
  sortingRangeProperty: TReadOnlyProperty<Range>;

  sortingRangeListener?: ( range: Range ) => void;

  // Do the sort operation, allowing for custom actions, must be implemented by all implementations, but likely just
  // should default to updating the "valueProperty" of the selected group item to the new value that is provided.
  sortGroupItem: ( groupItem: ItemModel, newValue: number ) => void;

  // Callback called after a group item is sorted. Note that sorting may not have changed its value (like if at the boundary
  // trying to move past the range).
  onSort?: ( groupItem: ItemModel, oldValue: number ) => void;

  // If provided, listen to the number keys as well to sort the selected group item. Provide the value that the
  // number key maps to. A direct value, not a delta. If the function returns null, then no action takes place for the
  // input. If the option is set to null, then number keys will not be listened to for this interaction.
  numberKeyMapper?: ( ( pressedKeys: string ) => ( number | null ) ) | null;

  // The value-change delta step size when selecting/sorting the group items.
  sortStep?: number;   // arrow keys or WASD
  pageSortStep?: number; // page-up/down keys
  shiftSortStep?: number; // shift+arrow keys or shift+WASD
};

// A list of all keys that are listened to, except those covered by the numberKeyMapper
const sortingKeys = [
  'd', 'arrowRight', 'a', 'arrowLeft', 'arrowUp', 'arrowDown', 'w', 's', // default-step sort
  'shift+d', 'shift+arrowRight', 'shift+a', 'shift+arrowLeft', 'shift+arrowUp', 'shift+arrowDown', 'shift+w', 'shift+s', // shift-step sort
  'pageUp', 'pageDown', // page-step sort
  'home', 'end' // min/max
] as const;

type ParentOptions<ItemModel, ItemNode extends Node> = GroupSelectViewOptions<ItemModel, ItemNode>;
export type GroupSortInteractionViewOptions<ItemModel, ItemNode extends Node> = SelfOptions<ItemModel> &
  ParentOptions<ItemModel, ItemNode>;

export default class GroupSortInteractionView<ItemModel, ItemNode extends Node> extends GroupSelectView<ItemModel, ItemNode> {
  private readonly sortGroupItem: ( groupItem: ItemModel, newValue: number ) => void;
  private readonly onSort: ( groupItem: ItemModel, oldValue: number ) => void;
  private readonly sortingRangeProperty: TReadOnlyProperty<Range>;
  private readonly sortStep: number;
  private readonly shiftSortStep: number;
  private readonly pageSortStep: number;

  public constructor(
    model: GroupSelectModel<ItemModel>,
    primaryFocusedNode: Node, // Client is responsible for setting accessibleName and nothing else!
    providedOptions: GroupSortInteractionViewOptions<ItemModel, ItemNode> ) {

    const options = optionize<
      GroupSortInteractionViewOptions<ItemModel, ItemNode>,
      SelfOptions<ItemModel>,
      ParentOptions<ItemModel, ItemNode>>()( {
      numberKeyMapper: null,
      onSort: _.noop,
      sortStep: 1,
      shiftSortStep: 2,
      pageSortStep: Math.ceil( providedOptions.sortingRangeProperty.value.getLength() / 5 ),
      sortingRangeListener: ( newRange: Range ) => {
        const selectedGroupItem = model.selectedGroupItemProperty.value;
        if ( selectedGroupItem ) {
          const currentValue = model.getGroupItemValue( selectedGroupItem );
          if ( currentValue && !newRange.contains( currentValue ) ) {
            model.selectedGroupItemProperty.value = providedOptions.getGroupItemToSelect();
          }
        }
      }
    }, providedOptions );

    super( model, primaryFocusedNode, options );

    this.sortGroupItem = options.sortGroupItem;
    this.onSort = options.onSort;
    this.sortingRangeProperty = options.sortingRangeProperty;
    this.sortStep = options.sortStep;
    this.shiftSortStep = options.shiftSortStep;
    this.pageSortStep = options.pageSortStep;

    const selectedGroupItemProperty = this.model.selectedGroupItemProperty;
    const isGroupItemKeyboardGrabbedProperty = this.model.isGroupItemKeyboardGrabbedProperty;

    // If the new range doesn't include the current selection, reset back to the default heuristic.
    options.sortingRangeProperty.lazyLink( options.sortingRangeListener );
    this.disposeEmitter.addListener( () => {
      options.sortingRangeProperty.unlink( options.sortingRangeListener );
    } );

    const deltaKeyboardListener = new KeyboardListener( {
      fireOnHold: true,
      keys: sortingKeys,
      fire: ( event, keysPressed ) => {

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
          selectedGroupItemProperty.value && this.onGroupItemChange( selectedGroupItemProperty.value );
        }
      }
    } );

    if ( options.numberKeyMapper ) {
      const numbersKeyboardListener = new KeyboardListener( {
        fireOnHold: true,
        keys: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' ],
        fire: ( event, keysPressed ) => {
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
    primaryFocusedNode.addInputListener( deltaKeyboardListener );

    this.disposeEmitter.addListener( () => {
      primaryFocusedNode.removeInputListener( deltaKeyboardListener );
      deltaKeyboardListener.dispose();
    } );
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
}

function isSingleDigit( key: string ): boolean { return /^\d$/.test( key );}

sceneryPhet.register( 'GroupSortInteractionView', GroupSortInteractionView );