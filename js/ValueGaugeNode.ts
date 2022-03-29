// Copyright 2019-2022, University of Colorado Boulder

/**
 * A GaugeNode with a NumberDisplay located in the center bottom half of the GaugeNode to
 * display the numerical value. The NumberDisplay can be hidden but is visible by default.
 *
 * @author Jesse Greenberg
 */

import IReadOnlyProperty from '../../axon/js/IReadOnlyProperty.js';
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

  /**
   * @param valueProperty
   * @param label
   * @param range
   * @param providedOptions
   */
  constructor( valueProperty: IReadOnlyProperty<number>, label: string, range: Range, providedOptions?: ValueGaugeNodeOptions ) {

    const options = optionize<ValueGaugeNodeOptions, SelfOptions, GaugeNodeOptions>( {

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
   * @param visible
   */
  public setNumberDisplayVisible( visible: boolean ): void {
    if ( visible !== this._numberDisplayVisible ) {
      this._numberDisplayVisible = visible;
      this.numberDisplay.visible = visible;
    }
  }

  set numberDisplayVisible( visible ) { this.setNumberDisplayVisible( visible ); }

  /**
   * Gets the visibility of the gauge's NumberDisplay.
   */
  public getNumberDisplayVisible(): boolean {
    return this._numberDisplayVisible;
  }

  get numberDisplayVisible() { return this.getNumberDisplayVisible(); }

  public override dispose(): void {
    this.numberDisplay.dispose();
    super.dispose();
  }
}

sceneryPhet.register( 'ValueGaugeNode', ValueGaugeNode );