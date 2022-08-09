// Copyright 2013-2022, University of Colorado Boulder

/**
 * Scenery node that represents a simple, non-interactive clock.  It is
 * intended for use in situations where an icon representing time is needed.
 *
 * @author John Blanco
 */

import optionize from '../../phet-core/js/optionize.js';
import { Circle, TPaint, Line, LineOptions, Node, NodeOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  fill?: TPaint;
  stroke?: TPaint;
  lineWidth?: number;
};

export type SimpleClockIconOptions = SelfOptions & NodeOptions;

export default class SimpleClockIcon extends Node {

  public constructor( radius: number, providedOptions?: SimpleClockIconOptions ) {

    super();

    const options = optionize<SimpleClockIconOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      fill: 'white',
      stroke: 'black',
      lineWidth: 2
    }, providedOptions );

    this.addChild( new Circle( radius, options ) );
    this.addChild( new Circle( radius * 0.15, { fill: options.stroke } ) );
    const lineOptionsForClockHands: LineOptions = {
      stroke: options.stroke,
      lineWidth: options.lineWidth,
      lineCap: 'round',
      lineJoin: 'round'
    };

    // Hands at 4 o'clock
    this.addChild( new Line( 0, 0, 0, -radius * 0.75, lineOptionsForClockHands ) );
    this.addChild( new Line( 0, 0, radius * 0.45, radius * 0.3, lineOptionsForClockHands ) );
    this.centerX = radius;
    this.centerY = radius;

    this.mutate( options );
  }
}

sceneryPhet.register( 'SimpleClockIcon', SimpleClockIcon );