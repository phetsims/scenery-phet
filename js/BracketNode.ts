// Copyright 2015-2022, University of Colorado Boulder

/**
 * BracketNode draws a bracket with an optional label.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Shape } from '../../kite/js/imports.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize from '../../phet-core/js/optionize.js';
import { Node, NodeOptions, Path, TPaint } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

type BracketNodeOrientation = 'left' | 'right' | 'up' | 'down';

type SelfOptions = {

  // refers to the direction that the tip of the bracket points
  orientation?: BracketNodeOrientation;

  // optional label that will be centered below bracket's tip
  labelNode?: Node | null;

  // length of the bracket
  bracketLength?: number;

  // [0,1] exclusive, determines where along the width of the bracket the tip (and optional label) are placed
  bracketTipPosition?: number;

  // radius of the arcs at the ends of the bracket
  bracketEndRadius?: number;

  // radius of the arcs at the tip (center) of the bracket
  bracketTipRadius?: number;

  // color of the bracket
  bracketStroke?: TPaint;

  // line width (thickness) of the bracket
  bracketLineWidth?: number;

  // space between optional label and tip of bracket
  spacing?: number;
};

export type BracketNodeOptions = SelfOptions & NodeOptions;

export default class BracketNode extends Node {

  private readonly disposeBracketNode: () => void;

  public constructor( providedOptions?: BracketNodeOptions ) {

    const options = optionize<BracketNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      orientation: 'down',
      labelNode: null,
      bracketLength: 100,
      bracketTipPosition: 0.5,
      bracketEndRadius: 5,
      bracketTipRadius: 6,
      bracketStroke: 'black',
      bracketLineWidth: 1,
      spacing: 2
    }, providedOptions );

    // validate options
    assert && assert( options.bracketTipPosition > 0 && options.bracketTipPosition < 1 );

    super();

    // compute tip position
    let tipX;
    if ( options.orientation === 'down' || options.orientation === 'left' ) {
      tipX = options.bracketTipPosition * options.bracketLength;
    }
    else {
      tipX = ( 1 - options.bracketTipPosition ) * options.bracketLength;
    }
    assert && assert( tipX > ( options.bracketEndRadius + options.bracketTipRadius ) );
    assert && assert( tipX < options.bracketLength - ( options.bracketEndRadius + options.bracketTipRadius ) );

    // bracket shape, created for 'down' orientation, left-to-right
    const bracketShape = new Shape()
      // left end curves up
      .arc( options.bracketEndRadius, 0, options.bracketEndRadius, Math.PI, 0.5 * Math.PI, true )
      .lineTo( tipX - options.bracketTipRadius, options.bracketEndRadius )
      // tip points down
      .arc( tipX - options.bracketTipRadius, options.bracketEndRadius + options.bracketTipRadius, options.bracketTipRadius, 1.5 * Math.PI, 0 )
      .arc( tipX + options.bracketTipRadius, options.bracketEndRadius + options.bracketTipRadius, options.bracketTipRadius, Math.PI, 1.5 * Math.PI )
      // right end curves up
      .lineTo( options.bracketLength - options.bracketEndRadius, options.bracketEndRadius )
      .arc( options.bracketLength - options.bracketEndRadius, 0, options.bracketEndRadius, 0.5 * Math.PI, 0, true );

    // bracket node
    const bracketNode = new Path( bracketShape, {
      stroke: options.bracketStroke,
      lineWidth: options.bracketLineWidth
    } );
    this.addChild( bracketNode );

    // put the bracket in the correct orientation
    switch( options.orientation ) {
      case 'up':
        bracketNode.rotation = Math.PI;
        break;
      case 'down':
        // do nothing, this is how the shape was created
        break;
      case 'left':
        bracketNode.rotation = Math.PI / 2;
        break;
      case 'right':
        bracketNode.rotation = -Math.PI / 2;
        break;
      default:
        throw new Error( `unsupported orientation: ${options.orientation}` );
    }

    // optional label, centered on the bracket's tip
    let labelNodeBoundsListener: () => void;
    if ( options.labelNode ) {

      const labelNode = options.labelNode;
      this.addChild( labelNode );

      labelNodeBoundsListener = () => {
        switch( options.orientation ) {
          case 'up':
            labelNode.centerX = bracketNode.left + ( options.bracketTipPosition * bracketNode.width );
            labelNode.bottom = bracketNode.top - options.spacing;
            break;
          case 'down':
            labelNode.centerX = bracketNode.left + ( options.bracketTipPosition * bracketNode.width );
            labelNode.top = bracketNode.bottom + options.spacing;
            break;
          case 'left':
            labelNode.right = bracketNode.left - options.spacing;
            labelNode.centerY = bracketNode.top + ( options.bracketTipPosition * bracketNode.height );
            break;
          case 'right':
            labelNode.left = bracketNode.right + options.spacing;
            labelNode.centerY = bracketNode.top + ( options.bracketTipPosition * bracketNode.height );
            break;
          default:
            throw new Error( `unsupported orientation: ${options.orientation}` );
        }
      };
      labelNode.boundsProperty.link( labelNodeBoundsListener );
    }

    this.mutate( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'BracketNode', this );

    this.disposeBracketNode = () => {
      if ( options.labelNode && labelNodeBoundsListener && options.labelNode.boundsProperty.hasListener( labelNodeBoundsListener ) ) {
        options.labelNode.boundsProperty.removeListener( labelNodeBoundsListener );
      }
    };
  }

  public override dispose(): void {
    this.disposeBracketNode();
    super.dispose();
  }
}

sceneryPhet.register( 'BracketNode', BracketNode );