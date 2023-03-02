// Copyright 2014-2023, University of Colorado Boulder

/**
 * ScientificNotationNode displays a number in scientific notation, M x 10^E, where:
 * - M is the mantissa
 * - E is the exponent, a positive or negative integer
 *
 * For example, with 2 decimal places in the mantissa, 0.0002342 would be written as 2.34 x 10^-4.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Utils from '../../dot/js/Utils.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { EmptySelfOptions } from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import { Font, TColor, Node, NodeOptions, Text, TextOptions } from '../../scenery/js/imports.js';
import MathSymbols from './MathSymbols.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  fill?: TColor;
  font?: Font;
  exponent?: number | null; // if null, exponent will be computed so that mantissa has 1 digit to the left of the decimal point
  mantissaDecimalPlaces?: number;
  exponentScale?: number; // scale of the exponent, relative to the size of the '10'
  showIntegersAsMantissaOnly?: boolean; // if true, show 8000 as '8000', otherwise '8 x 10^3'
  showZeroAsInteger?: boolean; // if true, show '0 x 10^E' as '0'
  showZeroExponent?: boolean; // if false, show 'M x 10^0' as 'M'
  exponentXSpacing?: number; // space to left of exponent
  exponentYOffset?: number; // offset of exponent's center from cap line
  capHeightScale?: number; // fudge factor for computing this.capHeight, compensates for inaccuracy of Text.height
  nullValueString?: string; // if the value is null, display this string
};

export type ScientificNotationNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

// options for toScientificNotation
export type ToScientificNotationOptions = Pick<ScientificNotationNodeOptions, 'mantissaDecimalPlaces' | 'exponent'>;

// return type of toScientificNotation
export type ScientificNotation = {
  mantissa: string;
  exponent: string;
};

export default class ScientificNotationNode extends Node {

  public readonly valueProperty: TReadOnlyProperty<number | null>;
  private readonly options: Required<SelfOptions>;

  // width of space between mantissa and 'x 10'
  private readonly mantissaXSpacing: number;

  // the height of capital letters (aka cap line)
  private readonly capHeight: number;

  // parts of the representation, 'M x 10^E'
  private readonly mantissaNode: Text;
  private readonly timesTenNode: Text;
  private readonly exponentNode: Text;

  private readonly disposeScientificNotationNode: () => void;

  public constructor( valueProperty: TReadOnlyProperty<number | null>, providedOptions?: ScientificNotationNodeOptions ) {

    const options = optionize<ScientificNotationNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      fill: 'black',
      font: new PhetFont( 20 ),
      exponent: null, // exponent will be computed
      mantissaDecimalPlaces: 1,
      exponentScale: 0.75,
      showIntegersAsMantissaOnly: false,
      showZeroAsInteger: true,
      showZeroExponent: false,
      exponentXSpacing: 2,
      exponentYOffset: 0,
      capHeightScale: 0.75,
      nullValueString: MathSymbols.NO_VALUE
    }, providedOptions );

    super();

    this.valueProperty = valueProperty;
    this.options = options;

    const textOptions = { font: options.font, fill: options.fill };

    // Compute font metrics that we'll need for layout.
    const tmpText = new Text( ' ', textOptions );
    this.mantissaXSpacing = tmpText.width;
    this.capHeight = options.capHeightScale * ( tmpText.top - tmpText.y );

    this.mantissaNode = new Text( '?', textOptions );
    this.timesTenNode = new Text( '?', textOptions );
    this.exponentNode = new Text( '?', optionize<TextOptions, EmptySelfOptions, TextOptions>()( {
      scale: options.exponentScale, // exponent is scaled!
      centerY: this.timesTenNode.y + this.capHeight + options.exponentYOffset
    }, textOptions ) );

    // We'll start with just the mantissaNode. update will add the other Nodes as appropriate.
    assert && assert( !options.children, 'ScientificNotationNode sets children' );
    options.children = [ this.mantissaNode ];

    this.mutate( options );

    const valuePropertyObserver = this.update.bind( this );
    valueProperty.link( valuePropertyObserver );

    this.disposeScientificNotationNode = () => {
      if ( valueProperty.hasListener( valuePropertyObserver ) ) {
        valueProperty.unlink( valuePropertyObserver );
      }
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ScientificNotationNode', this );
  }

  public override dispose(): void {
    this.disposeScientificNotationNode();
    super.dispose();
  }

  private update( value: number | null ): void {

    const options = this.options;

    // NOTE: Adding and removing nodes is more expensive than changing visibility, but results in correct bounds.
    // So this implementation sets this.children based on which child Nodes should be visible.

    if ( value === null ) {

      // no value
      this.mantissaNode.string = options.nullValueString;
      this.children = [ this.mantissaNode ];
    }
    else if ( !isFinite( value ) ) {

      // use built-in toFixed to format values that are not finite
      // NaN -> 'NaN', Infinity -> 'Infinity', etc.
      this.mantissaNode.string = value.toFixed( 0 ); // eslint-disable-line bad-sim-text
      this.children = [ this.mantissaNode ];
    }
    else if ( Math.floor( value ) === value && options.showIntegersAsMantissaOnly ) {

      // show integers as mantissa only, 'M'
      this.mantissaNode.string = value;
      this.children = [ this.mantissaNode ];
    }
    else {
      const scientificNotation = ScientificNotationNode.toScientificNotation( value, options );

      if ( parseFloat( scientificNotation.mantissa ) === 0 && options.showZeroAsInteger ) {

        // show '0 x 10^E' as '0'
        this.mantissaNode.string = '0';
        this.children = [ this.mantissaNode ];
      }
      else if ( scientificNotation.exponent === '0' && !options.showZeroExponent ) {

        // show 'M x 10^0' as 'M'
        this.mantissaNode.string = scientificNotation.mantissa;
        this.children = [ this.mantissaNode ];
      }
      else {

        // show 'M x 10^E'
        this.mantissaNode.string = scientificNotation.mantissa;
        this.timesTenNode.string = 'x 10';
        this.exponentNode.string = scientificNotation.exponent;
        this.children = [ this.mantissaNode, this.exponentNode, this.timesTenNode ];

        // adjust layout
        this.timesTenNode.left = this.mantissaNode.right + this.mantissaXSpacing;
        this.exponentNode.left = this.timesTenNode.right + options.exponentXSpacing;
      }
    }
  }

  /**
   * Converts a number to scientific-notation format: M x 10^E, with mantissa M and exponent E.
   */
  public static toScientificNotation( value: number, providedOptions?: ToScientificNotationOptions ): ScientificNotation {
    assert && assert( isFinite( value ), `value must be finite: ${value}` );

    const options = optionize<ToScientificNotationOptions, EmptySelfOptions, ToScientificNotationOptions>()( {
      mantissaDecimalPlaces: 1,
      exponent: null // exponent will be computed
    }, providedOptions );

    let mantissa: string;
    let exponent: string;
    if ( options.exponent !== null ) {

      // M x 10^E, where E is options.exponent
      //TODO https://github.com/phetsims/dot/issues/113 division here and in Utils.toFixed can result in floating-point error that affects rounding
      mantissa = Utils.toFixed( value / Math.pow( 10, options.exponent ), options.mantissaDecimalPlaces );
      exponent = options.exponent.toString();
    }
    else {

      // Convert to a string in exponential notation, where the mantissa has 1 digit to the left of the decimal place.
      //TODO https://github.com/phetsims/scenery-phet/issues/613 toExponential uses Number.toFixed, which doesn't round the same on all platforms
      const exponentialString = value.toExponential( options.mantissaDecimalPlaces );

      // Break into mantissa and exponent tokens.
      const tokens = exponentialString.toLowerCase().split( 'e' );
      mantissa = tokens[ 0 ];
      exponent = tokens[ 1 ];

      // The exponent token include a '+' or '-' sign. Remove the '+' sign from positive exponents.
      if ( exponent.startsWith( '+' ) ) {
        exponent = exponent.substring( 1, exponent.length );
      }
    }

    // mantissa x 10^exponent
    return {
      mantissa: mantissa,
      exponent: exponent
    };
  }
}

sceneryPhet.register( 'ScientificNotationNode', ScientificNotationNode );