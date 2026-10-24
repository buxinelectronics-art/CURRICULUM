/* Block definitions, Python generators and toolbox for the clone. */
const PY = Blockly.Python;          // script build: Blockly.Python is the generator
const ORDER = window.python.Order;

/* ---------- theme (Scratch-like colours) ---------- */
function style(p, s, t) { return { colourPrimary: p, colourSecondary: s, colourTertiary: t }; }
const THEME = Blockly.Theme.defineTheme('scratchish', {
  base: Blockly.Themes.Classic,
  blockStyles: {
    motion: style('#4C97FF', '#4280D7', '#3373CC'),
    looks: style('#9966FF', '#855CD6', '#774DCB'),
    sound: style('#CF63CF', '#C94FC9', '#BD42BD'),
    events: style('#FFBF00', '#E6AC00', '#CC9900'),
    control: style('#FFAB19', '#EC9C13', '#CF8B17'),
    sensing: style('#5CB1D6', '#47A8D1', '#2E8EB8'),
    operators: style('#59C059', '#46B946', '#389438'),
    variables: style('#FF8C1A', '#FF8000', '#DB6E00'),
    myblocks: style('#FF6680', '#FF4D6A', '#FF3355'),
    pen: style('#0FBD8C', '#0DA57A', '#0B8E69'),
    tts: style('#9966FF', '#855CD6', '#774DCB'),
    translate: style('#5CB1D6', '#47A8D1', '#2E8EB8'),
    music: style('#CF63CF', '#C94FC9', '#BD42BD'),
    video: style('#5CB1D6', '#47A8D1', '#2E8EB8'),
    ai: style('#7A22E8', '#6518C4', '#5414A8'),
    hardware: style('#FF8C1A', '#FF8000', '#DB6E00'),
    board: style('#00979D', '#007E85', '#00666C'),
    math_blocks: style('#59C059', '#46B946', '#389438'),
    text_blocks: style('#59C059', '#46B946', '#389438'),
    variable_blocks: style('#FF8C1A', '#FF8000', '#DB6E00'),
    variable_dynamic_blocks: style('#FF8C1A', '#FF8000', '#DB6E00'),
    procedure_blocks: style('#FF6680', '#FF4D6A', '#FF3355'),
  },
  categoryStyles: {},
  componentStyles: {
    workspaceBackgroundColour: '#F9F9F9',
    toolboxBackgroundColour: '#FFFFFF',
    flyoutBackgroundColour: '#F9F9F9',
    flyoutOpacity: 1,
    scrollbarColour: '#CECDCE',
    insertionMarkerColour: '#000000',
    insertionMarkerOpacity: 0.2,
  },
  fontStyle: { family: 'Helvetica Neue, Helvetica, Arial, sans-serif', weight: '600', size: 11 },
});

/* ---------- small helpers ---------- */
const svg = (s) => 'data:image/svg+xml;utf8,' + encodeURIComponent(s);
const ICON_FLAG = svg('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M5 3v18" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><path d="M5 4c4-2 7 2 12 0v9c-5 2-8-2-12 0z" fill="#4CBF56" stroke="#2E8B3A" stroke-width="1.5"/></svg>');
const ICON_CW = svg('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M19 12a7 7 0 1 1-2.5-5.3" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M13 3.5l5 1.2-1.6 4.9z" fill="#fff"/></svg>');
const ICON_CCW = svg('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M5 12a7 7 0 1 0 2.5-5.3" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M11 3.5L6 4.7l1.6 4.9z" fill="#fff"/></svg>');

const KEYS = [['space', 'space'], ['up arrow', 'up'], ['down arrow', 'down'], ['right arrow', 'right'], ['left arrow', 'left'], ['any', 'any']]
  .concat('abcdefghijklmnopqrstuvwxyz'.split('').map((c) => [c, c]))
  .concat('0123456789'.split('').map((c) => [c, c]));

const defs = [];
function def(type, style_, message, extra) {
  const b = Object.assign({ type, style: style_, message0: message }, extra || {});
  defs.push(b);
}
const stack = { previousStatement: null, nextStatement: null };
const reporter = { output: null };
const bool = { output: 'Boolean' };
const num = (name) => ({ type: 'input_value', name, check: null });

/* ---------- Motion ---------- */
def('motion_movesteps', 'motion', 'move %1 steps', Object.assign({ args0: [num('STEPS')] }, stack));
def('motion_turnright', 'motion', 'turn %1 %2 degrees', Object.assign({ args0: [{ type: 'field_image', src: ICON_CW, width: 18, height: 18 }, num('DEGREES')] }, stack));
def('motion_turnleft', 'motion', 'turn %1 %2 degrees', Object.assign({ args0: [{ type: 'field_image', src: ICON_CCW, width: 18, height: 18 }, num('DEGREES')] }, stack));
def('motion_goto', 'motion', 'go to %1', Object.assign({ args0: [{ type: 'field_dropdown', name: 'TO', options: [['random position', 'random'], ['mouse-pointer', 'mouse'], ['Sprite1', 'sprite']] }] }, stack));
def('motion_gotoxy', 'motion', 'go to x: %1 y: %2', Object.assign({ args0: [num('X'), num('Y')] }, stack));
def('motion_glideto', 'motion', 'glide %1 secs to %2', Object.assign({ args0: [num('SECS'), { type: 'field_dropdown', name: 'TO', options: [['random position', 'random'], ['mouse-pointer', 'mouse'], ['Sprite1', 'sprite']] }] }, stack));
def('motion_glidexy', 'motion', 'glide %1 secs to x: %2 y: %3', Object.assign({ args0: [num('SECS'), num('X'), num('Y')] }, stack));
def('motion_pointindirection', 'motion', 'point in direction %1', Object.assign({ args0: [num('DIR')] }, stack));
def('motion_pointtowards', 'motion', 'point towards %1', Object.assign({ args0: [{ type: 'field_dropdown', name: 'TO', options: [['mouse-pointer', 'mouse'], ['Sprite1', 'sprite'], ['random position', 'random']] }] }, stack));
def('motion_changexby', 'motion', 'change x by %1', Object.assign({ args0: [num('DX')] }, stack));
def('motion_setx', 'motion', 'set x to %1', Object.assign({ args0: [num('X')] }, stack));
def('motion_changeyby', 'motion', 'change y by %1', Object.assign({ args0: [num('DY')] }, stack));
def('motion_sety', 'motion', 'set y to %1', Object.assign({ args0: [num('Y')] }, stack));
def('motion_ifonedgebounce', 'motion', 'if on edge, bounce', stack);
def('motion_xposition', 'motion', 'x position', reporter);
def('motion_yposition', 'motion', 'y position', reporter);
def('motion_direction', 'motion', 'direction', reporter);
def('motion_setrotationstyle', 'motion', 'set rotation style %1', Object.assign({ args0: [{ type: 'field_dropdown', name: 'STYLE', options: [['left-right', 'left-right'], ["don't rotate", "don't rotate"], ['all around', 'all around']] }] }, stack));

