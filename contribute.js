import marked, { setOptions } from 'marked';
import TerminalRenderer from 'marked-terminal';

setOptions({
  // Define custom renderer
  renderer: new TerminalRenderer()
});

// Show the parsed data
console.log(marked('# Hello \n This is **markdown** printed in the `terminal`'));