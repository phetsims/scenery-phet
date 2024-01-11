// Copyright 2023, University of Colorado Boulder

/**
 * The view of the Group Sort Interaction. This type handles adding the controller for the selection, grab, and sort
 * interaction for keyboard. It also handles the group and individual focus highlights.
 *
 * Recipe book:
 * - use groupFocusHighlightPath.shape to set the group highlight dynamically
 * - use positionKeyboardSortArrowCueNodeEmitter to update the position of the sort cue.
 *
 * TODO: Dispose? https://github.com/phetsims/scenery-phet/issues/815
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import { animatedPanZoomSingleton, HighlightFromNode, HighlightPath, KeyboardListener, Node } from '../../../scenery/js/imports.js';
import { SoccerBallPhase } from '../model/SoccerBallPhase.js';
import soccerCommon from '../soccerCommon.js';
import Range from '../../../dot/js/Range.js';
import Multilink from '../../../axon/js/Multilink.js';
import GroupSortInteractionModel, { ItemModelType } from '../model/GroupSortInteractionModel.js';
import TEmitter from '../../../axon/js/TEmitter.js';
import Emitter from '../../../axon/js/Emitter.js';
import { Shape } from '../../../kite/js/imports.js';
import optionize from '../../../phet-core/js/optionize.js';

type GetItemNodeFromModel<ItemModel extends ItemModelType, ItemNode extends Node> = ( model: ItemModel ) => ItemNode;

// TODO: Remove this? https://github.com/phetsims/scenery-phet/issues/815
type SceneModel<ItemModel> = {
  getTopSoccerBalls(): ItemModel[];
  stackChangedEmitter: TEmitter<[ ItemModel[] ]>;
  getStackAtValue( value: number, filter?: ( item: ItemModel ) => boolean ): ItemModel[];
  preClearDataEmitter: TEmitter;
};
type SelfOptions<ItemModel extends ItemModelType, ItemNode extends Node> = {

  // Given the delta (difference from currentValue to new value), return the corresponding group item model.
  getNextFocusedGroupItem: ( delta: number ) => ItemModel;

  // Given a model item, return the corresponding node.
  getNodeFromModelItem: GetItemNodeFromModel<ItemModel, ItemNode>;

  // The available range for storing. This is the acceptable range for the ItemModel.valueProperty.
  sortingRange: Range;
};

export type GroupSortInteractionViewOptions<ItemModel extends ItemModelType, ItemNode extends Node> = SelfOptions<ItemModel, ItemNode>;

export default class GroupSortInteractionView<ItemModel extends ItemModelType, ItemNode extends Node> {

  // Update group highlight dynamically by setting the `shape` of this path.
  protected readonly groupFocusHighlightPath: HighlightPath;

  // TODO: use of "keyboard" maybe isn't needed. It is the cue node for this interaction (which is based on keyboard). https://github.com/phetsims/scenery-phet/issues/815
  public readonly positionKeyboardSortArrowCueNodeEmitter = new Emitter();

  public constructor(
    protected readonly groupSortInteractionModel: GroupSortInteractionModel<ItemModel>,
    primaryFocusedNode: Node,
    public readonly sceneModel: SceneModel<ItemModel>, // TODO: Think hard about the best interface for this, https://github.com/phetsims/scenery-phet/issues/815
    providedOptions: GroupSortInteractionViewOptions<ItemModel, ItemNode> ) {

    const options = optionize<GroupSortInteractionViewOptions<ItemModel, ItemNode>>()( {}, providedOptions );

    const focusedGroupItemProperty = this.groupSortInteractionModel.focusedGroupItemProperty;
    const isKeyboardFocusedProperty = this.groupSortInteractionModel.isKeyboardFocusedProperty;
    const isGroupItemKeyboardGrabbedProperty = this.groupSortInteractionModel.isGroupItemKeyboardGrabbedProperty;
    const hasKeyboardGrabbedGroupItemProperty = this.groupSortInteractionModel.hasKeyboardGrabbedGroupItemProperty;
    const sortIndicatorValueProperty = this.groupSortInteractionModel.sortIndicatorValueProperty;

    // Update pointer areas and soccer ball focus (for keyboard and interactive highlight) when topmost ball changes
    sceneModel.stackChangedEmitter.addListener( () => {
      const focusedGroupItem = focusedGroupItemProperty.value;

      // When a user is focused on the backLayerSoccerBallLayer, but no balls have landed yet, we want to ensure that
      // a focusedSoccerBall gets assigned once the ball lands.
      // TODO: Hard to generalize, perhaps with a hook like "update focus please" https://github.com/phetsims/scenery-phet/issues/815
      const topSoccerBalls = sceneModel.getTopSoccerBalls();
      if ( focusedGroupItem === null && topSoccerBalls.length > 0 && primaryFocusedNode.focused ) {
        focusedGroupItemProperty.value = topSoccerBalls[ 0 ];
      }

      // Anytime a stack changes and the focusedSoccerBall is assigned, we want to make sure the focusedSoccerBall
      // stays on top.
      if ( focusedGroupItem !== null ) {
        assert && assert( focusedGroupItem.valueProperty.value !== null, 'The valueProperty of the focusedSoccerBall should not be null.' );
        const focusedStack = sceneModel.getStackAtValue( focusedGroupItem.valueProperty.value! );
        focusedGroupItemProperty.value = focusedStack[ focusedStack.length - 1 ];
      }
    } );

    primaryFocusedNode.addInputListener( {
      focus: () => {
        const topSoccerBalls = sceneModel.getTopSoccerBalls();
        if ( focusedGroupItemProperty.value === null && topSoccerBalls.length > 0 ) {
          const sortIndicatorValue = sortIndicatorValueProperty.value;
          if ( sortIndicatorValue !== null ) {
            const sortIndicatorStack = sceneModel.getStackAtValue( sortIndicatorValue,
              soccerBall => soccerBall.soccerBallPhaseProperty.value === SoccerBallPhase.STACKED );
            assert && assert( sortIndicatorStack.length > 0, `must have a stack length at the sortIndicator value: ${sortIndicatorValue}` );
            focusedGroupItemProperty.value = sortIndicatorStack[ sortIndicatorStack.length - 1 ];
          }
          else {
            focusedGroupItemProperty.value = topSoccerBalls[ 0 ];
          }

        }
        // TODO: should this be true even if focusedGroupItemProperty.value is null? https://github.com/phetsims/scenery-phet/issues/815
        isKeyboardFocusedProperty.value = true;

        // When the group receives keyboard focus, make sure that the focused ball is displayed
        if ( focusedGroupItemProperty.value !== null ) {
          animatedPanZoomSingleton.listener.panToNode( options.getNodeFromModelItem( focusedGroupItemProperty.value ), true );
        }
      },
      blur: () => {
        isGroupItemKeyboardGrabbedProperty.value = false;
        isKeyboardFocusedProperty.value = false;
      },
      over: () => {
        // TODO: this is awkward. In this situation:
        //     1. tab to populated node, the keyboard grab cue is shown.
        //     2. Move the mouse over a soccer ball, the keyboard grab cue goes away.
        //     3. Press an arrow key to change focus to another in the group, the keyboard grab cue does not show up.
        //        I bet it still thinks that isKeyboardFocusedProperty is false (!!!!)
        //     https://github.com/phetsims/scenery-phet/issues/815
        isKeyboardFocusedProperty.value = false;
      }
    } );

    Multilink.multilink( [
        focusedGroupItemProperty,
        isGroupItemKeyboardGrabbedProperty,
        sortIndicatorValueProperty
      ],
      ( focusedSoccerBall, isSoccerBallGrabbed, sortIndicatorValue ) => {
        if ( focusedSoccerBall ) {

          const focusForSelectedBall = new HighlightFromNode( options.getNodeFromModelItem( focusedSoccerBall ), { dashed: isSoccerBallGrabbed } );
          primaryFocusedNode.setFocusHighlight( focusForSelectedBall );
        }
        else {
          primaryFocusedNode.setFocusHighlight( 'invisible' );
        }

        if ( sortIndicatorValue !== null ) {
          this.positionKeyboardSortArrowCueNodeEmitter.emit();
        }
      }
    );

    // A KeyboardListener that changes the "sorting" vs "selecting" state of the interaction.
    const grabReleaseKeyboardListener = new KeyboardListener( {
      fireOnHold: true,
      keys: [ 'enter', 'space', 'escape' ],
      callback: ( event, keysPressed ) => {
        if ( focusedGroupItemProperty.value !== null ) {

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

    // TODO: Should this function live somewhere else? If on the prototype it could be overridden - No, simpler is better.
    //  Consider adding as a static function. See https://github.com/phetsims/scenery-phet/issues/815
    const getDeltaForKey = ( key: string ): number | null => {

      const fullRange = options.sortingRange.getLength();
      return key === 'home' ? -fullRange :
             key === 'end' ? fullRange :

               // TODO: Generalize to the range https://github.com/phetsims/scenery-phet/issues/815
             key === 'pageDown' ? -3 :
             key === 'pageUp' ? 3 :

               // TODO: https://github.com/phetsims/scenery-phet/issues/815 - Instead of hard coding to 1, these
               //    should use keyboardStep options (copy the API from AccessibleValueHandler)
             [ 'arrowLeft', 'a', 'arrowDown', 's' ].includes( key ) ? -1 :
             [ 'arrowRight', 'd', 'arrowUp', 'w' ].includes( key ) ? 1 :
             null;
    };

    const keyboardListener = new KeyboardListener( {
      fireOnHold: true,

      // TODO: See https://github.com/phetsims/scenery-phet/issues/815 - Conditionally add teh number keys, based on
      //    option numberKeyMapper,
      keys: [ 'd', 'arrowRight', 'a', 'arrowLeft', 'arrowUp', 'arrowDown', 'w', 's', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'home', 'end', 'pageUp', 'pageDown' ],
      callback: ( event, keysPressed ) => {

        if ( focusedGroupItemProperty.value !== null ) {

          const groupItem = focusedGroupItemProperty.value;
          assert && assert( groupItem.valueProperty.value !== null, 'We should have a ball when responding to input?' );

          // Sorting an item
          if ( isGroupItemKeyboardGrabbedProperty.value ) {
            let newValue: number | null = null;

            // For these keys, the item will move by a particular delta
            if ( [ 'arrowRight', 'arrowLeft', 'a', 'd', 'arrowUp', 'arrowDown', 'w', 's', 'pageDown', 'pageUp', 'home', 'end' ].includes( keysPressed ) ) {

              const delta = getDeltaForKey( keysPressed )!;
              assert && assert( delta !== null );
              newValue = groupItem.valueProperty.value! + delta;
            }
            else {

              // An option like numberKeyMapper - when present, add number keys to the KeyboardListener and
              // call the callback here - it returns the value as a number from the number key pressed.
              // Usage could look like this:
              //               if ( options.numberKeyMapper && options.numberKeyMapper( keysPressed ) ) {
              //                 newValue = options.numberKeyMapper( keysPressed );
              //               }
              // TODO: Implement the above? - See https://github.com/phetsims/scenery-phet/issues/815

              // For the remaining keys in this listener, the value will be set to a specific value
              newValue = keysPressed === '1' ? 1 :
                         keysPressed === '2' ? 2 :
                         keysPressed === '3' ? 3 :
                         keysPressed === '4' ? 4 :
                         keysPressed === '5' ? 5 :
                         keysPressed === '6' ? 6 :
                         keysPressed === '7' ? 7 :
                         keysPressed === '8' ? 8 :
                         keysPressed === '9' ? 9 :
                         keysPressed === '0' ? 10 :
                         groupItem.valueProperty.value;
            }

            assert && assert( newValue !== null, 'We should have a value for the ball by the end of the listener.' );
            groupItem.valueProperty.value = options.sortingRange.constrainValue( newValue! );
            groupItem.toneEmitter.emit( groupItem.valueProperty.value );

            this.groupSortInteractionModel.hasKeyboardSortedGroupItemProperty.value = true;
            this.groupSortInteractionModel.hasGroupItemBeenSortedProperty.value = true;
          }
          else {

            // selecting an item
            // TODO: This changes the behavior because now the WASD, page up/page down keys work
            //   for the selection too - they don't on published version (Note that home and end DO work on published
            //   version for selection), https://github.com/phetsims/scenery-phet/issues/815
            const delta = getDeltaForKey( keysPressed );
            if ( delta !== null ) {
              this.groupSortInteractionModel.hasKeyboardSelectedDifferentGroupItemProperty.value = true;

              focusedGroupItemProperty.value = options.getNextFocusedGroupItem( delta );
            }
          }

          // When using keyboard input, make sure that the "focused" ball is still displayed by panning to keep it
          // in view. `panToCenter` is false because centering the ball in the screen is too much movement.
          animatedPanZoomSingleton.listener.panToNode( options.getNodeFromModelItem( groupItem ), false );
        }
      }
    } );

    // Set the outer group focus region to surround the entire area where group items are located.
    const defaultGroupShape = primaryFocusedNode.bounds.isFinite() ? Shape.bounds( primaryFocusedNode.visibleBounds ) : null;

    this.groupFocusHighlightPath = new HighlightPath( defaultGroupShape, {
      outerStroke: HighlightPath.OUTER_LIGHT_GROUP_FOCUS_COLOR,
      innerStroke: HighlightPath.INNER_LIGHT_GROUP_FOCUS_COLOR,
      outerLineWidth: HighlightPath.GROUP_OUTER_LINE_WIDTH,
      innerLineWidth: HighlightPath.GROUP_INNER_LINE_WIDTH
    } );
    primaryFocusedNode.setGroupFocusHighlight( this.groupFocusHighlightPath );
    primaryFocusedNode.addInputListener( keyboardListener );
    primaryFocusedNode.addInputListener( grabReleaseKeyboardListener );

    // TODO: move to the model and use use resetInteractionState(), see about https://github.com/phetsims/scenery-phet/issues/815
    sceneModel.preClearDataEmitter.addListener( () => {
        focusedGroupItemProperty.reset();
        isGroupItemKeyboardGrabbedProperty.reset();
        isKeyboardFocusedProperty.reset();
      }
    );
  }

  /**
   * Creator factory, similar to PhetioObject.create(). This is most useful if you don't need to keep the instance of
   * your GroupSortInteractionView.
   */
  public create<ItemModel extends ItemModelType, ItemNode extends Node>(
    groupSortInteractionModel: GroupSortInteractionModel<ItemModel>,
    primaryFocusedNode: Node,
    sceneModel: SceneModel<ItemModel>,
    providedOptions: GroupSortInteractionViewOptions<ItemModel, ItemNode> ): GroupSortInteractionView<ItemModel, ItemNode> {

    return new GroupSortInteractionView<ItemModel, ItemNode>( groupSortInteractionModel, primaryFocusedNode,
      sceneModel, providedOptions );
  }
}

soccerCommon.register( 'GroupSortInteractionView', GroupSortInteractionView );