/* ---------- Looks ---------- */
def('looks_sayforsecs', 'looks', 'say %1 for %2 seconds', Object.assign({ args0: [num('MSG'), num('SECS')] }, stack));
def('looks_say', 'looks', 'say %1', Object.assign({ args0: [num('MSG')] }, stack));
def('looks_thinkforsecs', 'looks', 'think %1 for %2 seconds', Object.assign({ args0: [num('MSG'), num('SECS')] }, stack));
def('looks_think', 'looks', 'think %1', Object.assign({ args0: [num('MSG')] }, stack));
def('looks_switchcostumeto', 'looks', 'switch costume to %1', Object.assign({ args0: [{ type: 'field_art', name: 'COSTUME', art: 'costume' }] }, stack));
def('looks_nextcostume', 'looks', 'next costume', stack);
def('looks_changesizeby', 'looks', 'change size by %1', Object.assign({ args0: [num('CHANGE')] }, stack));
def('looks_setsizeto', 'looks', 'set size to %1 %%', Object.assign({ args0: [num('SIZE')] }, stack));
def('looks_show', 'looks', 'show', stack);
def('looks_hide', 'looks', 'hide', stack);
def('looks_costumenumber', 'looks', 'costume number', reporter);
def('looks_costumename', 'looks', 'costume name', reporter);
def('looks_size', 'looks', 'size', reporter);
const EFFECTS = [['color', 'color'], ['fisheye', 'fisheye'], ['whirl', 'whirl'], ['pixelate', 'pixelate'], ['mosaic', 'mosaic'], ['brightness', 'brightness'], ['ghost', 'ghost']];
def('looks_switchbackdropto', 'looks', 'switch backdrop to %1', Object.assign({ args0: [{ type: 'field_art', name: 'BACKDROP', art: 'backdrop' }] }, stack));
def('looks_nextbackdrop', 'looks', 'next backdrop', stack);
def('looks_switchbackdropandwait', 'looks', 'switch backdrop to %1 and wait', Object.assign({ args0: [{ type: 'field_art', name: 'BACKDROP', art: 'backdrop-only' }] }, stack));
def('looks_changeeffectby', 'looks', 'change %1 effect by %2', Object.assign({ args0: [{ type: 'field_dropdown', name: 'EFFECT', options: EFFECTS }, num('CHANGE')] }, stack));
def('looks_seteffectto', 'looks', 'set %1 effect to %2', Object.assign({ args0: [{ type: 'field_dropdown', name: 'EFFECT', options: EFFECTS }, num('VALUE')] }, stack));
def('looks_cleargraphiceffects', 'looks', 'clear graphic effects', stack);
def('looks_gotofrontback', 'looks', 'go to %1 layer', Object.assign({ args0: [{ type: 'field_dropdown', name: 'FRONT', options: [['front', 'front'], ['back', 'back']] }] }, stack));
def('looks_goforwardbackwardlayers', 'looks', 'go %1 %2 layers', Object.assign({ args0: [{ type: 'field_dropdown', name: 'FORWARD', options: [['forward', 'forward'], ['backward', 'backward']] }, num('NUM')] }, stack));
def('looks_backdrop', 'looks', 'backdrop %1', { args0: [{ type: 'field_dropdown', name: 'NUMBER', options: [['number', 'number'], ['name', 'name']] }], output: null });
def('looks_snapshot', 'looks', 'take stage snapshot', stack);

/* ---------- Sound ---------- */
def('sound_playuntildone', 'sound', 'play sound %1 until done', Object.assign({ args0: [{ type: 'field_dropdown', name: 'SOUND', options: [['Meow', 'Meow'], ['Pop', 'Pop']] }] }, stack));
def('sound_play', 'sound', 'start sound %1', Object.assign({ args0: [{ type: 'field_dropdown', name: 'SOUND', options: [['Meow', 'Meow'], ['Pop', 'Pop']] }] }, stack));
def('sound_stopall', 'sound', 'stop all sounds', stack);
def('sound_setvolume', 'sound', 'set volume to %1 %%', Object.assign({ args0: [num('VOL')] }, stack));
const SOUNDFX = [['pitch', 'pitch'], ['pan left/right', 'pan']];
def('sound_changeeffectby', 'sound', 'change %1 effect by %2', Object.assign({ args0: [{ type: 'field_dropdown', name: 'EFFECT', options: SOUNDFX }, num('VALUE')] }, stack));
def('sound_seteffectto', 'sound', 'set %1 effect to %2', Object.assign({ args0: [{ type: 'field_dropdown', name: 'EFFECT', options: SOUNDFX }, num('VALUE')] }, stack));
def('sound_cleareffects', 'sound', 'clear sound effects', stack);
def('sound_changevolumeby', 'sound', 'change volume by %1', Object.assign({ args0: [num('VOLUME')] }, stack));
def('sound_volume', 'sound', 'volume', reporter);

/* ---------- Events (hats) ---------- */
def('event_whenflagclicked', 'events', 'when %1 clicked', { args0: [{ type: 'field_image', src: ICON_FLAG, width: 20, height: 20 }], nextStatement: null, hat: 'cap' });
def('event_whenkeypressed', 'events', 'when %1 key pressed', { args0: [{ type: 'field_dropdown', name: 'KEY', options: KEYS }], nextStatement: null, hat: 'cap' });
def('event_whenthisspriteclicked', 'events', 'when this sprite clicked', { nextStatement: null, hat: 'cap' });
def('event_whenbroadcastreceived', 'events', 'when I receive %1', { args0: [{ type: 'field_input', name: 'MSG', text: 'message1' }], nextStatement: null, hat: 'cap' });
def('event_broadcast', 'events', 'broadcast %1', Object.assign({ args0: [{ type: 'field_input', name: 'MSG', text: 'message1' }] }, stack));
def('event_broadcastandwait', 'events', 'broadcast %1 and wait', Object.assign({ args0: [{ type: 'field_input', name: 'MSG', text: 'message1' }] }, stack));
def('event_whenbackdropswitches', 'events', 'when backdrop switches to %1', { args0: [{ type: 'field_art', name: 'BACKDROP', art: 'backdrop-only' }], nextStatement: null, hat: 'cap' });
def('event_whengreaterthan', 'events', 'when %1 > %2', { args0: [{ type: 'field_dropdown', name: 'SENSOR', options: [['loudness', 'loudness'], ['timer', 'timer']] }, num('VALUE')], nextStatement: null, hat: 'cap' });

/* ---------- Control ---------- */
def('control_wait', 'control', 'wait %1 seconds', Object.assign({ args0: [num('SECS')] }, stack));
def('control_repeat', 'control', 'repeat %1 %2 %3', Object.assign({ args0: [num('TIMES'), { type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }] }, stack));
def('control_forever', 'control', 'forever %1 %2', { args0: [{ type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }], previousStatement: null });
def('control_if', 'control', 'if %1 then %2 %3', Object.assign({ args0: [{ type: 'input_value', name: 'COND', check: 'Boolean' }, { type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }] }, stack));
def('control_ifelse', 'control', 'if %1 then %2 %3 else %4 %5', Object.assign({ args0: [{ type: 'input_value', name: 'COND', check: 'Boolean' }, { type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }, { type: 'input_dummy' }, { type: 'input_statement', name: 'ELSE' }] }, stack));
def('control_waituntil', 'control', 'wait until %1', Object.assign({ args0: [{ type: 'input_value', name: 'COND', check: 'Boolean' }] }, stack));
def('control_repeatuntil', 'control', 'repeat until %1 %2 %3', Object.assign({ args0: [{ type: 'input_value', name: 'COND', check: 'Boolean' }, { type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }] }, stack));
def('control_stopall', 'control', 'stop all', { previousStatement: null });
def('control_stop', 'control', 'stop %1', { args0: [{ type: 'field_dropdown', name: 'STOP', options: [['all', 'all'], ['this script', 'this'], ['other scripts in sprite', 'other']] }], previousStatement: null });
def('control_startasclone', 'control', 'when I start as a clone', { nextStatement: null, hat: 'cap' });
def('control_createclone', 'control', 'create clone of %1', Object.assign({ args0: [{ type: 'field_dropdown', name: 'CLONE', options: [['myself', 'myself']] }] }, stack));
def('control_deleteclone', 'control', 'delete this clone', { previousStatement: null });

