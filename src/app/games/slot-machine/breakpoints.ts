import { BreakpointState } from '@angular/cdk/layout';

export const BreakpointsWidthSizes = {
  XSmall: {widthStr: '(min-width: 1000px)', lights: 29},
  Small: {widthStr: '(min-width: 1200px)', lights: 36},
  Medium: {widthStr: '(min-width: 1400px)', lights: 41},
  Large: {widthStr: '(min-width: 1600px)', lights: 47},
  XLarge: {widthStr: '(min-width: 1800px)', lights: 53},
  XXLarge: {widthStr: '(min-width: 2000px)', lights: 60}
};

export const BreakpointsHeightSizes = {
  XSmall: {heightStr: '(min-height: 400px)', lights: 11},
  Small: {heightStr: '(min-height: 550px)', lights: 13},
  Medium: {heightStr: '(min-height: 700px)', lights: 15},
  Large: {heightStr: '(min-height: 850px)', lights: 19},
  XLarge: {heightStr: '(min-height: 1000px)', lights: 22}
};

export const BreakpointSizesArray = [
  BreakpointsWidthSizes.XSmall.widthStr,
  BreakpointsWidthSizes.Small.widthStr,
  BreakpointsWidthSizes.Medium.widthStr,
  BreakpointsWidthSizes.Large.widthStr,
  BreakpointsWidthSizes.XLarge.widthStr,
  BreakpointsWidthSizes.XXLarge.widthStr,
  BreakpointsHeightSizes.XSmall.heightStr,
  BreakpointsHeightSizes.Small.heightStr,
  BreakpointsHeightSizes.Medium.heightStr,
  BreakpointsHeightSizes.Large.heightStr,
  BreakpointsHeightSizes.XLarge.heightStr
];

export function numOfLightsForTopBottom(state: BreakpointState): number {
  let numOfLightsTopBottom: number;
  if (state.breakpoints[BreakpointsWidthSizes.XSmall.widthStr]) {
    numOfLightsTopBottom = BreakpointsWidthSizes.XSmall.lights;
  }
  if (state.breakpoints[BreakpointsWidthSizes.Small.widthStr]) {
    numOfLightsTopBottom = BreakpointsWidthSizes.Small.lights;
  }
  if (state.breakpoints[BreakpointsWidthSizes.Medium.widthStr]) {
    numOfLightsTopBottom = BreakpointsWidthSizes.Medium.lights;
  }
  if (state.breakpoints[BreakpointsWidthSizes.Large.widthStr]) {
    numOfLightsTopBottom = BreakpointsWidthSizes.Large.lights;
  }
  if (state.breakpoints[BreakpointsWidthSizes.XLarge.widthStr]) {
    numOfLightsTopBottom = BreakpointsWidthSizes.XLarge.lights;
  }
  if (state.breakpoints[BreakpointsWidthSizes.XXLarge.widthStr]) {
    numOfLightsTopBottom = BreakpointsWidthSizes.XXLarge.lights;
  }

  return numOfLightsTopBottom;
}

export function numOfLightsForSides(state: BreakpointState): number {
  let numOfLightsSides: number;

  if (state.breakpoints[BreakpointsHeightSizes.XSmall.heightStr]) {
    numOfLightsSides = BreakpointsHeightSizes.XSmall.lights;
  }
  if (state.breakpoints[BreakpointsHeightSizes.Small.heightStr]) {
    numOfLightsSides = BreakpointsHeightSizes.Small.lights;
  }
  if (state.breakpoints[BreakpointsHeightSizes.Medium.heightStr]) {
    numOfLightsSides = BreakpointsHeightSizes.Medium.lights;
  }
  if (state.breakpoints[BreakpointsHeightSizes.Large.heightStr]) {
    numOfLightsSides = BreakpointsHeightSizes.Large.lights;
  }
  if (state.breakpoints[BreakpointsHeightSizes.XLarge.heightStr]) {
    numOfLightsSides = BreakpointsHeightSizes.XLarge.lights;
  }

  return numOfLightsSides;
}
