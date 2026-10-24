/* Reuse the same Blockly build and block definitions as the desktop app. */
(function () {
  const colors = {
    motion: { colourPrimary: '#4C97FF', colourSecondary: '#4280D7', colourTertiary: '#3373CC' },
    looks: { colourPrimary: '#9966FF', colourSecondary: '#855CD6', colourTertiary: '#774DCB' },
    sound: { colourPrimary: '#CF63CF', colourSecondary: '#C94FC9', colourTertiary: '#BD42BD' },
    events: { colourPrimary: '#FFBF00', colourSecondary: '#E6AC00', colourTertiary: '#CC9900' },
    control: { colourPrimary: '#FFAB19', colourSecondary: '#EC9C13', colourTertiary: '#CF8B17' },
    sensing: { colourPrimary: '#5CB1D6', colourSecondary: '#47A8D1', colourTertiary: '#2E8EB8' },
    operators: { colourPrimary: '#59C059', colourSecondary: '#46B946', colourTertiary: '#389438' },
    variables: { colourPrimary: '#FF8C1A', colourSecondary: '#FF8000', colourTertiary: '#DB6E00' },
    myblocks: { colourPrimary: '#FF6680', colourSecondary: '#FF4D6A', colourTertiary: '#FF3355' },
    pen: { colourPrimary: '#0FBD8C', colourSecondary: '#0DA57A', colourTertiary: '#0B8E69' },
    tts: { colourPrimary: '#9966FF', colourSecondary: '#855CD6', colourTertiary: '#774DCB' },
    translate: { colourPrimary: '#5CB1D6', colourSecondary: '#47A8D1', colourTertiary: '#2E8EB8' },
    music: { colourPrimary: '#CF63CF', colourSecondary: '#C94FC9', colourTertiary: '#BD42BD' },
    video: { colourPrimary: '#5CB1D6', colourSecondary: '#47A8D1', colourTertiary: '#2E8EB8' },
    ai: { colourPrimary: '#7A22E8', colourSecondary: '#6518C4', colourTertiary: '#5414A8' },
    hardware: { colourPrimary: '#FF8C1A', colourSecondary: '#FF8000', colourTertiary: '#DB6E00' },
    board: { colourPrimary: '#00979D', colourSecondary: '#007E85', colourTertiary: '#00666C' },
    math_blocks: { colourPrimary: '#59C059', colourSecondary: '#46B946', colourTertiary: '#389438' },
    text_blocks: { colourPrimary: '#59C059', colourSecondary: '#46B946', colourTertiary: '#389438' },
    variable_blocks: { colourPrimary: '#FF8C1A', colourSecondary: '#FF8000', colourTertiary: '#DB6E00' },
    procedure_blocks: { colourPrimary: '#FF6680', colourSecondary: '#FF4D6A', colourTertiary: '#FF3355' }
  };
  const theme = Blockly.Theme.defineTheme('buxinCurriculum', {
    base: Blockly.Themes.Classic,
    blockStyles: colors,
    categoryStyles: {},
    componentStyles: {
      workspaceBackgroundColour: '#F9F9F9', toolboxBackgroundColour: '#FFFFFF',
      flyoutBackgroundColour: '#F9F9F9', flyoutOpacity: 1,
      scrollbarColour: '#CECDCE', insertionMarkerColour: '#000000', insertionMarkerOpacity: .2
    },
    fontStyle: { family: 'Arial, sans-serif', weight: '600', size: 11 }
  });

  let workspace;
  let hardwarePreviewWorkspace;
  const types = {
    'move 10 steps': 'motion_movesteps', 'turn right 15 degrees': 'motion_turnright',
    'go to x: 0 y: 0': 'motion_gotoxy', 'say Hello!': 'looks_say',
    'switch costume to costume1': 'looks_switchcostumeto', 'when green flag clicked': 'event_whenflagclicked',
    'when space key pressed': 'event_whenkeypressed', 'repeat 10 times': 'control_repeat',
    forever: 'control_forever', 'if touching edge? then … else …': 'control_ifelse',
    'wait until condition': 'control_waituntil', 'touching mouse-pointer?': 'sensing_touching',
    'key space pressed?': 'sensing_keypressed', 'distance to mouse-pointer': 'sensing_distanceto',
    'A < 50': 'operator_lt', 'A and B': 'operator_and', 'set score to 0': 'variables_set',
    'change score by 1': 'math_change', 'broadcast message1': 'event_broadcast',
    'define My Block': 'procedures_defnoreturn', 'set pin mode D13 mode OUTPUT': 'hw_digital',
    'set digital pin D13 to HIGH': 'hw_digital', 'read digital pin D13': 'hw_analog',
    'set servo on pin D9 angle 90': 'hw_servo'
  };
  const inputDefaults = {
    motion_movesteps: { STEPS: ['math_number', 'NUM', '10'] },
    motion_turnright: { DEGREES: ['math_number', 'NUM', '15'] },
    motion_gotoxy: { X: ['math_number', 'NUM', '0'], Y: ['math_number', 'NUM', '0'] },
    looks_say: { MSG: ['text', 'TEXT', 'Hello!'] },
    control_repeat: { TIMES: ['math_number', 'NUM', '4'] },
    operator_lt: { A: ['math_number', 'NUM', '10'], B: ['math_number', 'NUM', '50'] },
    operator_and: { A: ['logic_boolean', 'BOOL', 'TRUE'], B: ['logic_boolean', 'BOOL', 'TRUE'] },
    variables_set: { VALUE: ['math_number', 'NUM', '0'] },
    math_change: { DELTA: ['math_number', 'NUM', '1'] },
    event_broadcast: { MSG: ['text', 'TEXT', 'message1'] },
    control_ifelse: { COND: ['logic_boolean', 'BOOL', 'TRUE'] },
    sensing_touching: { TOUCHING: ['text', 'TEXT', 'mouse-pointer'] },
    hw_digital: { PIN: ['math_number', 'NUM', '13'], VALUE: ['math_number', 'NUM', '1'] },
    hw_analog: { PIN: ['math_number', 'NUM', '0'] },
    hw_servo: { PIN: ['math_number', 'NUM', '9'], ANGLE: ['math_number', 'NUM', '90'] }
  };

  function makeBlock(type, parentWorkspace) {
    const block = parentWorkspace.newBlock(type);
    const defaults = inputDefaults[type] || {};
    (block.inputList || []).forEach(input => {
      if (!input.connection || input.type !== Blockly.INPUT_VALUE) return;
      const spec = defaults[input.name];
      if (!spec) return;
      const child = parentWorkspace.newBlock(spec[0]);
      if (child.getField(spec[1])) child.setFieldValue(spec[2], spec[1]);
      input.connection.connect(child.outputConnection);
      child.initSvg(); child.render();
    });
    block.initSvg(); block.render();
    return block;
  }

  function connect(parent, child) {
    if (parent && child && parent.nextConnection && child.previousConnection && parent.nextConnection.isConnected() === false) {
      parent.nextConnection.connect(child.previousConnection);
    }
  }

  function place(block, x, y) {
    if (block && block.outputConnection && !block.previousConnection) block.outputConnection.disconnect();
    block.moveBy(x, y);
  }

  function reset() {
    if (workspace) workspace.clear();
  }

  function start() {
    if (!window.Blockly || !document.getElementById('live-blockly')) return;
    if (workspace) { Blockly.svgResize(workspace); return; }
    workspace = Blockly.inject('live-blockly', {
      toolbox: buildToolbox('full', ''), renderer: 'zelos', theme,
      sounds: false,
      grid: { spacing: 20, length: 2, colour: '#e5e7ef', snap: false },
      zoom: { controls: true, wheel: true, startScale: .9, maxScale: 1.7, minScale: .45, scaleSpeed: 1.15 },
      move: { scrollbars: true, drag: true, wheel: true },
      trashcan: false
    });
    workspace.createVariable('score');
    loadPreset('hello');
    window.addEventListener('resize', () => Blockly.svgResize(workspace));
  }

  function loadPreset(name) {
    if (!workspace) return;
    reset();
    const configs = {
      hello: [
        ['event_whenflagclicked'], ['looks_say'], ['motion_movesteps']
      ],
      dance: [
        ['event_whenflagclicked'], ['control_repeat'], ['motion_movesteps'], ['motion_turnright']
      ],
      choice: [
        ['event_whenflagclicked'], ['control_ifelse'], ['looks_say'], ['looks_think']
      ]
    };
    const ids = configs[name] || configs.hello;
    const blocks = ids.map(([type]) => makeBlock(type, workspace));
    if (name === 'dance') {
      const loop = blocks[1];
      if (loop.getInput('DO')?.connection) loop.getInput('DO').connection.connect(blocks[2].previousConnection);
      connect(blocks[2], blocks[3]);
    } else if (name === 'choice') {
      const branch = blocks[1];
      branch.getInput('DO')?.connection?.connect(blocks[2].previousConnection);
      branch.getInput('ELSE')?.connection?.connect(blocks[3].previousConnection);
    } else connect(blocks[1], blocks[2]);
    connect(blocks[0], blocks[1]);
    place(blocks[0], 36, 35);
    Blockly.svgResize(workspace);
  }

  function addBlock(label) {
    if (!workspace) return;
    const type = types[label];
    if (!type || !Blockly.Blocks[type]) return;
    const block = makeBlock(type, workspace);
    const tops = workspace.getTopBlocks(true);
    const stack = tops.find(item => item.nextConnection && item.previousConnection === null);
    let tail = stack;
    while (tail && tail.getNextBlock()) tail = tail.getNextBlock();
    if (tail && tail.nextConnection && block.previousConnection && !tail.nextConnection.isConnected()) connect(tail, block);
    else block.moveBy(55 + (tops.length % 4) * 32, 45 + tops.length * 38);
    Blockly.svgResize(workspace);
  }

  function defineHardwarePreviewBlocks() {
    const dropdown = (name, options) => ({ type: 'field_dropdown', name, options });
    const numberInput = (name) => ({ type: 'input_value', name, check: 'Number' });
    const pinOptions = prefix => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(n => [`${prefix}${n}`, `${prefix}${n}`]);
    const definitions = {
      board_whenstart: { message0: 'when board starts', nextStatement: null, hat: 'cap' },
      board_forever: { message0: 'forever', nextStatement: null, hat: 'cap' },
      board_digitalwrite: { message0: 'set digital pin %1 to %2', args0: [dropdown('PIN', pinOptions('D')), dropdown('LEVEL', [['HIGH', 'HIGH'], ['LOW', 'LOW']])], previousStatement: null, nextStatement: null },
      board_wait_sec: { message0: 'wait %1 seconds', args0: [numberInput('SECS')], previousStatement: null, nextStatement: null },
      board_button: { message0: 'button pin %1 pressed?', args0: [dropdown('PIN', pinOptions('D'))], output: 'Boolean' },
      board_ldr: { message0: 'LDR light pin %1', args0: [dropdown('PIN', [0, 1, 2, 3, 4, 5, 6, 7].map(n => [`A${n}`, `A${n}`]))], output: 'Number' },
      board_ultrasonic: { message0: 'ultrasonic cm trig %1 echo %2', args0: [dropdown('TRIG', pinOptions('D')), dropdown('ECHO', pinOptions('D'))], output: 'Number' },
      board_line_sensor: { message0: 'IR line sensor %1 on pin %2 sees dark?', args0: [dropdown('SIDE', [['left', 'left'], ['right', 'right']]), dropdown('PIN', pinOptions('D'))], output: 'Boolean' },
      board_soil_sensor: { message0: 'soil moisture on pin %1', args0: [dropdown('PIN', [0,1,2,3,4,5].map(n => [`A${n}`, `A${n}`]))], output: 'Number' },
      board_pir_sensor: { message0: 'PIR motion on pin %1 detected?', args0: [dropdown('PIN', pinOptions('D'))], output: 'Boolean' },
      board_environment: { message0: 'read %1 from sensor on pin %2', args0: [dropdown('VALUE', [['temperature', 'temperature'], ['humidity', 'humidity']]), dropdown('PIN', pinOptions('D'))], output: 'Number' },
      board_command: { message0: 'wireless command received', output: 'String' },
      board_access_code: { message0: 'card or keypad value received', output: 'String' },
      board_command_is: { message0: 'wireless command is %1', args0: [dropdown('COMMAND', [['F', 'F'], ['B', 'B'], ['L', 'L'], ['R', 'R'], ['S', 'S']])], output: 'Boolean' },
      board_access_allowed: { message0: 'card or code is allowed?', output: 'Boolean' },
      board_car_in_bay: { message0: 'vehicle detected at bay?', output: 'Boolean' },
      board_pump: { message0: 'pump on pin %1 %2', args0: [dropdown('PIN', pinOptions('D')), dropdown('STATE', [['ON', 'ON'], ['OFF', 'OFF']])], previousStatement: null, nextStatement: null },
      board_servo: { message0: 'set servo on pin %1 angle %2', args0: [dropdown('PIN', pinOptions('D')), numberInput('ANGLE')], previousStatement: null, nextStatement: null },
      board_wireless_send: { message0: 'send temperature and humidity wirelessly', previousStatement: null, nextStatement: null },
      board_alarm: { message0: 'buzzer on pin %1 %2', args0: [dropdown('PIN', pinOptions('D')), dropdown('STATE', [['ON', 'ON'], ['OFF', 'OFF']])], previousStatement: null, nextStatement: null },
      board_pid_follow: { message0: 'PID line control Kp %1 Ki %2 Kd %3', args0: [numberInput('KP'), numberInput('KI'), numberInput('KD')], previousStatement: null, nextStatement: null },
      board_navigation_step: { message0: 'navigate to next waypoint', previousStatement: null, nextStatement: null },
      board_sort_cycle: { message0: 'detect, classify, and route item', previousStatement: null, nextStatement: null },
      board_greenhouse_cycle: { message0: 'read greenhouse sensors and control outputs', previousStatement: null, nextStatement: null },
      board_vision_target: { message0: 'vision target confidence is acceptable?', output: 'Boolean' },
      board_send_robot_command: { message0: 'send safe command to robot', previousStatement: null, nextStatement: null },
      board_telemetry: { message0: 'publish status and sensor telemetry', previousStatement: null, nextStatement: null },
      board_balance_control: { message0: 'feedback control from IMU angle and rate', previousStatement: null, nextStatement: null },
      board_capstone_step: { message0: 'run next task state safely', previousStatement: null, nextStatement: null },
      board_encoder_speed: { message0: 'encoder speed on pin %1', args0: [dropdown('PIN', pinOptions('D'))], output: 'Number' },
      board_coordinate_move: { message0: 'move arm to coordinate target', previousStatement: null, nextStatement: null },
      board_quality_check: { message0: 'item meets inspection limits?', output: 'Boolean' },
      board_path_plan: { message0: 'plan route around blocked cells', previousStatement: null, nextStatement: null },
      board_system_check: { message0: 'all modules ready and no fault?', output: 'Boolean' },
      board_record_measurement: { message0: 'record measured value and result', previousStatement: null, nextStatement: null },
      board_sample_environment: { message0: 'read temperature and humidity sensors', previousStatement: null, nextStatement: null },
      board_read_encoder_speed: { message0: 'read encoder speed and compare with target', previousStatement: null, nextStatement: null },
      board_tone: { message0: 'play tone on pin %1 freq %2 for %3 ms', args0: [dropdown('PIN', pinOptions('D')), numberInput('FREQ'), numberInput('MS')], previousStatement: null, nextStatement: null },
      board_drive: { message0: 'drive %1 L1 %2 L2 %3 LEN %4 R1 %5 R2 %6 REN %7', args0: [dropdown('DIR', [['forward', 'forward'], ['backward', 'backward'], ['left', 'left'], ['right', 'right'], ['stop', 'stop']]), dropdown('L1', pinOptions('D')), dropdown('L2', pinOptions('D')), dropdown('LEN', pinOptions('D')), dropdown('R1', pinOptions('D')), dropdown('R2', pinOptions('D')), dropdown('REN', pinOptions('D'))], previousStatement: null, nextStatement: null },
      board_motor_stop: { message0: 'stop motor IN1 %1 IN2 %2 ENA %3', args0: [dropdown('IN1', pinOptions('D')), dropdown('IN2', pinOptions('D')), dropdown('ENA', pinOptions('D'))], previousStatement: null, nextStatement: null }
    };
    Object.entries(definitions).forEach(([type, definition]) => {
      if (!Blockly.Blocks[type]) Blockly.Blocks[type] = { init() { this.jsonInit(Object.assign({ style: 'hardware' }, definition)); } };
    });
  }

  function makeProgramBlock(targetWorkspace, spec) {
    const block = targetWorkspace.newBlock(spec.type);
    Object.entries(spec.fields || {}).forEach(([name, value]) => block.setFieldValue(String(value), name));
    Object.entries(spec.values || {}).forEach(([name, childSpec]) => {
      const input = block.getInput(name);
      if (!input?.connection) return;
      const child = makeProgramBlock(targetWorkspace, childSpec);
      input.connection.connect(child.outputConnection);
    });
    block.initSvg();
    block.render();
    return block;
  }

  function joinNext(previous, next) {
    if (previous?.nextConnection && next?.previousConnection) previous.nextConnection.connect(next.previousConnection);
  }

  function makeIfElse(targetWorkspace, condition, yesBlocks, noBlocks) {
    const decision = targetWorkspace.newBlock('controls_if');
    decision.elseCount_ = 1;
    decision.updateShape_();
    const test = makeProgramBlock(targetWorkspace, condition);
    decision.getInput('IF0').connection.connect(test.outputConnection);
    let yesTail = null;
    yesBlocks.forEach(spec => { const child = makeProgramBlock(targetWorkspace, spec); if (yesTail) joinNext(yesTail, child); else decision.getInput('DO0').connection.connect(child.previousConnection); yesTail = child; });
    let noTail = null;
    noBlocks.forEach(spec => { const child = makeProgramBlock(targetWorkspace, spec); if (noTail) joinNext(noTail, child); else decision.getInput('ELSE').connection.connect(child.previousConnection); noTail = child; });
    decision.initSvg();
    decision.render();
    return decision;
  }

  function renderHardwareProgram(container, index) {
    if (!container || !window.Blockly) return;
    defineHardwarePreviewBlocks();
    if (hardwarePreviewWorkspace) hardwarePreviewWorkspace.dispose();
    hardwarePreviewWorkspace = Blockly.inject(container, {
      renderer: 'zelos', theme, readOnly: true, sounds: false,
      move: { scrollbars: false, drag: false, wheel: false },
      zoom: { controls: false, wheel: false, pinch: false },
      trashcan: false
    });
    const digital = level => ({ type: 'board_digitalwrite', fields: { PIN: 'D13', LEVEL: level } });
    const wait = seconds => ({ type: 'board_wait_sec', values: { SECS: { type: 'math_number', fields: { NUM: seconds } } } });
    let root = makeProgramBlock(hardwarePreviewWorkspace, { type: 'board_whenstart' });
    let tail = root;
    if (index === 0) {
      const loop = makeProgramBlock(hardwarePreviewWorkspace, { type: 'board_forever' });
      loop.moveBy(0, 72);
      const stack = [digital('HIGH'), wait(1), digital('LOW'), wait(1)].map(spec => makeProgramBlock(hardwarePreviewWorkspace, spec));
      stack.forEach((block, i) => { if (i === 0) joinNext(loop, block); else joinNext(stack[i - 1], block); });
    } else if (index === 1 || index === 2 || index === 3) {
      const loop = makeProgramBlock(hardwarePreviewWorkspace, { type: 'board_forever' });
      loop.moveBy(0, 72);
      let condition;
      let yes = [digital('HIGH')], no = [digital('LOW')];
      if (index === 1) condition = { type: 'board_button', fields: { PIN: 'D2' } };
      if (index === 2) condition = { type: 'logic_compare', fields: { OP: 'LT' }, values: { A: { type: 'board_ldr', fields: { PIN: 'A0' } }, B: { type: 'math_number', fields: { NUM: 500 } } } };
      if (index === 3) {
        condition = { type: 'logic_compare', fields: { OP: 'LT' }, values: { A: { type: 'board_ultrasonic', fields: { TRIG: 'D7', ECHO: 'D8' } }, B: { type: 'math_number', fields: { NUM: 15 } } } };
        yes = [digital('HIGH'), { type: 'board_tone', fields: { PIN: 'D6' }, values: { FREQ: { type: 'math_number', fields: { NUM: 1000 } }, MS: { type: 'math_number', fields: { NUM: 200 } } } }];
      }
      const decision = makeIfElse(hardwarePreviewWorkspace, condition, yes, no);
      joinNext(loop, decision);
    } else if (index === 4) {
      const pins = { L1: 'D4', L2: 'D5', LEN: 'D6', R1: 'D7', R2: 'D8', REN: 'D9' };
      const forward = makeProgramBlock(hardwarePreviewWorkspace, { type: 'board_drive', fields: Object.assign({ DIR: 'forward' }, pins) });
      const pause = makeProgramBlock(hardwarePreviewWorkspace, wait(1));
      const stop = makeProgramBlock(hardwarePreviewWorkspace, { type: 'board_drive', fields: Object.assign({ DIR: 'stop' }, pins) });
      joinNext(tail, forward); joinNext(forward, pause); joinNext(pause, stop);
    }
    root.moveBy(18, 18);
    Blockly.svgResize(hardwarePreviewWorkspace);
    container.dataset.rendered = 'true';
    return hardwarePreviewWorkspace;
  }

  function renderLowerHardwareProgram(container, index) {
    if (!container || !window.Blockly) return;
    defineHardwarePreviewBlocks();
    if (hardwarePreviewWorkspace) hardwarePreviewWorkspace.dispose();
    hardwarePreviewWorkspace = Blockly.inject(container, { renderer: 'zelos', theme, readOnly: true, sounds: false, move: { scrollbars: false, drag: false, wheel: false }, zoom: { controls: false, wheel: false, pinch: false }, trashcan: false });
    const wait = seconds => ({ type: 'board_wait_sec', values: { SECS: { type: 'math_number', fields: { NUM: seconds } } } });
    const drive = direction => ({ type: 'board_drive', fields: { DIR: direction, L1: 'D4', L2: 'D5', LEN: 'D6', R1: 'D7', R2: 'D8', REN: 'D9' } });
    const servo = angle => ({ type: 'board_servo', fields: { PIN: 'D9' }, values: { ANGLE: { type: 'math_number', fields: { NUM: angle } } } });
    const digital = (pin, level) => ({ type: 'board_digitalwrite', fields: { PIN: pin, LEVEL: level } });
    const alarm = state => ({ type: 'board_alarm', fields: { PIN: 'D6', STATE: state } });
    const compare = (reporter, op, value) => ({ type: 'logic_compare', fields: { OP: op }, values: { A: reporter, B: { type: 'math_number', fields: { NUM: value } } } });
    const programs = [
      { condition: compare({ type: 'board_ultrasonic', fields: { TRIG: 'D10', ECHO: 'D11' } }, 'LT', 20), yes: [drive('stop'), wait(.25), drive('right'), wait(.35)], no: [drive('forward')] },
      { condition: { type: 'board_line_sensor', fields: { SIDE: 'left', PIN: 'D2' } }, yes: [drive('left')], no: [drive('right')] },
      { condition: { type: 'board_command_is', fields: { COMMAND: 'F' } }, yes: [drive('forward')], no: [drive('stop')] },
      { condition: { type: 'board_car_in_bay' }, yes: [servo(90), digital('D5', 'HIGH')], no: [servo(0), digital('D5', 'LOW')] },
      { condition: compare({ type: 'board_soil_sensor', fields: { PIN: 'A0' } }, 'LT', 400), yes: [{ type: 'board_pump', fields: { PIN: 'D5', STATE: 'ON' } }, wait(2), { type: 'board_pump', fields: { PIN: 'D5', STATE: 'OFF' } }, wait(30)], no: [{ type: 'board_pump', fields: { PIN: 'D5', STATE: 'OFF' } }] },
      { condition: { type: 'board_access_allowed' }, yes: [servo(90), digital('D5', 'HIGH')], no: [servo(0), digital('D5', 'LOW'), alarm('ON')] },
      { sequence: [{ type: 'board_wireless_send' }, wait(5)], repeat: true },
      { sequence: [servo(10), wait(1), servo(55), wait(1), servo(100), wait(1), servo(35), wait(1), servo(10)] },
      { condition: { type: 'board_pir_sensor', fields: { PIN: 'D2' } }, yes: [digital('D5', 'HIGH'), alarm('ON')], no: [digital('D5', 'LOW'), alarm('OFF')] },
      { condition: compare({ type: 'board_ultrasonic', fields: { TRIG: 'D10', ECHO: 'D11' } }, 'LT', 20), yes: [drive('stop'), wait(.25), drive('right')], no: [drive('forward')] }
    ];
    const spec = programs[index] || programs[0];
    const root = makeProgramBlock(hardwarePreviewWorkspace, { type: 'board_whenstart' });
    let tail = root;
    if (spec.sequence && spec.repeat) {
      const loop = makeProgramBlock(hardwarePreviewWorkspace, { type: 'board_forever' });
      joinNext(root, loop); tail = loop;
      spec.sequence.forEach(item => { const block = makeProgramBlock(hardwarePreviewWorkspace, item); joinNext(tail, block); tail = block; });
    } else if (spec.sequence) {
      spec.sequence.forEach(item => { const block = makeProgramBlock(hardwarePreviewWorkspace, item); joinNext(tail, block); tail = block; });
    } else {
      const loop = makeProgramBlock(hardwarePreviewWorkspace, { type: 'board_forever' });
      joinNext(root, loop);
      if (spec.condition) {
        const decision = makeIfElse(hardwarePreviewWorkspace, spec.condition, spec.yes, spec.no);
        joinNext(loop, decision);
      } else {
        spec.sequence?.forEach(item => { const block = makeProgramBlock(hardwarePreviewWorkspace, item); joinNext(tail, block); tail = block; });
      }
    }
    root.moveBy(18, 18);
    Blockly.svgResize(hardwarePreviewWorkspace);
    container.dataset.rendered = 'true';
    return hardwarePreviewWorkspace;
  }

  function renderUpperHardwareProgram(container, index) {
    if (!container || !window.Blockly) return;
    defineHardwarePreviewBlocks();
    if (hardwarePreviewWorkspace) hardwarePreviewWorkspace.dispose();
    hardwarePreviewWorkspace = Blockly.inject(container, { renderer: 'zelos', theme, readOnly: true, sounds: false, move: { scrollbars: false, drag: false, wheel: false }, zoom: { controls: false, wheel: false, pinch: false }, trashcan: false });
    const wait = seconds => ({ type: 'board_wait_sec', values: { SECS: { type: 'math_number', fields: { NUM: seconds } } } });
    const servo = angle => ({ type: 'board_servo', fields: { PIN: 'D9' }, values: { ANGLE: { type: 'math_number', fields: { NUM: angle } } } });
    const drive = direction => ({ type: 'board_drive', fields: { DIR: direction, L1: 'D4', L2: 'D5', LEN: 'D6', R1: 'D7', R2: 'D8', REN: 'D9' } });
    const alarm = state => ({ type: 'board_alarm', fields: { PIN: 'D6', STATE: state } });
    const programs = [
      { loop: true, blocks: [{ type: 'board_pid_follow', values: { KP: { type: 'math_number', fields: { NUM: .8 } }, KI: { type: 'math_number', fields: { NUM: 0 } }, KD: { type: 'math_number', fields: { NUM: .15 } } } }, wait(.02)] },
      { loop: true, blocks: [{ type: 'board_navigation_step' }, { type: 'board_record_measurement' }] },
      { blocks: [servo(15), wait(1), servo(55), wait(1), servo(100), wait(1), servo(35), wait(1)] },
      { loop: true, blocks: [{ type: 'board_sample_environment' }, { type: 'board_wireless_send' }, wait(10)] },
      { loop: true, blocks: [{ type: 'board_sort_cycle' }, { type: 'board_record_measurement' }] },
      { loop: true, blocks: [{ type: 'board_greenhouse_cycle' }, wait(5)] },
      { loop: true, condition: { type: 'board_vision_target' }, yes: [{ type: 'board_send_robot_command' }], no: [drive('stop')] },
      { loop: true, blocks: [{ type: 'board_telemetry' }, { type: 'board_send_robot_command' }, wait(1)] },
      { loop: true, blocks: [{ type: 'board_balance_control' }, wait(.01)] },
      { loop: true, blocks: [{ type: 'board_capstone_step' }, { type: 'board_system_check' }, { type: 'board_record_measurement' }] },
      { loop: true, blocks: [{ type: 'board_read_encoder_speed' }, { type: 'board_pid_follow', values: { KP: { type: 'math_number', fields: { NUM: .5 } }, KI: { type: 'math_number', fields: { NUM: .02 } }, KD: { type: 'math_number', fields: { NUM: 0 } } } }] },
      { blocks: [{ type: 'board_coordinate_move' }, wait(1), { type: 'board_record_measurement' }] },
      { loop: true, condition: { type: 'board_quality_check' }, yes: [servo(35)], no: [servo(110)], blocks: [{ type: 'board_sort_cycle' }] },
      { blocks: [{ type: 'board_path_plan' }, { type: 'board_navigation_step' }, { type: 'board_record_measurement' }] },
      { loop: true, condition: { type: 'board_system_check' }, yes: [{ type: 'board_capstone_step' }], no: [drive('stop'), alarm('ON')], blocks: [{ type: 'board_telemetry' }] }
    ];
    const spec = programs[index] || programs[0];
    const root = makeProgramBlock(hardwarePreviewWorkspace, { type: 'board_whenstart' });
    if (spec.loop) {
      const loop = makeProgramBlock(hardwarePreviewWorkspace, { type: 'board_forever' });
      joinNext(root, loop);
      if (spec.condition) {
        const decision = makeIfElse(hardwarePreviewWorkspace, spec.condition, spec.yes || [], spec.no || []);
        joinNext(loop, decision);
        let tail = decision;
        (spec.blocks || []).forEach(item => { const block = makeProgramBlock(hardwarePreviewWorkspace, item); joinNext(tail, block); tail = block; });
      } else {
        let tail = loop;
        (spec.blocks || []).forEach(item => { const block = makeProgramBlock(hardwarePreviewWorkspace, item); joinNext(tail, block); tail = block; });
      }
    } else {
      let tail = root;
      spec.blocks.forEach(item => { const block = makeProgramBlock(hardwarePreviewWorkspace, item); joinNext(tail, block); tail = block; });
    }
    root.moveBy(18, 18);
    Blockly.svgResize(hardwarePreviewWorkspace);
    container.dataset.rendered = 'true';
    return hardwarePreviewWorkspace;
  }

  function clearHardwareProgram() {
    if (!hardwarePreviewWorkspace) return;
    hardwarePreviewWorkspace.dispose();
    hardwarePreviewWorkspace = null;
  }

  window.blockPreview = { start, reset, loadPreset, addBlock, renderHardwareProgram, renderLowerHardwareProgram, renderUpperHardwareProgram, clearHardwareProgram, resize: () => workspace && Blockly.svgResize(workspace) };
})();