/* ---------- Sensing ---------- */
def('sensing_touchingmouse', 'sensing', 'touching mouse-pointer?', bool);
def('sensing_keypressed', 'sensing', 'key %1 pressed?', { args0: [{ type: 'field_dropdown', name: 'KEY', options: KEYS }], output: 'Boolean' });
def('sensing_mousedown', 'sensing', 'mouse down?', bool);
def('sensing_mousex', 'sensing', 'mouse x', reporter);
def('sensing_mousey', 'sensing', 'mouse y', reporter);
def('sensing_timer', 'sensing', 'timer', reporter);
def('sensing_resettimer', 'sensing', 'reset timer', stack);
const COLORS = [['red', 'red'], ['orange', 'orange'], ['yellow', 'yellow'], ['green', 'green'], ['blue', 'blue'], ['purple', 'purple'], ['black', 'black'], ['white', 'white']];
def('sensing_touching', 'sensing', 'touching %1?', { args0: [{ type: 'field_dropdown', name: 'TOUCHING', options: [['mouse-pointer', 'mouse'], ['edge', 'edge'], ['Sprite1', 'sprite']] }], output: 'Boolean' });
def('sensing_touchingcolor', 'sensing', 'touching color %1?', { args0: [{ type: 'field_dropdown', name: 'COLOR', options: COLORS }], output: 'Boolean' });
def('sensing_coloristouchingcolor', 'sensing', 'color %1 is touching %2?', { args0: [{ type: 'field_dropdown', name: 'COLOR', options: COLORS }, { type: 'field_dropdown', name: 'COLOR2', options: COLORS }], output: 'Boolean' });
def('sensing_distanceto', 'sensing', 'distance to %1', { args0: [{ type: 'field_dropdown', name: 'DISTANCETARGET', options: [['mouse-pointer', 'mouse'], ['Sprite1', 'sprite']] }], output: null });
def('sensing_askandwait', 'sensing', 'ask %1 and wait', Object.assign({ args0: [num('QUESTION')] }, stack));
def('sensing_answer', 'sensing', 'answer', reporter);
def('sensing_setdragmode', 'sensing', 'set drag mode %1', Object.assign({ args0: [{ type: 'field_dropdown', name: 'DRAG', options: [['draggable', 'draggable'], ['not draggable', 'not draggable']] }] }, stack));
def('sensing_loudness', 'sensing', 'loudness', reporter);
def('sensing_of', 'sensing', '%1 of %2', { args0: [{ type: 'field_dropdown', name: 'PROPERTY', options: [['x position', 'x position'], ['y position', 'y position'], ['direction', 'direction'], ['costume #', 'costume #'], ['costume name', 'costume name'], ['size', 'size'], ['volume', 'volume'], ['backdrop #', 'backdrop #'], ['backdrop name', 'backdrop name']] }, { type: 'field_dropdown', name: 'OBJECT', options: [['Sprite1', 'Sprite1'], ['Stage', 'Stage']] }], output: null });
def('sensing_current', 'sensing', 'current %1', { args0: [{ type: 'field_dropdown', name: 'CURRENT', options: [['year', 'year'], ['month', 'month'], ['date', 'date'], ['day of week', 'day of week'], ['hour', 'hour'], ['minute', 'minute'], ['second', 'second']] }], output: null });
def('sensing_dayssince2000', 'sensing', 'days since 2000', reporter);
def('sensing_username', 'sensing', 'username', reporter);

/* ---------- Operators ---------- */
const bin = (t, sym) => def(t, 'operators', '%1 ' + sym + ' %2', { args0: [num('A'), num('B')], output: null, inputsInline: true });
bin('operator_add', '+'); bin('operator_subtract', '-'); bin('operator_multiply', '*'); bin('operator_divide', '/');
def('operator_random', 'operators', 'pick random %1 to %2', { args0: [num('A'), num('B')], output: null, inputsInline: true });
const cmp = (t, sym) => def(t, 'operators', '%1 ' + sym + ' %2', { args0: [num('A'), num('B')], output: 'Boolean', inputsInline: true });
cmp('operator_gt', '>'); cmp('operator_lt', '<'); cmp('operator_equals', '=');
def('operator_and', 'operators', '%1 and %2', { args0: [{ type: 'input_value', name: 'A', check: 'Boolean' }, { type: 'input_value', name: 'B', check: 'Boolean' }], output: 'Boolean', inputsInline: true });
def('operator_or', 'operators', '%1 or %2', { args0: [{ type: 'input_value', name: 'A', check: 'Boolean' }, { type: 'input_value', name: 'B', check: 'Boolean' }], output: 'Boolean', inputsInline: true });
def('operator_not', 'operators', 'not %1', { args0: [{ type: 'input_value', name: 'A', check: 'Boolean' }], output: 'Boolean', inputsInline: true });
def('operator_join', 'operators', 'join %1 %2', { args0: [num('A'), num('B')], output: null, inputsInline: true });
def('operator_mod', 'operators', '%1 mod %2', { args0: [num('A'), num('B')], output: null, inputsInline: true });
def('operator_round', 'operators', 'round %1', { args0: [num('A')], output: null, inputsInline: true });
def('operator_letterof', 'operators', 'letter %1 of %2', { args0: [num('LETTER'), num('TEXT')], output: null, inputsInline: true });
def('operator_length', 'operators', 'length of %1', { args0: [num('TEXT')], output: null, inputsInline: true });
def('operator_contains', 'operators', '%1 contains %2?', { args0: [num('TEXT'), num('PART')], output: 'Boolean', inputsInline: true });
const MATHOPS = [['abs', 'abs'], ['floor', 'floor'], ['ceiling', 'ceiling'], ['sqrt', 'sqrt'], ['sin', 'sin'], ['cos', 'cos'], ['tan', 'tan'], ['asin', 'asin'], ['acos', 'acos'], ['atan', 'atan'], ['ln', 'ln'], ['log', 'log'], ['e ^', 'e ^'], ['10 ^', '10 ^']];
def('operator_mathop', 'operators', '%1 of %2', { args0: [{ type: 'field_dropdown', name: 'OP', options: MATHOPS }, num('NUM')], output: null, inputsInline: true });

/* ---------- Pen ---------- */
const PEN = 'pen';
const PENPARAM = [['color', 'color'], ['saturation', 'saturation'], ['brightness', 'brightness'], ['transparency', 'transparency']];
def('pen_clear', PEN, 'erase all', stack);
def('pen_stamp', PEN, 'stamp', stack);
def('pen_penDown', PEN, 'pen down', stack);
def('pen_penUp', PEN, 'pen up', stack);
def('pen_setPenColor', PEN, 'set pen color to %1', Object.assign({ args0: [{ type: 'field_dropdown', name: 'COLOR', options: COLORS }] }, stack));
def('pen_changePenColorParamBy', PEN, 'change pen %1 by %2', Object.assign({ args0: [{ type: 'field_dropdown', name: 'PARAM', options: PENPARAM }, num('VALUE')] }, stack));
def('pen_setPenColorParamTo', PEN, 'set pen %1 to %2', Object.assign({ args0: [{ type: 'field_dropdown', name: 'PARAM', options: PENPARAM }, num('VALUE')] }, stack));
def('pen_changePenSizeBy', PEN, 'change pen size by %1', Object.assign({ args0: [num('SIZE')] }, stack));
def('pen_setPenSizeTo', PEN, 'set pen size to %1', Object.assign({ args0: [num('SIZE')] }, stack));

/* ---------- lists and variable monitors ---------- */
const listField = () => ({ type: 'field_variable', name: 'LIST', variable: 'my list', variableTypes: ['list'], defaultType: 'list' });
def('data_showvariable', 'variables', 'show variable %1', Object.assign({ args0: [{ type: 'field_variable', name: 'VAR', variable: 'my variable' }] }, stack));
def('data_hidevariable', 'variables', 'hide variable %1', Object.assign({ args0: [{ type: 'field_variable', name: 'VAR', variable: 'my variable' }] }, stack));
def('data_listcontents', 'variables', '%1', Object.assign({ args0: [listField()] }, reporter));
def('data_addtolist', 'variables', 'add %1 to %2', Object.assign({ args0: [num('ITEM'), listField()] }, stack));
def('data_deleteoflist', 'variables', 'delete %1 of %2', Object.assign({ args0: [num('INDEX'), listField()] }, stack));
def('data_deletealloflist', 'variables', 'delete all of %1', Object.assign({ args0: [listField()] }, stack));
def('data_insertatlist', 'variables', 'insert %1 at %2 of %3', Object.assign({ args0: [num('ITEM'), num('INDEX'), listField()] }, stack));
def('data_replaceitemoflist', 'variables', 'replace item %1 of %2 with %3', Object.assign({ args0: [num('INDEX'), listField(), num('ITEM')] }, stack));
def('data_itemoflist', 'variables', 'item %1 of %2', Object.assign({ args0: [num('INDEX'), listField()] }, reporter));
def('data_itemnumoflist', 'variables', 'item # of %1 in %2', Object.assign({ args0: [num('ITEM'), listField()] }, reporter));
def('data_lengthoflist', 'variables', 'length of %1', Object.assign({ args0: [listField()] }, reporter));
def('data_listcontainsitem', 'variables', '%1 contains %2?', Object.assign({ args0: [listField(), num('ITEM')] }, bool));
def('data_showlist', 'variables', 'show list %1', Object.assign({ args0: [listField()] }, stack));
def('data_hidelist', 'variables', 'hide list %1', Object.assign({ args0: [listField()] }, stack));

