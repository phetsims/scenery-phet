// Copyright 2019-2022, University of Colorado Boulder

/**
 * A GaugeNode with a NumberDisplay located in the center bottom half of the GaugeNode to
 * display the numerical value. The NumberDisplay can be hidden but is visible by default.
 *
 * @author Jesse Greenberg
 */

import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Range from '../../dot/js/Range.js';
import Vector2 from '../../dot/js/Vector2.js';
import optionize from '../../phet-core/js/optionize.js';
import GaugeNode, { GaugeNodeOptions } from './GaugeNode.js';
import NumberDisplay, { NumberDisplayOptions } from './NumberDisplay.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const DEFAULT_FONT = new PhetFont( 16 );

type SelfOptions = {

  // options passed to the NumberDisplay
  numberDisplayOptions?: NumberDisplayOptions;
};

export type ValueGaugeNodeOptions = SelfOptions & GaugeNodeOptions;

export default class ValueGaugeNode extends GaugeNode {

  private _numberDisplayVisible: boolean;
  private readonly numberDisplay: NumberDisplay;

  public constructor( valueProperty: TReadOnlyProperty<number>, label: TReadOnlyProperty<string>, range: Range,
                      providedOptions?: ValueGaugeNodeOptions ) {

    const options = optionize<ValueGaugeNodeOptions, SelfOptions, GaugeNodeOptions>()( {

      // SelfOptions
      numberDisplayOptions: {
        textOptions: {
          font: DEFAULT_FONT
        },
        backgroundStroke: 'black',
        align: 'center',
        cornerRadius: 5
      }
    }, providedOptions );

    super( valueProperty, label, range, options );

    this._numberDisplayVisible = true;

    this.numberDisplay = new NumberDisplay( valueProperty, range, options.numberDisplayOptions );
    this.addChild( this.numberDisplay );

    assert && assert( this.numberDisplay.matrix.translation.equals( Vector2.ZERO ),
      'NumberDisplay translation options are not allowed. ValueGaugeNode positions the NumberDisplay' );
    this.numberDisplay.center = new Vector2( 0, this.radius / 2 );
  }

  /**
   * Sets the visibility of the gauge's NumberDisplay.
   */
  public setNumberDisplayVisible( visible: boolean ): void {
    if ( visible !== this._numberDisplayVisible ) {
      this._numberDisplayVisible = visible;
      this.numberDisplay.visible = visible;
    }
  }

  public set numberDisplayVisible( visible: boolean ) { this.setNumberDisplayVisible( visible ); }

  public get numberDisplayVisible(): boolean { return this.getNumberDisplayVisible(); }

  /**
   * Gets the visibility of the gauge's NumberDisplay.
   */
  public getNumberDisplayVisible(): boolean {
    return this._numberDisplayVisible;
  }


  public override dispose(): void {
    this.numberDisplay.dispose();
    super.dispose();
  }
}

sceneryPhet.register( 'ValueGaugeNode', ValueGaugeNode );