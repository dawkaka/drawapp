import { AppState } from './types';

export const defaultValues: AppState = {
  strokeColor: '#000000',
  strokeWidth: 3,
  stroke: 'solid',
  tool: 'select',
  opacity: 1,
  fillColor: 'TRANSPARENT',
  imageBlob: '',
  multipleSelections: [],
  selectedItemID: '',
  borderRadius: 15,
  fontFamily: 'Kalam',
  fontSize: 25,
  textStyle: 'fill',
  textAlign: 'left',
  arrowStructure: 'curve',
  arrowHead: 'none',
  arrowTail: 'arrow',
  textBold: false,
  textItalic: false,
  textStrikethrough: false,
  textUnderline: false,
};

export enum Cursor {
  Auto = 'auto',
  Default = 'default',
  None = 'none',
  ContextMenu = 'context-menu',
  Help = 'help',
  Pointer = 'pointer',
  Progress = 'progress',
  Wait = 'wait',
  Cell = 'cell',
  Crosshair = 'crosshair',
  Text = 'text',
  VerticalText = 'vertical-text',
  Alias = 'alias',
  Copy = 'copy',
  Move = 'move',
  NoDrop = 'no-drop',
  NotAllowed = 'not-allowed',
  Grab = 'grab',
  Grabbing = 'grabbing',
  AllScroll = 'all-scroll',
  ColResize = 'col-resize',
  RowResize = 'row-resize',
  NResize = 'n-resize',
  EResize = 'e-resize',
  SResize = 's-resize',
  WResize = 'w-resize',
  NeResize = 'ne-resize',
  NwResize = 'nw-resize',
  SeResize = 'se-resize',
  SwResize = 'sw-resize',
  EwResize = 'ew-resize',
  NsResize = 'ns-resize',
  NeswResize = 'nesw-resize',
  NwseResize = 'nwse-resize',
}