/* ---------- extension placeholders and the few that can run locally ---------- */
def('tts_speak', 'tts', 'speak %1', Object.assign({ args0: [num('WORDS')] }, stack));
const TRANSLATE_LANGS = [['English', 'en'], ['Spanish', 'es'], ['French', 'fr'], ['Hindi', 'hi'], ['German', 'de'], ['Italian', 'it'], ['Portuguese', 'pt'], ['Chinese', 'zh-CN'], ['Japanese', 'ja'], ['Korean', 'ko'], ['Arabic', 'ar'], ['Russian', 'ru'], ['Bengali', 'bn'], ['Tamil', 'ta'], ['Telugu', 'te'], ['Urdu', 'ur'], ['Dutch', 'nl'], ['Turkish', 'tr'], ['Indonesian', 'id'], ['Vietnamese', 'vi']];
def('translate_getTranslate', 'translate', 'translate %1 to %2', { args0: [num('WORDS'), { type: 'field_dropdown', name: 'LANGUAGE', options: TRANSLATE_LANGS }], output: null, inputsInline: true });
const mediaField = (kind) => ({ type: 'field_media', name: 'TRACK', media: kind });
def('music_upload', 'music', 'upload music', stack);
def('music_playfile', 'music', 'play music %1', Object.assign({ args0: [mediaField('music')] }, stack));
def('music_playfilewait', 'music', 'play music %1 until done', Object.assign({ args0: [mediaField('music')] }, stack));
def('music_stopfile', 'music', 'stop music', stack);
def('music_playNote', 'music', 'play note %1 for %2 beats', Object.assign({ args0: [num('NOTE'), num('BEATS')] }, stack));
def('music_playDrum', 'music', 'play drum %1 for %2 beats', Object.assign({ args0: [{ type: 'field_dropdown', name: 'DRUM', options: [['(1) Snare', '1'], ['(2) Bass', '2'], ['(3) Side Stick', '3']] }, num('BEATS')] }, stack));
def('music_setInstrument', 'music', 'set instrument to %1', Object.assign({ args0: [{ type: 'field_dropdown', name: 'INSTRUMENT', options: [['(1) Piano', '1'], ['(2) Electric Piano', '2'], ['(13) Marimba', '13']] }] }, stack));
def('music_setTempo', 'music', 'set tempo to %1', Object.assign({ args0: [num('TEMPO')] }, stack));
def('music_changeTempo', 'music', 'change tempo by %1', Object.assign({ args0: [num('TEMPO')] }, stack));
def('video_upload', 'video', 'upload video', stack);
def('video_playfile', 'video', 'play video %1', Object.assign({ args0: [mediaField('video')] }, stack));
def('video_playfilewait', 'video', 'play video %1 until done', Object.assign({ args0: [mediaField('video')] }, stack));
def('video_stopfile', 'video', 'stop video', stack);
def('video_motion', 'video', 'video %1 on %2', { args0: [{ type: 'field_dropdown', name: 'ATTRIBUTE', options: [['motion', 'motion'], ['direction', 'direction']] }, { type: 'field_dropdown', name: 'SUBJECT', options: [['sprite', 'this sprite'], ['stage', 'stage']] }], output: null });
def('video_toggle', 'video', 'turn video %1', Object.assign({ args0: [{ type: 'field_dropdown', name: 'VIDEO_STATE', options: [['on', 'on'], ['off', 'off'], ['on flipped', 'on-flipped']] }] }, stack));
def('video_transparency', 'video', 'set video transparency to %1%', Object.assign({ args0: [num('TRANSPARENCY')] }, stack));
const ai = (type, label, out) => def(type, 'ai', label, out ? reporter : stack);
ai('ai_face', 'face detection', false);
ai('ai_body', 'human body detection', false);
ai('ai_classifier', 'image classifier', true);
ai('ai_object', 'object detection', false);
const YOLO_OBJECTS = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'];
const OBJECT_MENU = [['any object', 'any']].concat(YOLO_OBJECTS.map((name) => [name, name]));
def('ai_object_pick', 'ai', 'detect %1', Object.assign({ args0: [{ type: 'field_dropdown', name: 'OBJECT', options: OBJECT_MENU }] }, stack));
def('ai_object_which', 'ai', '%1 detected?', Object.assign({ args0: [{ type: 'field_dropdown', name: 'OBJECT', options: OBJECT_MENU }] }, bool));
def('ai_face_seen', 'ai', 'face detected?', bool);
ai('ai_mesh', 'face mesh', false);
ai('ai_face_expr', 'facial analysis', false);
def('ai_expression', 'ai', 'facial expression', reporter);
ai('ai_hand', 'hand detection', false);
def('ai_hand_seen', 'ai', 'hand detected?', bool);
ai('ai_gesture', 'gesture', false);
def('ai_gesture_name', 'ai', 'gesture name', reporter);
ai('ai_pose', 'body skeleton', false);
def('ai_pose_seen', 'ai', 'pose detected?', bool);
ai('ai_selfie', 'selfie segmentation', false);
def('ai_body_seen', 'ai', 'person detected?', bool);
def('ai_object_seen', 'ai', 'object detected?', bool);
ai('ai_ocr', 'read text from camera', true);
ai('ai_speech', 'listen and write spoken words', true);
def('ai_nlp', 'ai', 'analyse text %1', Object.assign({ args0: [num('TEXT')] }, reporter));
ai('ai_ml', 'machine learning result', true);
ai('ai_neural', 'neural network result', true);
def('hw_quarky', 'hardware', 'Quarky: move and set lights', stack);
def('hw_digital', 'hardware', 'Arduino set digital pin %1 to %2', Object.assign({ args0: [num('PIN'), num('VALUE')] }, stack));
def('hw_analog', 'hardware', 'Arduino read analog pin %1', { args0: [num('PIN')], output: null });
def('hw_servo', 'hardware', 'Arduino set servo pin %1 to %2', Object.assign({ args0: [num('PIN'), num('ANGLE')] }, stack));
def('hw_esp32', 'hardware', 'ESP32 pin and Wi-Fi', stack);
def('hw_microbit', 'hardware', 'micro:bit pins and sensors', stack);
def('hw_pi', 'hardware', 'Raspberry Pi pins', stack);
def('hw_evive', 'hardware', 'Evive board control', stack);
def('hw_tecbits', 'hardware', 'Tecbits board control', stack);
def('hw_rover', 'hardware', 'Rover board control', stack);

window.mediaLibrary = window.mediaLibrary || { music: [], video: [] };
window.artCostumes = window.artCostumes || [['Sprite1', '1'], ['Snake', '2'], ['Ball', '3'], ['Rocket', '4'], ['Car', '5'], ['Fish', '6']];
window.artBackdrops = window.artBackdrops || [['backdrop1', 'backdrop1'], ['Meadow', 'Meadow'], ['Court', 'Court'], ['Space', 'Space'], ['Road', 'Road'], ['Ocean', 'Ocean']];

function artMenu(kind) {
  if (kind === 'costume') return window.artCostumes.length ? window.artCostumes : [['Sprite1', '1']];
  const rows = window.artBackdrops.length ? window.artBackdrops.slice() : [['backdrop1', 'backdrop1']];
  if (kind === 'backdrop') rows.push(['next backdrop', 'next'], ['previous backdrop', 'previous']);
  return rows;
}

class FieldArt extends Blockly.FieldDropdown {
  constructor(kind) {
    const artKind = kind || 'costume';
    super(function () { return artMenu(artKind); });
    this.artKind = artKind;
  }

  static fromJson(options) {
    return new FieldArt(options.art || 'costume');
  }
}
Blockly.fieldRegistry.register('field_art', FieldArt);

class FieldMedia extends Blockly.FieldDropdown {
  constructor(kind) {
    const mediaKind = kind || 'music';
    super(function () {
      const rows = (window.mediaLibrary && window.mediaLibrary[mediaKind]) || [];
      if (!rows.length) return [['(none)', '']];
      return rows.map((row) => [String(row.name), String(row.id)]);
    });
    this.mediaKind = mediaKind;
  }

  static fromJson(options) {
    return new FieldMedia(options.media || 'music');
  }

