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
import Utils from '../../../dot/js/Utils.js';
import Multilink from '../../../axon/js/Multilink.js';
import GroupSortInteractionModel, { ItemModelType } from '../model/GroupSortInteractionModel.js';
import TEmitter from '../../../axon/js/TEmitter.js';
import Emitter from '../../../axon/js/Emitter.js';
import { Shape } from '../../../kite/js/imports.js';
import optionize from '../../../phet-core/js/optionize.js';

type ItemViewType<ItemModel> = {
  soccerBall: ItemModel;
} & Node;

// TODO: Remove this? https://github.com/phetsims/scenery-phet/issues/815
type SceneModel<ItemModel> = {
  getTopSoccerBalls(): ItemModel[];
  stackChangedEmitter: TEmitter<[ ItemModel[] ]>;
  getStackAtValue( value: number, filter?: ( item: ItemModel ) => boolean ): ItemModel[];
  preClearDataEmitter: TEmitter;
};
type SelfOptions<ItemModel extends ItemModelType, ItemView extends ItemViewType<ItemModel>> = {

  // Get a list of the available item nodes that can be selected, grabbed, and sorted at this time.
  getSortableItemNodes: () => ItemView[];
};

export type GroupSortInteractionViewOptions<ItemModel extends ItemModelType, ItemView extends ItemViewType<ItemModel>> = SelfOptions<ItemModel, ItemView>;

export default class GroupSortInteractionView<ItemModel extends ItemModelType, ItemView extends ItemViewType<ItemModel>> {

  // Update group highlight dynamically by setting the `shape` of this path.
  protected readonly groupFocusHighlightPath: HighlightPath;

  // TODO: use of "keyboard" maybe isn't needed. It is the cue node for this interaction (which is based on keyboard). https://github.com/phetsims/scenery-phet/issues/815
  public readonly positionKeyboardSortArrowCueNodeEmitter = new Emitter();

