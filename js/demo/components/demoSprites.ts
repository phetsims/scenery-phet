// Copyright 2022-2023, University of Colorado Boulder

/**
 * Demo for Sprites
 *
 * @author Jonathan Olson
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import arrayRemove from '../../../../phet-core/js/arrayRemove.js';
import { DragListener, Node, PressedDragListener, Rectangle, Sprite, SpriteImage, SpriteInstance, SpriteListenable, Sprites, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import flame_png from '../../../images/flame_png.js';
import iceCubeStack_png from '../../../images/iceCubeStack_png.js';
import measuringTape_png from '../../../images/measuringTape_png.js';
import NumberControl from '../../NumberControl.js';

type SpriteInstanceWithVelocity = SpriteInstance & { velocity: Vector2 };

export default function demoSprites( layoutBounds: Bounds2 ): Node {

  const spriteCountProperty = new NumberProperty( 500, {
    range: new Range( 0, 10000 )
  } );
  const spriteSpeedProperty = new NumberProperty( 15, {
    range: new Range( 0, 100 )
  } );
  const spriteScaleProperty = new NumberProperty( 0.5, {
    range: new Range( 0.01, 1 )
  } );

  const getAvailableWidth = () => layoutBounds.width / spriteScaleProperty.value;
  const getAvailableHeight = () => layoutBounds.height / spriteScaleProperty.value;

  // SpriteImage references
  const flameSpriteImage = new SpriteImage( flame_png, new Vector2( 44, 42 ), { hitTestPixels: true } );
  const measuringTapeSpriteImage = new SpriteImage( measuringTape_png, new Vector2( 50, 40 ), { hitTestPixels: true } );
  const iceCubeStackSpriteImage = new SpriteImage( iceCubeStack_png, new Vector2( 25, 25 ), { hitTestPixels: true } );

  // Example of how to create a SpriteImage from a non-HTMLImageElement, as recommended by @jonathanolson
  // in https://github.com/phetsims/beers-law-lab/issues/276#issuecomment-1347071650
  // Add additional parameters for the toCanvas callback if you need resolution scaling.
  const particleRectangle = new Rectangle( 0, 0, 50, 50, {
    fill: 'red',
    stroke: 'black'
  } );
  let particleSpriteImage: SpriteImage;
  particleRectangle.toCanvas( canvas => {
    particleSpriteImage = new SpriteImage( canvas, particleRectangle.center );
  } );

  // Sprites
  const sprite0 = new Sprite( flameSpriteImage );
  const sprite1 = new Sprite( measuringTapeSpriteImage );
  const sprite2 = new Sprite( iceCubeStackSpriteImage );
  const sprite3 = new Sprite( particleSpriteImage! );

  const createSpriteInstance = (): SpriteInstanceWithVelocity => {
    const instance = SpriteInstance.pool.create() as SpriteInstanceWithVelocity;
    instance.sprite = dotRandom.sample( [ sprite0, sprite1, sprite2, sprite3 ] );
    instance.matrix.setToTranslation( dotRandom.nextDouble() * getAvailableWidth(), dotRandom.nextDouble() * getAvailableHeight() );

    // Put a custom velocity on each one
    instance.velocity = Vector2.createPolar( 1, dotRandom.nextDouble() * 2 * Math.PI );

    return instance;
  };

  // We'll hold our SpriteInstances here in this array (the reference to this exact array will be used)
  const instances = _.range( 0, spriteCountProperty.value ).map( createSpriteInstance );

  // Adjust sprite count dynamically
  spriteCountProperty.lazyLink( ( value, oldValue ) => {
    const delta = value - oldValue;
    if ( delta > 0 ) {
      _.range( 0, delta ).forEach( () => instances.push( createSpriteInstance() ) );
    }
    else {
      _.range( 0, -delta ).forEach( () => instances.pop() );
    }
  } );

  let selectedInstance: SpriteInstanceWithVelocity | null = null;

  // Create the 'Sprites' node
  const sprites = new Sprites( {

    // The sprites we have available (fixed, won't change)
    sprites: [ sprite0, sprite1, sprite2, sprite3 ],
    spriteInstances: instances,
    canvasBounds: layoutBounds.dilated( 200 ),
    hitTestSprites: true,
    cursor: 'pointer',

    // Mix in SpriteListenable, so we (a) have access to the SpriteInstance and (b) will only interact when there is one
    inputListeners: [ new ( SpriteListenable( DragListener ) )( {
      applyOffset: false,

      start: ( event, listener: PressedDragListener ) => {

        const myListener = listener as PressedDragListener & { spriteInstance: SpriteInstanceWithVelocity };
        selectedInstance = myListener.spriteInstance;

        // e.g. moveToFront
        arrayRemove( instances, selectedInstance );
        instances.push( selectedInstance );
      },

      drag: ( event, listener ) => {
        // translate the selected instance
        const matrix = selectedInstance!.matrix;
        matrix.set02( matrix.m02() + listener.modelDelta.x / spriteScaleProperty.value );
        matrix.set12( matrix.m12() + listener.modelDelta.y / spriteScaleProperty.value );

        sprites.invalidatePaint();
      },

      end: () => {
        selectedInstance = null;
      }
    } ) ]
  } );

  spriteScaleProperty.link( ( scale, oldScale ) => {
    sprites.setScaleMagnitude( scale, scale );
    sprites.canvasBounds = Bounds2.rect( 0, 0, getAvailableWidth(), getAvailableHeight() ).dilated( 200 );

    // rescale positions
    if ( oldScale ) {
      instances.forEach( instance => {
        instance.matrix.set02( instance.matrix.m02() * oldScale / scale );
        instance.matrix.set12( instance.matrix.m12() * oldScale / scale );
      } );
    }
  } );

  sprites.invalidatePaint();

  const listener = ( dt: number ) => {

    const distance = dt * spriteSpeedProperty.value / spriteScaleProperty.value;
    const width = getAvailableWidth();
    const height = getAvailableHeight();

    for ( let i = instances.length - 1; i >= 0; i-- ) {
      const instance = instances[ i ];
      if ( instance !== selectedInstance ) {
        const matrix = instance.matrix;

        // Optimized translation
        matrix.set02( ( matrix.m02() + instance.velocity.x * distance + width ) % width );
        matrix.set12( ( matrix.m12() + instance.velocity.y * distance + height ) % height );
      }
    }

    // We modified our instances, so we need this to repaint
    sprites.invalidatePaint();
  };

  stepTimer.addListener( listener );

  sprites.dispose = () => {
    stepTimer.removeListener( listener );
    Node.prototype.dispose.call( node );
  };

  const controlPanel = new Panel( new VBox( {
    spacing: 10,
    children: [
      new NumberControl( 'Sprite Count:', spriteCountProperty, spriteCountProperty.range ),
      new NumberControl( 'Sprite Speed:', spriteSpeedProperty, spriteSpeedProperty.range ),
      new NumberControl( 'Sprite Scale:', spriteScaleProperty, spriteScaleProperty.range, {
        delta: 0.01,
        numberDisplayOptions: {
          decimalPlaces: 2
        }
      } )
    ]
  } ), {
    bottom: layoutBounds.bottom - 10,
    right: layoutBounds.right - 10
  } );

  const node = new Node( {
    children: [ sprites, controlPanel ]
  } );
  return node;
}