  showEditor_() {
    const drop = Blockly.DropDownDiv;
    drop.clearContent();
    const box = document.createElement('div');
    box.className = 'media-menu';
    const rows = (window.mediaLibrary && window.mediaLibrary[this.mediaKind]) || [];
    if (!rows.length) {
      const empty = document.createElement('div');
      empty.className = 'media-empty';
      empty.textContent = 'Nothing uploaded yet';
      box.appendChild(empty);
    }
    rows.forEach((row) => {
      const line = document.createElement('div');
      line.className = 'media-row';
      const pick = document.createElement('button');
      pick.type = 'button';
      pick.className = 'media-pick' + (row.id === this.getValue() ? ' is-on' : '');
      pick.textContent = row.name;
      pick.addEventListener('mousedown', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setValue(row.id);
        drop.hideIfOwner(this);
      });
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'media-del';
      del.textContent = 'Delete';
      del.addEventListener('mousedown', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const host = window.bridge;
        if (host && host.deleteMedia) host.deleteMedia(this.mediaKind, row.id);
      });
      line.appendChild(pick);
      line.appendChild(del);
      box.appendChild(line);
    });
    drop.getContentDiv().appendChild(box);
    drop.showPositionedByField(this, () => {});
  }
}
Blockly.fieldRegistry.register('field_media', FieldMedia);

Blockly.common.defineBlocksWithJsonArray(defs);

/* ---------- Python generators ---------- */
const v = (b, n, order) => PY.valueToCode(b, n, order || ORDER.NONE) || '0';
const body = (b, n) => PY.statementToCode(b, n) || PY.INDENT + 'pass\n';
const F = PY.forBlock;
const stmt = (fn) => (b) => fn(b) + '\n';
const simple = (type, call) => { F[type] = (b) => 'sprite.' + call(b) + '\n'; };

simple('motion_movesteps', (b) => `move(${v(b, 'STEPS')})`);
simple('motion_turnright', (b) => `turn_right(${v(b, 'DEGREES')})`);
simple('motion_turnleft', (b) => `turn_left(${v(b, 'DEGREES')})`);
simple('motion_goto', (b) => `goto_target('${b.getFieldValue('TO')}')`);
simple('motion_gotoxy', (b) => `goto_xy(${v(b, 'X')}, ${v(b, 'Y')})`);
simple('motion_glideto', (b) => `glide_to(${v(b, 'SECS')}, '${b.getFieldValue('TO')}')`);
simple('motion_glidexy', (b) => `glide_xy(${v(b, 'SECS')}, ${v(b, 'X')}, ${v(b, 'Y')})`);
simple('motion_pointindirection', (b) => `point(${v(b, 'DIR')})`);
simple('motion_pointtowards', (b) => `point_towards('${b.getFieldValue('TO')}')`);
simple('motion_changexby', (b) => `change_x(${v(b, 'DX')})`);
simple('motion_setx', (b) => `set_x(${v(b, 'X')})`);
simple('motion_changeyby', (b) => `change_y(${v(b, 'DY')})`);
simple('motion_sety', (b) => `set_y(${v(b, 'Y')})`);
simple('motion_ifonedgebounce', () => 'bounce_on_edge()');
simple('motion_setrotationstyle', (b) => `set_rotation_style(${JSON.stringify(b.getFieldValue('STYLE'))})`);
simple('looks_sayforsecs', (b) => `say(${v(b, 'MSG')}, ${v(b, 'SECS')})`);
simple('looks_say', (b) => `say(${v(b, 'MSG')})`);
simple('looks_thinkforsecs', (b) => `think(${v(b, 'MSG')}, ${v(b, 'SECS')})`);
simple('looks_think', (b) => `think(${v(b, 'MSG')})`);
simple('looks_switchcostumeto', (b) => `switch_costume(${b.getFieldValue('COSTUME')})`);
simple('looks_nextcostume', () => 'next_costume()');
simple('looks_changesizeby', (b) => `change_size(${v(b, 'CHANGE')})`);
simple('looks_setsizeto', (b) => `set_size(${v(b, 'SIZE')})`);
simple('looks_show', () => 'show()');
simple('looks_hide', () => 'hide()');
simple('looks_switchbackdropto', (b) => `switch_backdrop(${JSON.stringify(b.getFieldValue('BACKDROP'))})`);
simple('looks_nextbackdrop', () => 'next_backdrop()');
simple('looks_switchbackdropandwait', (b) => `switch_backdrop(${JSON.stringify(b.getFieldValue('BACKDROP'))}, True)`);
simple('looks_changeeffectby', (b) => `change_effect(${JSON.stringify(b.getFieldValue('EFFECT'))}, ${v(b, 'CHANGE')})`);
simple('looks_seteffectto', (b) => `set_effect(${JSON.stringify(b.getFieldValue('EFFECT'))}, ${v(b, 'VALUE')})`);
simple('looks_cleargraphiceffects', () => 'clear_effects()');
simple('looks_gotofrontback', (b) => `go_layer(${JSON.stringify(b.getFieldValue('FRONT'))})`);
simple('looks_goforwardbackwardlayers', (b) => `change_layer(${JSON.stringify(b.getFieldValue('FORWARD'))}, ${v(b, 'NUM')})`);
simple('looks_snapshot', () => 'take_snapshot()');
simple('sound_playuntildone', (b) => `play_sound('${b.getFieldValue('SOUND')}', True)`);
simple('sound_play', (b) => `play_sound('${b.getFieldValue('SOUND')}')`);
simple('sound_stopall', () => 'stop_sounds()');
simple('sound_setvolume', (b) => `set_volume(${v(b, 'VOL')})`);
simple('sound_changeeffectby', (b) => `change_sound_effect(${JSON.stringify(b.getFieldValue('EFFECT'))}, ${v(b, 'VALUE')})`);
simple('sound_seteffectto', (b) => `set_sound_effect(${JSON.stringify(b.getFieldValue('EFFECT'))}, ${v(b, 'VALUE')})`);
simple('sound_cleareffects', () => 'clear_sound_effects()');
simple('sound_changevolumeby', (b) => `change_volume(${v(b, 'VOLUME')})`);
simple('event_broadcast', (b) => `broadcast(${JSON.stringify(b.getFieldValue('MSG'))})`);
simple('event_broadcastandwait', (b) => `broadcast_wait(${JSON.stringify(b.getFieldValue('MSG'))})`);
simple('control_wait', (b) => `wait(${v(b, 'SECS')})`);
simple('control_waituntil', (b) => `wait_until(lambda: ${v(b, 'COND')})`);
simple('control_stopall', () => 'stop_all()');
F['control_stop'] = (b) => ({ all: 'sprite.stop_all()\n', this: 'stop_this()\n', other: 'stop_other()\n' }[b.getFieldValue('STOP')] || 'sprite.stop_all()\n');
simple('control_createclone', () => 'create_clone("myself")');
simple('control_deleteclone', () => 'delete_clone()');
simple('sensing_resettimer', () => 'reset_timer()');
simple('sensing_askandwait', (b) => `ask(${v(b, 'QUESTION')})`);
simple('sensing_setdragmode', (b) => `set_drag_mode(${JSON.stringify(b.getFieldValue('DRAG'))})`);

const rep = (type, call) => { F[type] = (b) => [call(b), ORDER.ATOMIC]; };
rep('motion_xposition', () => 'sprite.x');
rep('motion_yposition', () => 'sprite.y');
rep('motion_direction', () => 'sprite.direction');
rep('looks_costumenumber', () => 'sprite.costume');
rep('looks_costumename', () => 'sprite.costume_name()');
rep('looks_size', () => 'sprite.size');
rep('looks_backdrop', (b) => b.getFieldValue('NUMBER') === 'name' ? 'sprite.backdrop_name()' : 'sprite.backdrop');
rep('sound_volume', () => 'sprite.volume');
rep('sensing_touchingmouse', () => 'sprite.touching_mouse()');
rep('sensing_keypressed', (b) => `sprite.key_pressed('${b.getFieldValue('KEY')}')`);
rep('sensing_mousedown', () => 'sprite.mouse_down()');
rep('sensing_mousex', () => 'sprite.mouse_x()');
rep('sensing_mousey', () => 'sprite.mouse_y()');
rep('sensing_timer', () => 'sprite.timer()');
rep('sensing_touching', (b) => `sprite.touching('${b.getFieldValue('TOUCHING')}')`);
rep('sensing_touchingcolor', (b) => `sprite.touching_color('${b.getFieldValue('COLOR')}')`);
rep('sensing_coloristouchingcolor', (b) => `sprite.color_touching('${b.getFieldValue('COLOR')}', '${b.getFieldValue('COLOR2')}')`);
rep('sensing_distanceto', (b) => `sprite.distance_to('${b.getFieldValue('DISTANCETARGET')}')`);
rep('sensing_answer', () => 'sprite.answer');
rep('sensing_loudness', () => 'sprite.loudness');
rep('sensing_of', (b) => `sprite.prop_of(${JSON.stringify(b.getFieldValue('PROPERTY'))}, ${JSON.stringify(b.getFieldValue('OBJECT'))})`);
rep('sensing_current', (b) => `sprite.current(${JSON.stringify(b.getFieldValue('CURRENT'))})`);
rep('sensing_dayssince2000', () => 'sprite.days_since_2000()');
rep('sensing_username', () => 'sprite.username()');

