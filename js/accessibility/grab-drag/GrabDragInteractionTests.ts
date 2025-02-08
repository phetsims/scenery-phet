// Copyright 2018-2025, University of Colorado Boulder

/**
 * QUnit tests for GrabDragInteraction
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Display from '../../../../scenery/js/display/Display.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GrabDragInteraction from './GrabDragInteraction.js';

// constants
const thingString = 'thing';
const movableString = 'movable';

QUnit.module( 'GrabDragInteraction' );

QUnit.test( 'GrabDragInteraction defaults', assert => {

  assert.ok( true, 'first test' );

  const rootNode = new Node( { tagName: 'div' } );
  const display = new Display( rootNode );
  display.initializeEvents();
  document.body.appendChild( display.domElement );

  phet = phet || {}; // eslint-disable-line no-global-assign
  phet.joist = phet.joist || {}; // eslint-disable-line phet/bad-phet-library-text
  phet.joist.sim = phet.joist.sim || {}; // eslint-disable-line phet/bad-phet-library-text

  // GrabDragInteraction requires a sim
  // eslint-disable-next-line phet/bad-phet-library-text
  phet.joist.sim.supportsGestureDescription = phet.joist.sim.supportsGestureDescription || false;

  const a = new Rectangle( 0, 0, 5, 5 );

  rootNode.addChild( a );

  const interactionCueParent = new Node();
  rootNode.addChild( interactionCueParent );

  const keyboardDragListener = new KeyboardDragListener( {
    tandem: Tandem.ROOT_TEST.createTandem( 'myKeyboardDragListener' )
  } );
  const interaction = new GrabDragInteraction( a, keyboardDragListener, interactionCueParent, {
    tandem: Tandem.ROOT_TEST.createTandem( 'myGrabDragInteraction' ),
    objectToGrabString: thingString
  } );

  const testDefaultIdleState = () => {

    // GrabDragInteraction requires the page to be active to behave corectly, otherwise focus/blur events do not
    // fire. See https://github.com/phetsims/aqua/issues/134.
    if ( document.hasFocus() ) {
      assert.ok( interaction[ 'grabDragModel' ].interactionStateProperty.value === 'idle', 'default to idle' );
      assert.ok( a.tagName!.toUpperCase() === 'BUTTON', 'idle defaults to button' );
      assert.ok( a.ariaRole === null, 'no role for idle' );
      assert.ok( a.ariaLabel!.includes( thingString ), 'ariaLabel should include thing string for idle' );

      const aElement = a.pdomInstances[ 0 ].peer!.primarySibling;
      assert.ok( aElement!.tagName === 'BUTTON', 'idle defaults to button html element.' );
    }
    else {
      console.warn( 'Cannot complete tests because document does not have focus.' );
    }
  };

  testDefaultIdleState();

  a.pdomInstances[ 0 ].peer!.primarySibling!.click();

  const testDefaultGrabbedState = () => {

    assert.ok( interaction[ 'grabDragModel' ].interactionStateProperty.value === 'grabbed', 'should be grabbed after click grabbed' );
    assert.ok( a.tagName!.toUpperCase() === 'DIV', 'grabbed defaults to div' );
    assert.ok( a.ariaRole === 'application', 'grabbed gets application role' );
    assert.ok( a.ariaLabel!.includes( thingString ), 'ariaLabel should include thing string' );
    assert.ok( a.ariaLabel === a.innerContent, 'ariaLabel should include thing string' );

    const aElement = a.pdomInstances[ 0 ].peer!.primarySibling!;
    assert.ok( aElement.tagName === 'DIV', 'grabbed defaults to div html element.' );
    assert.ok( aElement.getAttribute( 'aria-roledescription' ) === movableString, 'aria role description should describe that it is movable by default' );
    assert.ok( aElement.innerHTML === a.ariaLabel, 'element innerHTML should be same as model label' );
    assert.ok( aElement.getAttribute( 'aria-label' ) === a.ariaLabel, 'element innerHTML should be same as model label' );
  };

  testDefaultGrabbedState();

  a.pdomInstances[ 0 ].peer!.primarySibling!.blur();

  testDefaultIdleState();
  display.dispose();
} );

QUnit.test( 'GrabDragInteraction enabled', assert => {

  const rootNode = new Node( { tagName: 'div' } );
  const display = new Display( rootNode );
  display.initializeEvents();
  document.body.appendChild( display.domElement );

  phet = phet || {}; // eslint-disable-line no-global-assign
  phet.joist = phet.joist || {}; // eslint-disable-line phet/bad-phet-library-text
  phet.joist.sim = phet.joist.sim || {}; // eslint-disable-line phet/bad-phet-library-text

  const a = new Rectangle( 0, 0, 5, 5, { tagName: 'div', focusable: true } );

  rootNode.addChild( a );

  const keyboardDragListener = new KeyboardDragListener( {
    tandem: Tandem.ROOT_TEST.createTandem( 'my2KeyboardDragListener' )
  } );

  const dragCueNode = new Circle( 50 );

  const interactionCueParent = new Node();
  rootNode.addChild( interactionCueParent );

  const interaction = new GrabDragInteraction( a, keyboardDragListener, interactionCueParent, {
    tandem: Tandem.ROOT_TEST.createTandem( 'my2GrabDragInteraction' ),
    dragCueNode: dragCueNode,
    objectToGrabString: thingString
  } );

  // GrabDragInteraction requires the page to be active to behave corectly, otherwise focus/blur events do not
  // fire. See https://github.com/phetsims/aqua/issues/134.
  if ( document.hasFocus() ) {

    // Visibility for interaction cues requires DOM focus.
    a.focus();

    assert.ok( interaction[ 'grabCueNode' ].visible, 'starts visible' );
    assert.ok( !interaction[ 'dragCueNode' ].visible, 'starts invisible' );
    interaction.enabled = false;

    assert.ok( !interaction[ 'grabCueNode' ].visible, 'enabled hides grab cue node visible' );
    assert.ok( !interaction[ 'dragCueNode' ].visible, 'enabled hides drag cue node visible' );

    interaction.enabled = true;
    assert.ok( interaction[ 'grabCueNode' ].visible, 'starts again visible' );
    assert.ok( !interaction[ 'dragCueNode' ].visible, 'starts again invisible' );

    a.enabled = false;
    assert.ok( !interaction[ 'grabCueNode' ].visible, 'node enabled visible' );
    assert.ok( !interaction[ 'dragCueNode' ].visible, 'node enabled visible' );
  }
  else {
    assert.ok( true, 'Could not run tests because document does not have focus.' );
  }

  display.dispose();
} );