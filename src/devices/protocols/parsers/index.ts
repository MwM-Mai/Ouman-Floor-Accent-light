import { protocols } from '@ray-js/panel-sdk';

import ColorDataFormatter from './AuxColourFormatter';
import SceneFormatter from './SceneFormatter';
import MicMusicFormatter from "./MicMusicFormatter";
import PaintColourDataFormatter from './PaintColourDataFormatter'
import MusicFormatter from './MusicFormatter'
import FavFormater from './FavFormater'
import AuxColourFormatter from './AuxColourFormatter';
import AuxSceneFormatter from './AuxSceneFormatter';

export const MusicTransformer = new MusicFormatter();
export const ColorDataTransformer = new ColorDataFormatter();
export const MicMusicTransformer = new MicMusicFormatter();
export const SceneTransformer = new SceneFormatter();
export const PaintColourDataTransformer = new PaintColourDataFormatter();
export const FavTransformer = new FavFormater();
export const AuxColourTranformer = new AuxColourFormatter();
export const AuxSceneTransformer = new AuxSceneFormatter();

export default {
  MusicTransformer,
  ColorDataTransformer,
  MicMusicTransformer,
  SceneTransformer,
  PaintColourDataTransformer,
  FavTransformer,
  AuxColourTranformer,
  AuxSceneTransformer
};