const binop = (type, op, order) => { F[type] = (b) => [`${v(b, 'A', order)} ${op} ${v(b, 'B', order)}`, order]; };
binop('operator_add', '+', ORDER.ADDITIVE);
binop('operator_subtract', '-', ORDER.ADDITIVE);
binop('operator_multiply', '*', ORDER.MULTIPLICATIVE);
binop('operator_mod', '%', ORDER.MULTIPLICATIVE);
binop('operator_gt', '>', ORDER.RELATIONAL);
binop('operator_lt', '<', ORDER.RELATIONAL);
binop('operator_equals', '==', ORDER.RELATIONAL);
F['operator_divide'] = (b) => [`safe_div(${v(b, 'A')}, ${v(b, 'B')})`, ORDER.ATOMIC];
F['operator_random'] = (b) => [`rand(${v(b, 'A')}, ${v(b, 'B')})`, ORDER.ATOMIC];
F['operator_join'] = (b) => [`join(${v(b, 'A')}, ${v(b, 'B')})`, ORDER.ATOMIC];
F['operator_round'] = (b) => [`round(${v(b, 'A')})`, ORDER.ATOMIC];
F['operator_and'] = (b) => [`${v(b, 'A', ORDER.LOGICAL_AND)} and ${v(b, 'B', ORDER.LOGICAL_AND)}`, ORDER.LOGICAL_AND];
F['operator_or'] = (b) => [`${v(b, 'A', ORDER.LOGICAL_OR)} or ${v(b, 'B', ORDER.LOGICAL_OR)}`, ORDER.LOGICAL_OR];
F['operator_not'] = (b) => [`not ${v(b, 'A', ORDER.LOGICAL_NOT)}`, ORDER.LOGICAL_NOT];
F['operator_letterof'] = (b) => [`letter_of(${v(b, 'LETTER')}, ${v(b, 'TEXT')})`, ORDER.ATOMIC];
F['operator_length'] = (b) => [`text_length(${v(b, 'TEXT')})`, ORDER.ATOMIC];
F['operator_contains'] = (b) => [`text_contains(${v(b, 'TEXT')}, ${v(b, 'PART')})`, ORDER.ATOMIC];
F['operator_mathop'] = (b) => [`math_op(${JSON.stringify(b.getFieldValue('OP'))}, ${v(b, 'NUM')})`, ORDER.ATOMIC];

/* control flow: every loop yields once per iteration, like Scratch frames */
F['control_repeat'] = (b) => `for _ in range(int(${v(b, 'TIMES')})):\n${body(b, 'DO')}${PY.INDENT}tick()\n`;
F['control_forever'] = (b) => `while True:\n${body(b, 'DO')}${PY.INDENT}tick()\n`;
F['control_repeatuntil'] = (b) => `while not (${v(b, 'COND')}):\n${body(b, 'DO')}${PY.INDENT}tick()\n`;
F['control_if'] = (b) => `if ${v(b, 'COND')}:\n${body(b, 'DO')}`;
F['control_ifelse'] = (b) => `if ${v(b, 'COND')}:\n${body(b, 'DO')}else:\n${body(b, 'ELSE')}`;

/* hats: each hat becomes a registered function; the chain below it is its body */
let hatCounter = 0;
const hat = (type, decorator) => {
  F[type] = (b) => {
    hatCounter += 1;
    const next = b.getNextBlock();
    const inner = next ? PY.blockToCode(next) : '';
    const text = typeof inner === 'string' ? inner : '';
    const indented = text ? PY.prefixLines(text, PY.INDENT) : PY.INDENT + 'pass\n';
    return `${decorator(b)}\ndef script_${hatCounter}():\n${indented}\n`;
  };
};
hat('event_whenflagclicked', () => '@when_flag');
hat('event_whenkeypressed', (b) => `@when_key('${b.getFieldValue('KEY')}')`);
hat('event_whenthisspriteclicked', () => '@when_clicked');
hat('event_whenbroadcastreceived', (b) => `@when_receive(${JSON.stringify(b.getFieldValue('MSG'))})`);
hat('event_whenbackdropswitches', (b) => `@when_backdrop(${JSON.stringify(b.getFieldValue('BACKDROP'))})`);
hat('event_whengreaterthan', (b) => `@when_greater('${b.getFieldValue('SENSOR')}', lambda: ${v(b, 'VALUE')})`);
hat('control_startasclone', () => '@when_clone');

const HATS = ['event_whenflagclicked', 'event_whenkeypressed', 'event_whenthisspriteclicked', 'event_whenbroadcastreceived', 'event_whenbackdropswitches', 'event_whengreaterthan', 'control_startasclone'];
const origScrub = PY.scrub_.bind(PY);
PY.scrub_ = function (block, code, thisOnly) {
  if (HATS.includes(block.type)) {
    const parts = code;
    return parts; // chain already folded into the hat body
  }
  return origScrub(block, code, thisOnly);
};

/* variables go through a dict so scripts never need `global` */
const vname = (b) => JSON.stringify(b.getField('VAR').getText());
F['variables_get'] = (b) => [`V.get(${vname(b)}, 0)`, ORDER.ATOMIC];
F['variables_set'] = (b) => `V[${vname(b)}] = ${v(b, 'VALUE')}\n`;
F['math_change'] = (b) => `V[${vname(b)}] = V.get(${vname(b)}, 0) + ${v(b, 'DELTA')}\n`;
F['data_showvariable'] = (b) => `show_var(${vname(b)})\n`;
F['data_hidevariable'] = (b) => `hide_var(${vname(b)})\n`;
const lname = (b) => JSON.stringify(b.getField('LIST').getText());
F['data_listcontents'] = (b) => [`lists_contents(${lname(b)})`, ORDER.ATOMIC];
F['data_addtolist'] = (b) => `lists_add(${lname(b)}, ${v(b, 'ITEM')})\n`;
F['data_deleteoflist'] = (b) => `lists_delete(${lname(b)}, ${v(b, 'INDEX')})\n`;
F['data_deletealloflist'] = (b) => `lists_delete_all(${lname(b)})\n`;
F['data_insertatlist'] = (b) => `lists_insert(${lname(b)}, ${v(b, 'ITEM')}, ${v(b, 'INDEX')})\n`;
F['data_replaceitemoflist'] = (b) => `lists_replace(${lname(b)}, ${v(b, 'INDEX')}, ${v(b, 'ITEM')})\n`;
F['data_itemoflist'] = (b) => [`lists_item(${lname(b)}, ${v(b, 'INDEX')})`, ORDER.ATOMIC];
F['data_itemnumoflist'] = (b) => [`lists_index(${lname(b)}, ${v(b, 'ITEM')})`, ORDER.ATOMIC];
F['data_lengthoflist'] = (b) => [`lists_length(${lname(b)})`, ORDER.ATOMIC];
F['data_listcontainsitem'] = (b) => [`lists_contains(${lname(b)}, ${v(b, 'ITEM')})`, ORDER.ATOMIC];
F['data_showlist'] = (b) => `show_list(${lname(b)})\n`;
F['data_hidelist'] = (b) => `hide_list(${lname(b)})\n`;

