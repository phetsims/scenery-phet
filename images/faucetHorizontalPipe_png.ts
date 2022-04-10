/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAABUCAIAAAByYpLHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIBJREFUeNrs18ENgCAUBFEQ6ZvCgWgBns0a31YwmfkcqGOMkrGjxAzK087WWgpK7z0F5R4ryVYEYoUVj1kgVljxmNMD1Vp9PlhhhRVWWPm5FYFY+eLZ7r1TUNZaKShzTijJKG5FIIEEEkgggQRyKwIJJJBAAgkkEBS3ItAruwQYANYqfSsDCfJ2AAAAAElFTkSuQmCC';
export default image;