  public constructor(
    protected readonly groupSortInteractionModel: GroupSortInteractionModel<ItemModel>,
    primaryFocusedNode: Node,
    public readonly sceneModel: SceneModel<ItemModel>, // TODO: Think hard about the best interface for this, https://github.com/phetsims/scenery-phet/issues/815
    soccerBallMap: Map<ItemModel, ItemView>,
    keyboardSortArrowCueNode: Node, // TODO: remove me https://github.com/phetsims/scenery-phet/issues/815
    physicalRange: Range, providedOptions: GroupSortInteractionViewOptions<ItemModel, ItemView> ) {

    const options = optionize<GroupSortInteractionViewOptions<ItemModel, ItemView>>()( {}, providedOptions );

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
          // TODO: awkward, https://github.com/phetsims/scenery-phet/issues/815
          animatedPanZoomSingleton.listener.panToNode( soccerBallMap.get( focusedGroupItemProperty.value )!, true );
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

          const focusForSelectedBall = new HighlightFromNode( soccerBallMap.get( focusedSoccerBall )!, { dashed: isSoccerBallGrabbed } );
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

    // Move the focus highlight to a different soccer ball based on the provided delta.
    // TODO: Probably a hook, https://github.com/phetsims/scenery-phet/issues/815
    const moveFocusByDelta = ( delta: number ) => {

      if ( focusedGroupItemProperty.value === null ) {

        // No-op if we do not have a focusedGroupItem.
        return;
      }

      const topBallNodes = options.getSortableItemNodes();
      const numberOfTopSoccerBalls = topBallNodes.length;

      // We are deciding not to wrap the value around the ends of the range because the grabbed soccer ball
      // also does not wrap.
      const currentIndex = topBallNodes.indexOf( soccerBallMap.get( focusedGroupItemProperty.value )! );
      const nextIndex = Utils.clamp( currentIndex + delta, 0, numberOfTopSoccerBalls - 1 );
      focusedGroupItemProperty.value = topBallNodes[ nextIndex ].soccerBall;
    };

    const keyboardListener = new KeyboardListener( {
      fireOnHold: true,
      keys: [ 'd', 'arrowRight', 'a', 'arrowLeft', 'arrowUp', 'arrowDown', 'w', 's', 'enter', 'space', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'home', 'end', 'escape', 'pageUp', 'pageDown' ],
      callback: ( event, keysPressed ) => {

        // Select a soccer ball
        if ( focusedGroupItemProperty.value !== null ) {
          if ( ( [ 'arrowRight', 'arrowLeft', 'a', 'd', 'arrowUp', 'arrowDown', 'w', 's' ].includes( keysPressed ) ) ) {
            if ( [ 'arrowRight', 'arrowLeft', 'arrowUp', 'arrowDown' ].includes( keysPressed ) && !isGroupItemKeyboardGrabbedProperty.value ) {
              this.groupSortInteractionModel.hasKeyboardSelectedDifferentGroupItemProperty.value = true;

              const delta = [ 'arrowRight', 'arrowUp' ].includes( keysPressed ) ? 1 : -1;
              moveFocusByDelta( delta );
            }
            else if ( isGroupItemKeyboardGrabbedProperty.value ) {
              this.groupSortInteractionModel.hasKeyboardSortedGroupItemProperty.value = true;
              this.groupSortInteractionModel.hasGroupItemBeenSortedProperty.value = true;

              const delta = [ 'arrowLeft', 'a', 'arrowDown', 's' ].includes( keysPressed ) ? -1 : 1;
              const soccerBall = focusedGroupItemProperty.value;
              soccerBall.valueProperty.value = physicalRange.constrainValue( soccerBall.valueProperty.value! + delta );
              soccerBall.toneEmitter.emit( soccerBall.valueProperty.value );
            }
          }
          else if ( [ 'home', 'end' ].includes( keysPressed ) && !isGroupItemKeyboardGrabbedProperty.value ) {
            const delta = keysPressed === 'home' ? -physicalRange.max : physicalRange.max;
            moveFocusByDelta( delta );
          }
          else if ( keysPressed === 'enter' || keysPressed === 'space' ) {
            isGroupItemKeyboardGrabbedProperty.value = !isGroupItemKeyboardGrabbedProperty.value;
            hasKeyboardGrabbedGroupItemProperty.value = true;
          }
          else if ( isGroupItemKeyboardGrabbedProperty.value ) {

            if ( keysPressed === 'escape' ) {
              isGroupItemKeyboardGrabbedProperty.value = false;
            }
            else {
              const soccerBall = focusedGroupItemProperty.value;
              soccerBall.valueProperty.value = keysPressed === 'home' ? physicalRange.min :
                                               keysPressed === 'end' ? physicalRange.max :
                                               keysPressed === '1' ? 1 :
                                               keysPressed === '2' ? 2 :
                                               keysPressed === '3' ? 3 :
                                               keysPressed === '4' ? 4 :
                                               keysPressed === '5' ? 5 :
                                               keysPressed === '6' ? 6 :
                                               keysPressed === '7' ? 7 :
                                               keysPressed === '8' ? 8 :
                                               keysPressed === '9' ? 9 :
                                               keysPressed === '0' ? 10 :
                                                 // TODO: Generalize to the range https://github.com/phetsims/scenery-phet/issues/815
                                               keysPressed === 'pageDown' ? Math.max( soccerBall.valueProperty.value! - 3, physicalRange.min ) :
                                               keysPressed === 'pageUp' ? Math.min( soccerBall.valueProperty.value! + 3, physicalRange.max ) :
                                               soccerBall.valueProperty.value;
              if ( typeof soccerBall.valueProperty.value === 'number' ) {
                soccerBall.toneEmitter.emit( soccerBall.valueProperty.value );
                this.groupSortInteractionModel.hasKeyboardSortedGroupItemProperty.value = true;
                this.groupSortInteractionModel.hasGroupItemBeenSortedProperty.value = true;
              }
            }
          }

          // When using keyboard input, make sure that the "focused" ball is still displayed by panning to keep it
          // in view. `panToCenter` is false because centering the ball in the screen is too much movement.
          // TODO: Oh boy, https://github.com/phetsims/scenery-phet/issues/815
          animatedPanZoomSingleton.listener.panToNode( soccerBallMap.get( focusedGroupItemProperty.value )!, false );
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
  public create<ItemModel extends ItemModelType, ItemView extends ItemViewType<ItemModel>>(
    groupSortInteractionModel: GroupSortInteractionModel<ItemModel>,
    primaryFocusedNode: Node,
    sceneModel: SceneModel<ItemModel>,
    soccerBallMap: Map<ItemModel, ItemView>,
    keyboardSortArrowCueNode: Node,
    physicalRange: Range, providedOptions: GroupSortInteractionViewOptions<ItemModel, ItemView> ): GroupSortInteractionView<ItemModel, ItemView> {

    return new GroupSortInteractionView<ItemModel, ItemView>( groupSortInteractionModel, primaryFocusedNode,
      sceneModel, soccerBallMap, keyboardSortArrowCueNode, physicalRange, providedOptions );
  }
}

soccerCommon.register( 'GroupSortInteractionView', GroupSortInteractionView );