simple('pen_clear', () => 'pen_clear()');
simple('pen_stamp', () => 'pen_stamp()');
simple('pen_penDown', () => 'pen_down_cmd()');
simple('pen_penUp', () => 'pen_up_cmd()');
simple('pen_setPenColor', (b) => `set_pen_color(${JSON.stringify(b.getFieldValue('COLOR'))})`);
simple('pen_changePenColorParamBy', (b) => `change_pen_param(${JSON.stringify(b.getFieldValue('PARAM'))}, ${v(b, 'VALUE')})`);
simple('pen_setPenColorParamTo', (b) => `_set_pen_param(${JSON.stringify(b.getFieldValue('PARAM'))}, ${v(b, 'VALUE')})`);
simple('pen_changePenSizeBy', (b) => `change_pen_size(${v(b, 'SIZE')})`);
simple('pen_setPenSizeTo', (b) => `set_pen_size(${v(b, 'SIZE')})`);

simple('tts_speak', (b) => `speak(${v(b, 'WORDS')})`);
F['translate_getTranslate'] = (b) => [`sprite.translate(${v(b, 'WORDS')}, ${JSON.stringify(b.getFieldValue('LANGUAGE'))})`, ORDER.ATOMIC];
simple('music_upload', () => 'upload_music()');
simple('music_playfile', (b) => `play_music(${JSON.stringify(b.getFieldValue('TRACK') || '')})`);
simple('music_playfilewait', (b) => `play_music(${JSON.stringify(b.getFieldValue('TRACK') || '')}, True)`);
simple('music_stopfile', () => 'stop_music()');
simple('music_playNote', (b) => `play_note(${v(b, 'NOTE')}, ${v(b, 'BEATS')})`);
simple('music_playDrum', (b) => `play_note(${b.getFieldValue('DRUM')}, ${v(b, 'BEATS')})`);
simple('music_setInstrument', () => 'missing("Music instruments")');
simple('music_setTempo', (b) => `set_tempo(${v(b, 'TEMPO')})`);
simple('music_changeTempo', (b) => `change_tempo(${v(b, 'TEMPO')})`);
simple('video_upload', () => 'upload_video()');
simple('video_playfile', (b) => `play_video(${JSON.stringify(b.getFieldValue('TRACK') || '')})`);
simple('video_playfilewait', (b) => `play_video(${JSON.stringify(b.getFieldValue('TRACK') || '')}, True)`);
simple('video_stopfile', () => 'stop_video()');
F['video_motion'] = () => [`sprite.missing("Video Sensing")`, ORDER.ATOMIC];
simple('video_toggle', () => 'missing("Video Sensing")');
simple('video_transparency', () => 'missing("Video Sensing")');
simple('ai_face', () => 'detect_face()');
simple('ai_mesh', () => 'face_mesh()');
simple('ai_face_expr', () => 'facial_analysis()');
simple('ai_hand', () => 'detect_hand()');
simple('ai_gesture', () => 'detect_gesture()');
simple('ai_pose', () => 'body_skeleton()');
simple('ai_selfie', () => 'selfie_cutout()');
simple('ai_body', () => 'detect_body()');
simple('ai_object', () => 'detect_objects()');
simple('ai_object_pick', (b) => `detect_object(${JSON.stringify(b.getFieldValue('OBJECT') || 'any')})`);
F['ai_face_seen'] = () => ['sprite.face_seen()', ORDER.ATOMIC];
F['ai_expression'] = () => ['sprite.face_expression()', ORDER.ATOMIC];
F['ai_hand_seen'] = () => ['sprite.hand_seen()', ORDER.ATOMIC];
F['ai_gesture_name'] = () => ['sprite.gesture_name()', ORDER.ATOMIC];
F['ai_pose_seen'] = () => ['sprite.pose_seen()', ORDER.ATOMIC];
F['ai_body_seen'] = () => ['sprite.body_seen()', ORDER.ATOMIC];
F['ai_object_seen'] = () => ['sprite.object_seen()', ORDER.ATOMIC];
F['ai_object_which'] = (b) => [`sprite.object_which(${JSON.stringify(b.getFieldValue('OBJECT') || 'any')})`, ORDER.ATOMIC];
F['ai_classifier'] = () => ['sprite.classify_image()', ORDER.ATOMIC];
F['ai_ocr'] = () => ['sprite.read_camera_text()', ORDER.ATOMIC];
F['ai_speech'] = () => ['sprite.listen_words()', ORDER.ATOMIC];
F['ai_nlp'] = (b) => [`sprite.analyse_text(${v(b, 'TEXT')})`, ORDER.ATOMIC];
F['ai_ml'] = () => ['sprite.ml_result()', ORDER.ATOMIC];
F['ai_neural'] = () => ['sprite.neural_result()', ORDER.ATOMIC];
simple('hw_quarky', () => 'missing("Quarky")');
simple('hw_digital', () => 'missing("Arduino")');
F['hw_analog'] = () => [`sprite.missing("Arduino")`, ORDER.ATOMIC];
simple('hw_servo', () => 'missing("Arduino servo")');
simple('hw_esp32', () => 'missing("ESP32")');
simple('hw_microbit', () => 'missing("micro:bit")');
simple('hw_pi', () => 'missing("Raspberry Pi")');
simple('hw_evive', () => 'missing("Evive")');
simple('hw_tecbits', () => 'missing("Tecbits")');
simple('hw_rover', () => 'missing("Rover")');

/* ---------- toolbox ---------- */
const N = (name, n) => ({ [name]: { shadow: { type: 'math_number', fields: { NUM: n } } } });
const T = (name, t) => ({ [name]: { shadow: { type: 'text', fields: { TEXT: t } } } });
const blk = (type, inputs) => ({ kind: 'block', type, inputs: inputs || undefined });
const cat = (name, colour, contents, cls) => ({ kind: 'category', name, colour, cssConfig: { container: 'pb-cat ' + (cls || '') }, contents });

