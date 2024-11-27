// Copyright 2024, University of Colorado Boulder

/**
 * This doc assumes you have read the doc in GroupSelectModel. Read that first as it explains the "group select
 * interaction" more generally.
 *
 * The view of the "Group Sort Interaction." This type handles adding the controller for selecting and grabbing
 * in the interaction for (keyboard). It also handles the individual and group focus highlights.
 *
 * This class can be used per scene, but the model is best used per screen.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Disposable, { DisposableOptions } from '../../../../../axon/js/Disposable.js';
import Emitter from '../../../../../axon/js/Emitter.js';
import Multilink from '../../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import { Shape } from '../../../../../kite/js/imports.js';
import optionize, { combineOptions } from '../../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import { animatedPanZoomSingleton, HighlightFromNode, HighlightPath, isInteractiveHighlighting, KeyboardListener, Node, NodeOptions, ParallelDOMOptions, Path, PDOMValueType } from '../../../../../scenery/js/imports.js';
import sceneryPhet from '../../../sceneryPhet.js';
import GrabReleaseCueNode, { GrabReleaseCueNodeOptions } from '../../nodes/GrabReleaseCueNode.js';
import GroupSelectModel from '../model/GroupSelectModel.js';
import SortCueArrowNode from './SortCueArrowNode.js';

function GROUP_SELECT_ACCESSIBLE_NAME_BEHAVIOR( node: Node, options: NodeOptions, accessibleName: PDOMValueType ): NodeOptions {
  options.ariaLabel = accessibleName; // IMPORTANT! Divs with innerContent aren't recognized with accessibleNames
  options.innerContent = accessibleName;
  return options;
}

type SelfOptions<ItemModel, ItemNode extends Node> = {

  // If GroupSortInteraction doesn't know what the selection should be, this function is called to set the default or
  // best guess selection. Return null to not supply a selection (no focus).
  getGroupItemToSelect: ( () => ItemModel | null );

  // Return the enabled state of a group item. If a group item is not enabled it can be selected, but not sorted.
  isGroupItemEnabled?: ( groupItem: ItemModel ) => boolean;

  // Given a model item, return the corresponding node. Support 'null' as a way to support multiple scenes. If you
  // return null, it means that the provided itemModel is not associated with this view, and shouldn't be handled.
  getNodeFromModelItem: ( model: ItemModel ) => ItemNode | null;

  // Given a model item, return the corresponding focus highlight node. Defaults to the implementation of getNodeFromModelItem.
  // Return null if no highlight should be shown for the selection (not recommended).
  getHighlightNodeFromModelItem?: ( model: ItemModel ) => Node | null;

  // When the selected group item has been grabbed (into "sorting" state).
  onGrab?: ( groupItem: ItemModel ) => void;

  // When the selected group item is released (back into "selecting" state).
  onRelease?: ( groupItem: ItemModel ) => void;

  // To be passed to the grab/release cue node (which is added to the group focus highlight). The visibleProperty is
  // always GroupSelectModel.grabReleaseCueVisibleProperty
  grabReleaseCueOptions?: Partial<StrictOmit<GrabReleaseCueNodeOptions, 'visibleProperty'>>;

  // Accessible content provided to the node. This doesn't change from selecting/sorting states. Client is responsible
  // for setting accessibleName according to grabbed state, see https://github.com/phetsims/scenery-phet/issues/860
  primaryFocusedNodeOptions?: ParallelDOMOptions;
};

type ParentOptions = DisposableOptions;
export type GroupSelectViewOptions<ItemModel, ItemNode extends Node> = SelfOptions<ItemModel, ItemNode> & ParentOptions;

export default class GroupSelectView<ItemModel, ItemNode extends Node> extends Disposable {

  // Update group highlight dynamically by setting the `shape` of this path.
  public readonly groupSortGroupFocusHighlightPath: Path;

  // The cue node for grab/release.
  public readonly grabReleaseCueNode: Node;

  // Emitted when the sorting cue should be repositioned. Most likely because the selection has changed.
  public readonly positionSortCueNodeEmitter = new Emitter();

  private readonly getNodeFromModelItem: ( model: ItemModel ) => ItemNode | null;

  public constructor(
    protected readonly model: GroupSelectModel<ItemModel>,
    primaryFocusedNode: Node, // Client is responsible for setting accessibleName and nothing else!
    providedOptions: GroupSelectViewOptions<ItemModel, ItemNode> ) {

    const options = optionize<
      GroupSelectViewOptions<ItemModel, ItemNode>,
      SelfOptions<ItemModel, ItemNode>,
      ParentOptions>()( {
      onGrab: _.noop,
      onRelease: _.noop,
      getHighlightNodeFromModelItem: providedOptions.getNodeFromModelItem,

      // By default, a group item is enabled it if corresponding Node is enabled.
      isGroupItemEnabled: groupItem => {
        const itemNode = providedOptions.getNodeFromModelItem( groupItem );
        assert && assert( itemNode, 'should have a node for the group item' );
        return itemNode!.enabled;
      },
      primaryFocusedNodeOptions: {
        tagName: 'div',
        focusable: true,
        ariaRole: 'application',
        accessibleNameBehavior: GROUP_SELECT_ACCESSIBLE_NAME_BEHAVIOR
      },
      grabReleaseCueOptions: {}
    }, providedOptions );

    super( options );

    this.getNodeFromModelItem = options.getNodeFromModelItem;

    const selectedGroupItemProperty = this.model.selectedGroupItemProperty;
    const isKeyboardFocusedProperty = this.model.isKeyboardFocusedProperty;
    const isGroupItemKeyboardGrabbedProperty = this.model.isGroupItemKeyboardGrabbedProperty;
    const hasKeyboardGrabbedGroupItemProperty = this.model.hasKeyboardGrabbedGroupItemProperty;

    // Provide the general accessible content for the provided Node
    primaryFocusedNode.mutate( options.primaryFocusedNodeOptions );

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
        isKeyboardFocusedProperty.value = false;
        isGroupItemKeyboardGrabbedProperty.value = false;
      },
      over: () => {

        // When you mouse over while focused, the highlights are hidden, and so update the state (even though we are
        // still technically keyboard focused). This will assist in showing the mouse cue, https://github.com/phetsims/center-and-variability/issues/406
        isKeyboardFocusedProperty.value = false;
      },
      down: () => {

        // We want to remove focus from this node entirely to prevent the focus highlight from showing up when
        // there is no selected group item.
        primaryFocusedNode.blur();
      }
    };

    // When interactive highlights become active on the group, interaction with a mouse has begun while using
    // Interactive Highlighting. When that happens, clear the selection to prevent focus highlight flickering/thrashing.
    // See https://github.com/phetsims/center-and-variability/issues/557 and https://github.com/phetsims/scenery-phet/issues/815
    if ( isInteractiveHighlighting( primaryFocusedNode ) ) {
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
      primaryFocusedNode.isInteractiveHighlightActiveProperty.lazyLink( interactiveHighlightingActiveListener );

      this.disposeEmitter.addListener( () => {
        primaryFocusedNode.isInteractiveHighlightActiveProperty.unlink( interactiveHighlightingActiveListener );
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
      fire: ( event, keysPressed ) => {

        // Do no grab when the interaction is disabled, if there is no selection, or when the individual group item is disabled
        if ( this.model.enabled && selectedGroupItemProperty.value !== null && options.isGroupItemEnabled( selectedGroupItemProperty.value ) ) {

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

    this.disposeEmitter.addListener( () => {
      isGroupItemKeyboardGrabbedProperty.unlink( grabbedPropertyListener );
      primaryFocusedNode.setGroupFocusHighlight( false );
      primaryFocusedNode.setFocusHighlight( null );
      primaryFocusedNode.removeInputListener( grabReleaseKeyboardListener );
      primaryFocusedNode.removeInputListener( focusListener );
      updateFocusHighlight.dispose();
      grabReleaseKeyboardListener.dispose();
    } );
  }

  // By "change" we mean sort or selection.
  protected onGroupItemChange( newGroupItem: ItemModel ): void {
    // When using keyboard input, make sure that the selected group item is still displayed by panning to keep it
    // in view. `panToCenter` is false because centering the group item in the screen is too much movement.
    const node = this.getNodeFromModelItem( newGroupItem );
    node && animatedPanZoomSingleton.listener.panToNode( node, false );

    // Reset to true from keyboard input, in case mouse/touch input set to false during the keyboard interaction.
    this.model.isKeyboardFocusedProperty.value = true;
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
    model: GroupSelectModel<ItemModel>,
    primaryFocusedNode: Node,
    providedOptions: GroupSelectViewOptions<ItemModel, ItemNode> ): GroupSelectView<ItemModel, ItemNode> {

    return new GroupSelectView<ItemModel, ItemNode>( model, primaryFocusedNode, providedOptions );
  }
}

sceneryPhet.register( 'GroupSelectView', GroupSelectView );