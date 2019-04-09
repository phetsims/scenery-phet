// Copyright 2018-2019, University of Colorado Boulder

/**
 * QUnit tests for GrabDragInteraction
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Display = require( 'SCENERY/display/Display' );
  const GrabDragInteraction = require( 'SCENERY_PHET/accessibility/GrabDragInteraction' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  const thingString = 'thing';


  QUnit.module( 'GrabDragInteraction' );

  QUnit.test( 'GrabDragInteraction defaults', assert => {

    assert.ok( true, 'first test' );

    const rootNode = new Node( { tagName: 'div' } );
    const display = new Display( rootNode ); // eslint-disable-line
    display.initializeEvents();
    document.body.appendChild( display.domElement );

    const a = new Rectangle( 0, 0, 5, 5 );

    rootNode.addChild( a );

    const interaction = new GrabDragInteraction( a, {
      objectToGrabString: thingString
    } );

    const testDefaultGrabbable = () => {

      assert.ok( interaction.grabbable, 'default to grabbable' );
      assert.ok( a.tagName.toUpperCase() === 'BUTTON', 'grabbable defaults to button' );
      assert.ok( a.ariaRole === null, 'no role for grabbable' );
      assert.ok( a.ariaLabel === null, 'no aria-label for grabbable' );

      const aElement = a.accessibleInstances[ 0 ].peer.primarySibling;
      assert.ok( aElement.tagName === 'BUTTON', 'grabbable defaults to button html element.' );
    };

    testDefaultGrabbable();

    a.accessibleInstances[ 0 ].peer.primarySibling.click();


    const testDefaultDraggable = () => {

      assert.ok( !interaction.grabbable, 'should be draggable after click draggable' );
      assert.ok( a.tagName.toUpperCase() === 'DIV', 'draggable defaults to div' );
      assert.ok( a.ariaRole === 'application', 'draggable gets application role' );
      assert.ok( a.ariaLabel.indexOf( thingString ) > 0, 'ariaLabel should include thing string' );
      assert.ok( a.ariaLabel === a.innerContent, 'ariaLabel should include thing string' );

      const aElement = a.accessibleInstances[ 0 ].peer.primarySibling;
      assert.ok( aElement.tagName === 'DIV', 'draggable defaults to div html element.' );
      assert.ok( aElement.getAttribute( 'aria-roledescription' ) === a.ariaLabel, 'aria role description should be same as model label' );
      assert.ok( aElement.innerHTML === a.ariaLabel, 'element innerHTML should be same as model label' );
      assert.ok( aElement.getAttribute( 'aria-label' ) === a.ariaLabel, 'element innerHTML should be same as model label' );
    };

    testDefaultDraggable();

    a.accessibleInstances[ 0 ].peer.primarySibling.blur();

    testDefaultGrabbable();

    display.detachEvents();
  } );
} );