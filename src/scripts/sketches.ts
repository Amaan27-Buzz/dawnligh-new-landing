import gsap from 'gsap';
function animateUpdate(element: Element | null): void {
  if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  element.animate([{ opacity: .55 }, { opacity: 1 }], { duration: 250, easing: 'ease-out' });
}

const examples = [
  { request: 'Find the five biggest files in this folder.', command: 'find . -type f -exec du -h {} + | sort -rh | head -5', explanation: 'Find files below this folder, measure their sizes, sort largest first, and show five results.' },
  { request: 'Show me what is in this folder, including hidden files.', command: 'ls -lah', explanation: 'List the contents of the current folder, including hidden files, with sizes and details. This does not modify any files.' },
  { request: 'Show the five most recent commits.', command: 'git log -5 --oneline', explanation: 'Read the five most recent commits in this repository, with a short identifier and message for each. This does not change Git history.' },
];

export function setupSketches(): void {
  document.querySelectorAll<HTMLElement>('[data-sketch]').forEach(sketch => {
    const toggle = sketch.querySelector<HTMLButtonElement>('[data-worker-toggle]');
    const review = sketch.querySelector<HTMLElement>('[data-worker-review]');
    toggle?.addEventListener('click', () => {
      if (!review) return;
      const open = toggle.getAttribute('aria-pressed') !== 'true';
      toggle.setAttribute('aria-pressed', String(open));
      toggle.textContent = open ? 'Back to the Workers' : 'Review the plan';
      review.hidden = !open;
      animateUpdate(open ? review : sketch.querySelector('.coordination__workers'));
    });

    const voice = sketch.querySelector<HTMLElement>('[data-voice-mode]');
    if (voice) setupVoiceFlow(sketch, voice);
    sketch.querySelectorAll<HTMLButtonElement>('[data-voice]').forEach(button => {
      button.addEventListener('click', () => {
        if (!voice) return;
        const speak = button.dataset.voice === 'speak';
        voice.dataset.voiceMode = speak ? 'speak' : 'listen';
        sketch.querySelectorAll<HTMLButtonElement>('[data-voice]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        const input = sketch.querySelector<HTMLElement>('[data-voice-input]');
        const output = sketch.querySelector<HTMLElement>('[data-voice-output]');
        const description = sketch.querySelector<HTMLElement>('[data-voice-description]');
        if (input) input.textContent = speak ? '“A little closer.”' : 'Speech in';
        if (output) output.textContent = speak ? 'Speech out' : '“A little closer.”';
        animateUpdate(output);
        if (description) description.textContent = speak ? 'A shared runtime for the path from text to speech.' : 'Different voice models. One path from speech to text.';
      });
    });

    const request = sketch.querySelector<HTMLElement>('[data-shell-request]');
    const command = sketch.querySelector<HTMLElement>('[data-shell-command]');
    const explanation = sketch.querySelector<HTMLElement>('[data-shell-explanation]');
    const status = sketch.querySelector<HTMLElement>('[data-shell-status]');
    const explainButton = sketch.querySelector<HTMLButtonElement>('[data-shell-action="explain"]');
    sketch.querySelectorAll<HTMLButtonElement>('[data-shell-example]').forEach(button => {
      button.addEventListener('click', () => {
        const example = examples[Number(button.dataset.shellExample)];
        if (!example || !request || !command || !explanation || !status) return;
        request.textContent = example.request;
        command.textContent = example.command;
        animateUpdate(command);
        explanation.textContent = example.explanation;
        explanation.hidden = true;
        explainButton?.setAttribute('aria-expanded', 'false');
        status.textContent = 'A proposed command. You decide what runs.';
        sketch.querySelectorAll<HTMLButtonElement>('[data-shell-example]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      });
    });
    sketch.querySelectorAll<HTMLButtonElement>('[data-shell-action]').forEach(button => {
      button.addEventListener('click', () => {
        if (!status) return;
        if (button.dataset.shellAction === 'explain' && explanation) {
          explanation.hidden = !explanation.hidden;
          button.setAttribute('aria-expanded', String(!explanation.hidden));
        } else {
          status.textContent = button.dataset.shellAction === 'approve' ? 'Approved in this example. Nothing is executed.' : 'Dismissed. Nothing was executed.';
          animateUpdate(status);
        }
      });
    });
    setupCircuit(sketch);
  });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-paused', !entry.isIntersecting)), { threshold: 0 });
  document.querySelectorAll('[data-sketch]').forEach(scene => observer.observe(scene));
  document.addEventListener('visibilitychange', () => {
    document.querySelectorAll<HTMLElement>('[data-sketch] *').forEach(element => {
      element.style.animationPlayState = document.hidden ? 'paused' : '';
    });
  });
}

function setupCircuit(sketch: HTMLElement): void {
  const board = sketch.querySelector<HTMLElement>('.circuit-sketch');
  const wire = sketch.querySelector<SVGPathElement>('[data-wire]');
  if (!board || !wire) return;
  const nodes = Array.from(board.querySelectorAll<HTMLButtonElement>('[data-part]')).map(element => ({
    element, x: Number(element.dataset.x), y: Number(element.dataset.y),
  }));
  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
  const draw = () => {
    nodes.forEach(node => { node.element.style.left = node.x * 100 + '%'; node.element.style.top = node.y * 100 + '%'; });
    const [cell, resistor, led] = nodes;
    if (!cell || !resistor || !led) return;
    wire.setAttribute('d', 'M' + cell.x * 1000 + ' ' + cell.y * 600 + ' V' + resistor.y * 600 + ' H' + resistor.x * 1000 + ' H' + led.x * 1000 + ' V' + led.y * 600 + ' H' + cell.x * 1000 + ' Z');
    const marker = board.querySelector<HTMLElement>('.circuit-mark');
    if (marker) { marker.style.left = led.x * 100 + '%'; marker.style.top = led.y * 100 + '%'; }
  };
  nodes.forEach(node => {
    node.element.disabled = false;
    let dragging = false;
    let dx = 0, dy = 0;
    node.element.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      const bounds = node.element.getBoundingClientRect();
      dx = event.clientX - (bounds.left + bounds.width / 2);
      dy = event.clientY - (bounds.top + bounds.height / 2);
      dragging = true;
      node.element.setPointerCapture(event.pointerId);
    });
    node.element.addEventListener('pointermove', event => {
      if (!dragging) return;
      const bounds = board.getBoundingClientRect();
      node.x = clamp((event.clientX - bounds.left - dx) / bounds.width, .13, .87);
      node.y = clamp((event.clientY - bounds.top - dy) / bounds.height, .16, .74);
      draw();
    });
    const end = () => { dragging = false; };
    node.element.addEventListener('pointerup', end);
    node.element.addEventListener('pointercancel', end);
    node.element.addEventListener('lostpointercapture', end);
    node.element.addEventListener('keydown', event => {
      const movement: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      const direction = movement[event.key];
      if (!direction) return;
      event.preventDefault();
      node.x = clamp(node.x + direction[0] * 24 / board.clientWidth, .13, .87);
      node.y = clamp(node.y + direction[1] * 24 / board.clientHeight, .16, .74);
      draw();
      const status = board.querySelector<HTMLElement>('[data-circuit-status]');
      if (status) status.textContent = node.element.dataset.part + ' moved. Connections updated.';
    });
  });
  draw();
}

function setupVoiceFlow(sketch: HTMLElement, voice: HTMLElement): void {
  const paths = [...sketch.querySelectorAll<SVGPathElement>('.voice-path')];
  const resting = paths.map(path => path.getAttribute('d')!);
  const speech = sketch.querySelector<SVGPathElement>('.voice-speech');
  const restingSpeech = speech?.getAttribute('d') ?? '';
  const packets = [...sketch.querySelectorAll<SVGCircleElement>('.voice-packet')];
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    let visible = false, running = false, elapsed = 0;
    let blend = voice.dataset.voiceMode === 'speak' ? 1 : 0;
    const render = (_time: number, delta: number) => {
      const dt = Math.min(delta / 1000, .05);
      elapsed += dt;
      blend += ((voice.dataset.voiceMode === 'speak' ? 1 : 0) - blend) * (1 - Math.exp(-dt * 5));
      const inputY = (x: number, index: number) => {
        const taper = (1 - x / 500) ** 2;
        const amplitude = (28 - blend * 20) * (1 + index * .12);
        return 160 + (index - 1.5) * 65 * taper + Math.sin(x * .025 + elapsed * (2 + index * .35) + index) * amplitude * taper;
      };
      paths.forEach((path, index) => {
        let d = '';
        for (let x = 0; x <= 500; x += 10) d += `${x ? 'L' : 'M'}${x} ${inputY(x, index).toFixed(2)} `;
        path.setAttribute('d', d);
        const packet = packets[index];
        if (packet) {
          const x = (elapsed * (70 - blend * 25) + index * 115) % 500;
          packet.setAttribute('cx', String(x));packet.setAttribute('cy', String(inputY(x, index)));
          packet.style.opacity = String(Math.sin(Math.PI * x / 500));
        }
      });
      if (speech) {
        let d = '';
        for (let x = 500; x <= 1000; x += 5) {
          const envelope = (.5 + .5 * Math.sin(x * .012 - elapsed * 2.1)) * (.5 + .5 * Math.sin(x * .031 - elapsed * 3.3 + 1));
          const y = 160 + Math.sin(x * .09 - elapsed * 9) * envelope * 52 * blend * Math.min(1, (x - 500) / 70);
          d += `${x === 500 ? 'M' : 'L'}${x} ${y.toFixed(2)} `;
        }
        speech.setAttribute('d', d);
      }
    };
    const sync = () => {
      const active = visible && !document.hidden;
      if (active === running) return;
      running = active;
      if (active) gsap.ticker.add(render); else gsap.ticker.remove(render);
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
    observer.observe(sketch);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();gsap.ticker.remove(render);document.removeEventListener('visibilitychange', sync);
      paths.forEach((path, index) => path.setAttribute('d', resting[index]));
      speech?.setAttribute('d', restingSpeech);
      packets.forEach(packet => { packet.style.opacity = '';packet.removeAttribute('cx');packet.removeAttribute('cy'); });
    };
  });
}
