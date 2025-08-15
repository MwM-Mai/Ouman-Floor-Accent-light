import dpParser from './parsers';
import { lampSchemaMap } from '../schema';

const { music_data, dreamlightmic_music_data, dreamlight_scene_mode, colour_data, paint_colour_data, aux_colour, aux_scene } = lampSchemaMap;

export const protocols = {
  [colour_data.code]: dpParser.ColorDataTransformer,
  [music_data.code]: dpParser.MusicTransformer,
  [dreamlightmic_music_data.code]: dpParser.MicMusicTransformer,
  [dreamlight_scene_mode.code]: dpParser.SceneTransformer,
  [paint_colour_data.code]: dpParser.PaintColourDataTransformer,
  [aux_colour.code]: dpParser.AuxColourTranformer,
  [aux_scene.code]: dpParser.AuxSceneTransformer
};
