// Copyright 2019-2023, University of Colorado Boulder

/**
 * Mostly like a normal Rectangle (Node), but instead of a hard transition from "in" to "out", it has a defined region
 * of gradients around the edges.
 *
 * Has options for controlling the margin amounts for each side. This will control the area that will be covered
 * by a gradient.
 *
 * You can control the margin amounts for each side individually with:
 * - leftMargin
 * - rightMargin
 * - topMargin
 * - bottomMargin
 *
 * Additionally, the horizontal/vertical margins can also be controlled together with:
 * - xMargin
 * - yMargin
 *
 * And all margins can be controlled together with:
 * - margin
 *
 * These options can be provided in the options object, or can be used with setters/getters (like normal Node
 * options). Note that the getters only work if all equivalent values are the same.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import Matrix3 from '../../dot/js/Matrix3.js';
import { Shape } from '../../kite/js/imports.js';
import { EmptySelfOptions } from '../../phet-core/js/optionize.js';
import { ColorDef, TColor, TPaint, LinearGradient, PaintColorProperty, Path, RadialGradient, Rectangle, RectangleOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const GRADIENT_RECTANGLE_OPTION_KEYS = [
  'roundMargins',
  'border',
  'extension',
  'margin',
  'xMargin',
  'yMargin',
  'leftMargin',
  'rightMargin',
  'topMargin',
  'bottomMargin'
];

type SelfOptions = EmptySelfOptions;

export type GradientRectangleOptions = SelfOptions & RectangleOptions;

export default class GradientRectangle extends Rectangle {

  // Margin amounts for each individual side
  private _leftMargin: number;
  private _rightMargin: number;
  private _topMargin: number;
  private _bottomMargin: number;

  // The starting color stop ratio.
  private _extension: number;

  private _roundMargins: boolean;

  private readonly _fillProperty: PaintColorProperty;
  private readonly _borderOverrideProperty: PaintColorProperty;
  private readonly _borderProperty: TColor;

  private readonly roundedShape: Shape;
  private readonly rectangularShape: Shape;

  private readonly leftSide: Rectangle;
  private readonly rightSide: Rectangle;
  private readonly topSide: Rectangle;
  private readonly bottomSide: Rectangle;

  private readonly topLeftCorner: Path;
  private readonly topRightCorner: Path;
  private readonly bottomLeftCorner: Path;
  private readonly bottomRightCorner: Path;

  public constructor( providedOptions?: GradientRectangleOptions ) {
    super( {} );

    this._leftMargin = 0;
    this._rightMargin = 0;
    this._topMargin = 0;
    this._bottomMargin = 0;
    this._extension = 0;
    this._roundMargins = true;
    this._fillProperty = new PaintColorProperty( this.fill );
    this._borderOverrideProperty = new PaintColorProperty( null );

    this._borderProperty = new DerivedProperty( [
      this._fillProperty, this._borderOverrideProperty
    ], ( fill, borderOverride ) => {
      if ( this._borderOverrideProperty.paint === null ) {
        return fill.withAlpha( 0 );
      }
      else {
        return borderOverride;
      }
    } );

    this.roundedShape = new Shape().moveTo( 0, 0 ).arc( 0, 0, 1, 0, Math.PI / 2, false ).close().makeImmutable();
    this.rectangularShape = Shape.rectangle( 0, 0, 1, 1 ).makeImmutable();

    this.leftSide = new Rectangle( 0, 0, 1, 1 );
    this.rightSide = new Rectangle( 0, 0, 1, 1 );
    this.topSide = new Rectangle( 0, 0, 1, 1 );
    this.bottomSide = new Rectangle( 0, 0, 1, 1 );
    this.topLeftCorner = new Path( null );
    this.topRightCorner = new Path( null );
    this.bottomLeftCorner = new Path( null );
    this.bottomRightCorner = new Path( null );

    this.invalidateGradients();
    this.invalidateRoundMargins();
    this.invalidateMargin();

    this.mutate( providedOptions );
  }

  /**
   * Updates the rounded-ness of the margins.
   */
  private invalidateRoundMargins(): void {
    if ( this._roundMargins ) {
      this.topLeftCorner.shape = this.roundedShape;
      this.topRightCorner.shape = this.roundedShape;
      this.bottomLeftCorner.shape = this.roundedShape;
      this.bottomRightCorner.shape = this.roundedShape;
    }
    else {
      this.topLeftCorner.shape = this.rectangularShape;
      this.topRightCorner.shape = this.rectangularShape;
      this.bottomLeftCorner.shape = this.rectangularShape;
      this.bottomRightCorner.shape = this.rectangularShape;
    }
  }

  /**
   * Updates the rounded-ness of the margins.
   */
  private invalidateGradients(): void {
    const linearGradient = new LinearGradient( 0, 0, 1, 0 )
      .addColorStop( this._extension, this._fillProperty )
      .addColorStop( 1, this._borderProperty );

    const radialGradient = new RadialGradient( 0, 0, 0, 0, 0, 1 )
      .addColorStop( this._extension, this._fillProperty )
      .addColorStop( 1, this._borderProperty );

    this.leftSide.fill = linearGradient;
    this.rightSide.fill = linearGradient;
    this.topSide.fill = linearGradient;
    this.bottomSide.fill = linearGradient;
    this.topLeftCorner.fill = radialGradient;
    this.topRightCorner.fill = radialGradient;
    this.bottomLeftCorner.fill = radialGradient;
    this.bottomRightCorner.fill = radialGradient;
  }

  /**
   * Custom behavior so we can see when the rectangle dimensions change.
   */
  protected override invalidateRectangle(): void {
    super.invalidateRectangle();

    // Update our margins
    this.invalidateMargin();
  }

  /**
   * Handles repositioning of the margins.
   */
  private invalidateMargin(): void {
    this.children = [
      ...( this._leftMargin > 0 && this.rectHeight > 0 ? [ this.leftSide ] : [] ),
      ...( this._rightMargin > 0 && this.rectHeight > 0 ? [ this.rightSide ] : [] ),
      ...( this._topMargin > 0 && this.rectWidth > 0 ? [ this.topSide ] : [] ),
      ...( this._bottomMargin > 0 && this.rectWidth > 0 ? [ this.bottomSide ] : [] ),
      ...( this._topMargin > 0 && this._leftMargin > 0 ? [ this.topLeftCorner ] : [] ),
      ...( this._topMargin > 0 && this._rightMargin > 0 ? [ this.topRightCorner ] : [] ),
      ...( this._bottomMargin > 0 && this._leftMargin > 0 ? [ this.bottomLeftCorner ] : [] ),
      ...( this._bottomMargin > 0 && this._rightMargin > 0 ? [ this.bottomRightCorner ] : [] )
    ];

    const width = this.rectWidth;
    const height = this.rectHeight;

    const left = this.rectX;
    const top = this.rectY;
    const right = this.rectX + width;
    const bottom = this._rectY + height;

    if ( this.leftSide.hasParent() ) {
      this.leftSide.matrix = new Matrix3().rowMajor(
        -this._leftMargin, 0, left,
        0, height, top,
        0, 0, 1
      );
    }
    if ( this.rightSide.hasParent() ) {
      this.rightSide.matrix = new Matrix3().rowMajor(
        this._rightMargin, 0, right,
        0, height, top,
        0, 0, 1
      );
    }
    if ( this.topSide.hasParent() ) {
      this.topSide.matrix = new Matrix3().rowMajor(
        0, width, left,
        -this._topMargin, 0, top,
        0, 0, 1
      );
    }
    if ( this.bottomSide.hasParent() ) {
      this.bottomSide.matrix = new Matrix3().rowMajor(
        0, width, left,
        this._bottomMargin, 0, bottom,
        0, 0, 1
      );
    }
    if ( this.topLeftCorner.hasParent() ) {
      this.topLeftCorner.matrix = new Matrix3().rowMajor(
        -this._leftMargin, 0, left,
        0, -this._topMargin, top,
        0, 0, 1
      );
    }
    if ( this.topRightCorner.hasParent() ) {
      this.topRightCorner.matrix = new Matrix3().rowMajor(
        this._rightMargin, 0, right,
        0, -this._topMargin, top,
        0, 0, 1
      );
    }
    if ( this.bottomLeftCorner.hasParent() ) {
      this.bottomLeftCorner.matrix = new Matrix3().rowMajor(
        -this._leftMargin, 0, left,
        0, this._bottomMargin, bottom,
        0, 0, 1
      );
    }
    if ( this.bottomRightCorner.hasParent() ) {
      this.bottomRightCorner.matrix = new Matrix3().rowMajor(
        this._rightMargin, 0, right,
        0, this._bottomMargin, bottom,
        0, 0, 1
      );
    }
  }

  /**
   * Overrides disposal to clean up some extra things.
   */
  public override dispose(): void {
    this._fillProperty.dispose();
    this._borderOverrideProperty.dispose();

    super.dispose();
  }

  /**
   * We want to be notified of fill changes.
   */
  public override setFill( fill: TPaint ): this {
    assert && assert( ColorDef.isColorDef( fill ), 'GradientRectangle only supports ColorDef as a fill' );

    super.setFill( fill );

    this._fillProperty.paint = fill;

    return this;
  }

  /**
   * We don't want to allow strokes.
   */
  public override setStroke( stroke: TPaint ): this {
    assert && assert( stroke === null, 'GradientRectangle only supports a null stroke' );

    super.setStroke( stroke );

    return this;
  }

  /*
   * NOTE TO THE READER:
   * This super-boilerplate-heavy style is made to conform to the guidelines. Sorry!
   */

  /**
   * Sets the left-side margin amount (the amount in local-coordinate units from the left edge of the rectangle to
   * where the margin ends).
   */
  public set leftMargin( value: number ) {
    assert && assert( isFinite( value ) && value >= 0,
      'leftMargin should be a finite non-negative number' );

    if ( this._leftMargin !== value ) {
      this._leftMargin = value;

      this.invalidateMargin();
    }
  }

  /**
   * Gets the left-side margin amount.
   */
  public get leftMargin(): number {
    return this._leftMargin;
  }

  /**
   * Sets the right-side margin amount (the amount in local-coordinate units from the right edge of the rectangle to
   * where the margin ends).
   */
  public set rightMargin( value: number ) {
    assert && assert( isFinite( value ) && value >= 0,
      'rightMargin should be a finite non-negative number' );

    if ( this._rightMargin !== value ) {
      this._rightMargin = value;

      this.invalidateMargin();
    }
  }

  /**
   * Gets the right-side margin amount.
   */
  public get rightMargin(): number {
    return this._rightMargin;
  }

  /**
   * Sets the top-side margin amount (the amount in local-coordinate units from the top edge of the rectangle to
   * where the margin ends).
   */
  public set topMargin( value: number ) {
    assert && assert( isFinite( value ) && value >= 0,
      'topMargin should be a finite non-negative number' );

    if ( this._topMargin !== value ) {
      this._topMargin = value;

      this.invalidateMargin();
    }
  }

  /**
   * Gets the top-side margin amount.
   */
  public get topMargin(): number {
    return this._topMargin;
  }

  /**
   * Sets the bottom-side margin amount (the amount in local-coordinate units from the bottom edge of the rectangle to
   * where the margin ends).
   */
  public set bottomMargin( value: number ) {
    assert && assert( isFinite( value ) && value >= 0,
      'bottomMargin should be a finite non-negative number' );

    if ( this._bottomMargin !== value ) {
      this._bottomMargin = value;

      this.invalidateMargin();
    }
  }

  /**
   * Gets the bottom-side margin amount.
   */
  public get bottomMargin(): number {
    return this._bottomMargin;
  }

  /**
   * Sets the left and right margin amounts.
   */
  public set xMargin( value: number ) {
    assert && assert( isFinite( value ) && value >= 0,
      'xMargin should be a finite non-negative number' );

    if ( this._leftMargin !== value || this._rightMargin !== value ) {
      this._leftMargin = value;
      this._rightMargin = value;

      this.invalidateMargin();
    }
  }

  /**
   * Gets the left and right margin amounts.
   */
  public get xMargin(): number {
    assert && assert( this._leftMargin === this._rightMargin,
      'leftMargin and rightMargin differ, so getting xMargin is not well-defined' );

    return this._leftMargin;
  }

  /**
   * Sets the top and bottom margin amounts.
   */
  public set yMargin( value: number ) {
    assert && assert( isFinite( value ) && value >= 0,
      'yMargin should be a finite non-negative number' );

    if ( this._topMargin !== value || this._bottomMargin !== value ) {
      this._topMargin = value;
      this._bottomMargin = value;

      this.invalidateMargin();
    }
  }

  /**
   * Gets the top and bottom margin amounts.
   */
  public get yMargin(): number {
    assert && assert( this._topMargin === this._bottomMargin,
      'leftMargin and rightMargin differ, so getting yMargin is not well-defined' );

    return this._topMargin;
  }

  /**
   * Sets all of the margin amounts.
   */
  public set margin( value: number ) {
    assert && assert( isFinite( value ) && value >= 0,
      'margin should be a finite non-negative number' );

    if ( this._leftMargin !== value || this._rightMargin !== value || this._topMargin !== value || this._bottomMargin !== value ) {
      this._leftMargin = value;
      this._rightMargin = value;
      this._topMargin = value;
      this._bottomMargin = value;

      this.invalidateMargin();
    }
  }

  /**
   * Gets the top and bottom margin amounts.
   */
  public get margin(): number {
    assert && assert( this._leftMargin === this._rightMargin && this._rightMargin === this._topMargin && this._topMargin === this._bottomMargin,
      'Some margins differ, so getting margin is not well-defined' );

    return this._leftMargin;
  }

  /**
   * Sets whether the corners of the margin will be rounded or not.
   */
  public set roundMargins( value: boolean ) {
    if ( this._roundMargins !== value ) {
      this._roundMargins = value;

      this.invalidateRoundMargins();
    }
  }

  /**
   * Returns whether the corners of the margin are rounded or not.
   */
  public get roundMargins(): boolean {
    return this._roundMargins;
  }

  /**
   * Sets the border "fade" color (that is on the other side of the gradient).
   */
  public set border( value: TPaint ) {
    assert && assert( ColorDef.isColorDef( value ) );

    if ( this._borderOverrideProperty.paint !== value ) {
      this._borderOverrideProperty.paint = value;
    }
  }

  /**
   * Returns the border color (see the setter)
   */
  public get border(): TPaint {
    return this._borderOverrideProperty.paint;
  }

  /**
   * Sets the extension amount (from 0 to <1) of where the "starting" gradient amount should be.
   */
  public set extension( value: number ) {
    assert && assert( isFinite( value ) && value >= 0 && value < 1 );

    if ( this._extension !== value ) {
      this._extension = value;

      this.invalidateGradients();
    }
  }

  /**
   * Returns the extension amount (see the setter).
   */
  public get extension(): number {
    return this._extension;
  }

  public override mutate( options?: GradientRectangleOptions ): this {
    return super.mutate( options );
  }
}

// We use the Node system for mutator keys, so they get added here
GradientRectangle.prototype._mutatorKeys = [
  ...GRADIENT_RECTANGLE_OPTION_KEYS,
  ...Rectangle.prototype._mutatorKeys
];

sceneryPhet.register( 'GradientRectangle', GradientRectangle );