function buildToolbox(level, boardId) {
  const motion = cat('Motion', '#4C97FF', [
    blk('motion_movesteps', N('STEPS', 10)), blk('motion_turnright', N('DEGREES', 15)), blk('motion_turnleft', N('DEGREES', 15)),
    { kind: 'sep', gap: 24 },
    blk('motion_goto'), blk('motion_gotoxy', Object.assign({}, N('X', 0), N('Y', 0))),
    blk('motion_glideto', N('SECS', 1)), blk('motion_glidexy', Object.assign({}, N('SECS', 1), N('X', 0), N('Y', 0))),
    { kind: 'sep', gap: 24 },
    blk('motion_pointindirection', N('DIR', 90)), blk('motion_pointtowards'),
    { kind: 'sep', gap: 24 },
    blk('motion_changexby', N('DX', 10)), blk('motion_setx', N('X', 0)), blk('motion_changeyby', N('DY', 10)), blk('motion_sety', N('Y', 0)),
    { kind: 'sep', gap: 24 },
    blk('motion_ifonedgebounce'), blk('motion_setrotationstyle'),
    { kind: 'sep', gap: 24 },
    blk('motion_xposition'), blk('motion_yposition'), blk('motion_direction'),
  ], 'c-motion');
  const looks = cat('Looks', '#9966FF', [
    blk('looks_sayforsecs', Object.assign({}, T('MSG', 'Hello!'), N('SECS', 2))), blk('looks_say', T('MSG', 'Hello!')),
    blk('looks_thinkforsecs', Object.assign({}, T('MSG', 'Hmm...'), N('SECS', 2))), blk('looks_think', T('MSG', 'Hmm...')),
    { kind: 'sep', gap: 24 },
    blk('looks_switchcostumeto'), blk('looks_nextcostume'),
    { kind: 'sep', gap: 24 },
    blk('looks_switchbackdropto'), blk('looks_nextbackdrop'), blk('looks_switchbackdropandwait'),
    { kind: 'sep', gap: 24 },
    blk('looks_changesizeby', N('CHANGE', 10)), blk('looks_setsizeto', N('SIZE', 100)),
    { kind: 'sep', gap: 24 },
    blk('looks_changeeffectby', N('CHANGE', 25)), blk('looks_seteffectto', N('VALUE', 0)), blk('looks_cleargraphiceffects'),
    { kind: 'sep', gap: 24 },
    blk('looks_show'), blk('looks_hide'),
    { kind: 'sep', gap: 24 },
    blk('looks_gotofrontback'), blk('looks_goforwardbackwardlayers', N('NUM', 1)),
    { kind: 'sep', gap: 24 },
    blk('looks_costumenumber'), blk('looks_costumename'), blk('looks_backdrop'), blk('looks_size'),
    { kind: 'sep', gap: 24 },
    blk('looks_snapshot'),
  ], 'c-looks');
  const sound = cat('Sound', '#CF63CF', [
    blk('sound_playuntildone'), blk('sound_play'), blk('sound_stopall'),
    { kind: 'sep', gap: 24 },
    blk('sound_changeeffectby', N('VALUE', 10)), blk('sound_seteffectto', N('VALUE', 100)), blk('sound_cleareffects'),
    { kind: 'sep', gap: 24 },
    blk('sound_changevolumeby', N('VOLUME', -10)), blk('sound_setvolume', N('VOL', 100)), blk('sound_volume'),
  ], 'c-sound');
  const events = cat('Events', '#FFBF00', [
    blk('event_whenflagclicked'), blk('event_whenkeypressed'), blk('event_whenthisspriteclicked'),
    blk('event_whenbackdropswitches'), blk('event_whengreaterthan', N('VALUE', 10)),
    { kind: 'sep', gap: 24 },
    blk('event_whenbroadcastreceived'), blk('event_broadcast'), blk('event_broadcastandwait'),
  ], 'c-events');
  const control = cat('Control', '#FFAB19', [
    blk('control_wait', N('SECS', 1)), { kind: 'sep', gap: 24 },
    blk('control_repeat', N('TIMES', 10)), blk('control_forever'),
    { kind: 'sep', gap: 24 },
    blk('control_if'), blk('control_ifelse'), blk('control_waituntil'), blk('control_repeatuntil'),
    { kind: 'sep', gap: 24 },
    blk('control_stopall'), blk('control_stop'),
    { kind: 'sep', gap: 24 },
    blk('control_startasclone'), blk('control_createclone'), blk('control_deleteclone'),
  ], 'c-control');
  const sensing = cat('Sensing', '#5CB1D6', [
    blk('sensing_touching'), blk('sensing_touchingmouse'), blk('sensing_touchingcolor'), blk('sensing_coloristouchingcolor'), blk('sensing_distanceto'),
    { kind: 'sep', gap: 24 },
    blk('sensing_askandwait', T('QUESTION', "What's your name?")), blk('sensing_answer'),
    { kind: 'sep', gap: 24 },
    blk('sensing_keypressed'), blk('sensing_mousedown'), blk('sensing_mousex'), blk('sensing_mousey'), blk('sensing_setdragmode'),
    { kind: 'sep', gap: 24 },
    blk('sensing_loudness'), blk('sensing_timer'), blk('sensing_resettimer'),
    { kind: 'sep', gap: 24 },
    blk('sensing_of'), blk('sensing_current'), blk('sensing_dayssince2000'), blk('sensing_username'),
  ], 'c-sensing');
  const operators = cat('Operators', '#59C059', [
    blk('operator_add', Object.assign({}, N('A', ''), N('B', ''))), blk('operator_subtract', Object.assign({}, N('A', ''), N('B', ''))),
    blk('operator_multiply', Object.assign({}, N('A', ''), N('B', ''))), blk('operator_divide', Object.assign({}, N('A', ''), N('B', ''))),
    { kind: 'sep', gap: 24 },
    blk('operator_random', Object.assign({}, N('A', 1), N('B', 10))),
    { kind: 'sep', gap: 24 },
    blk('operator_gt', Object.assign({}, N('A', ''), N('B', 50))), blk('operator_lt', Object.assign({}, N('A', ''), N('B', 50))), blk('operator_equals', Object.assign({}, N('A', ''), N('B', 50))),
    blk('operator_and'), blk('operator_or'), blk('operator_not'),
    { kind: 'sep', gap: 24 },
    blk('operator_join', Object.assign({}, T('A', 'apple '), T('B', 'banana'))),
    blk('operator_letterof', Object.assign({}, N('LETTER', 1), T('TEXT', 'apple'))),
    blk('operator_length', T('TEXT', 'apple')),
    blk('operator_contains', Object.assign({}, T('TEXT', 'apple'), T('PART', 'a'))),
    { kind: 'sep', gap: 24 },
    blk('operator_mod', Object.assign({}, N('A', ''), N('B', ''))), blk('operator_round', N('A', '')),
    blk('operator_mathop', N('NUM', 9)),
  ], 'c-operators');
  const variables = { kind: 'category', name: 'Variables', colour: '#FF8C1A', custom: 'VARIABLE', cssConfig: { container: 'pb-cat c-variables' } };
  const myblocks = { kind: 'category', name: 'My Blocks', colour: '#FF6680', custom: 'PROCEDURE', cssConfig: { container: 'pb-cat c-myblocks' } };

  const pen = cat('Pen', '#0FBD8C', [
    blk('pen_clear'), blk('pen_stamp'), blk('pen_penDown'), blk('pen_penUp'),
    { kind: 'sep', gap: 24 },
    blk('pen_setPenColor'), blk('pen_changePenColorParamBy', N('VALUE', 10)), blk('pen_setPenColorParamTo', N('VALUE', 50)),
    { kind: 'sep', gap: 24 },
    blk('pen_changePenSizeBy', N('SIZE', 1)), blk('pen_setPenSizeTo', N('SIZE', 1)),
  ], 'c-pen');
  const tts = cat('TTS', '#9966FF', [blk('tts_speak', T('WORDS', 'hello'))], 'c-tts');
  const translate = cat('Translate', '#5CB1D6', [blk('translate_getTranslate', T('WORDS', 'hello'))], 'c-translate');
  const music = cat('Music', '#CF63CF', [
    { kind: 'label', text: 'Your music' },
    blk('music_upload'), blk('music_playfile'), blk('music_playfilewait'), blk('music_stopfile'),
    { kind: 'sep', gap: 24 },
    blk('music_playNote', Object.assign({}, N('NOTE', 60), N('BEATS', 0.25))),
    blk('music_playDrum', N('BEATS', 0.25)), blk('music_setInstrument'),
    { kind: 'sep', gap: 24 },
    blk('music_setTempo', N('TEMPO', 60)), blk('music_changeTempo', N('TEMPO', 20)),
  ], 'c-music');
  const video = cat('Video', '#5CB1D6', [
    { kind: 'label', text: 'Your videos' },
    blk('video_upload'), blk('video_playfile'), blk('video_playfilewait'), blk('video_stopfile'),
    { kind: 'sep', gap: 24 },
    blk('video_motion'), blk('video_toggle'), blk('video_transparency', N('TRANSPARENCY', 50)),
  ], 'c-video');
  const aiCat = cat('AI', '#7A22E8', [
    blk('ai_face'), blk('ai_face_seen'), blk('ai_mesh'), blk('ai_face_expr'), blk('ai_expression'),
    blk('ai_hand'), blk('ai_hand_seen'), blk('ai_gesture'), blk('ai_gesture_name'),
    blk('ai_pose'), blk('ai_pose_seen'), blk('ai_selfie'),
    blk('ai_body'), blk('ai_body_seen'),
    blk('ai_object'), blk('ai_object_pick'), blk('ai_object_which'), blk('ai_object_seen'), blk('ai_classifier'),
    blk('ai_ocr'), blk('ai_speech'), blk('ai_nlp', T('TEXT', 'hello')), blk('ai_ml'), blk('ai_neural'),
  ], 'c-ai');
  const boardBlocks = typeof boardPalette === 'function' ? boardPalette(boardId) : [];
  const hardware = cat('Hardware', '#FF8C1A', boardBlocks.concat([
    { kind: 'label', text: 'Other boards' },
    blk('hw_quarky'),
    blk('hw_digital', Object.assign({}, N('PIN', 13), N('VALUE', 1))), blk('hw_analog', N('PIN', 0)),
    blk('hw_servo', Object.assign({}, N('PIN', 9), N('ANGLE', 90))),
    blk('hw_esp32'), blk('hw_microbit'), blk('hw_pi'), blk('hw_evive'), blk('hw_tecbits'), blk('hw_rover'),
  ]), 'c-hardware');

  const contents = level === 'junior'
    ? [motion, looks, events, control, hardware]
    : [motion, looks, sound, events, control, sensing, operators, variables, myblocks, pen, tts, translate, music, video, aiCat, hardware];
  return { kind: 'categoryToolbox', contents };
}
