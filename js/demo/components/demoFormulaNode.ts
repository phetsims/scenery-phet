// Copyright 2022, University of Colorado Boulder

/**
 * Demo for FormulaNode
 */

import FormulaNode from '../../FormulaNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Node, Rectangle } from '../../../../scenery/js/imports.js';

export default function demoFormulaNode( layoutBounds: Bounds2 ): Node {

  const conditional = '\\forall \\mathbf{p}\\in\\mathbb{R}^2';
  const leftVert = '\\left\\lVert';
  const rightVert = '\\right\\rVert';
  const matrix = '\\begin{bmatrix} \\cos\\theta & \\sin\\theta \\\\ -\\sin\\theta & \\cos\\theta \\end{bmatrix}^{k+1}';
  const sumExpr = `${leftVert}\\sum_{k=1}^{\\infty}kx^{k-1}${matrix}${rightVert}`;
  const integral = '\\int_{0}^{2\\pi}\\overline{f(\\theta)}\\cos\\theta\\,\\mathrm{d}\\theta';
  const invCos = '\\cos^{-1}\\left( \\frac{\\sqrt{\\varphi_2}}{\\sqrt{x_2^2+x_3^2}} \\right)';

  const formulaNode = new FormulaNode( `${conditional}\\quad ${sumExpr} = ${invCos} + ${integral}`, {
    center: layoutBounds.center,
    scale: 1.3,
    displayMode: true
  } );

  const boundsRectangle = Rectangle.bounds( formulaNode.bounds, {
    fill: 'rgba(0,0,0,0.1)'
  } );

  return new Node( {
    children: [ boundsRectangle, formulaNode ]
  } );
}