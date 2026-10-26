export function setupWritingArchive(): void {
  const archive = document.querySelector<HTMLElement>('[data-writing-archive]');
  if (!archive) return;
  const search = archive.querySelector<HTMLInputElement>('[data-writing-search]');
  const buttons = archive.querySelectorAll<HTMLButtonElement>('[data-writing-kind]');
  const entries = [...archive.querySelectorAll<HTMLElement>('[data-writing-entry]')];
  let kind = 'All';
  const filter = () => {
    const query = search?.value.trim().toLowerCase() ?? '';
    let count = 0;
    entries.forEach(entry => {
      entry.hidden = (kind !== 'All' && entry.dataset.kind !== kind) || !(entry.textContent ?? '').toLowerCase().includes(query);
      if (!entry.hidden) count++;
    });
    const empty = archive.querySelector<HTMLElement>('[data-writing-empty]');
    const status = archive.querySelector<HTMLElement>('[data-writing-status]');
    if (empty) empty.hidden = count > 0;
    if (status) status.textContent = `${count} ${count === 1 ? 'entry' : 'entries'} shown.`;
  };
  search?.addEventListener('input', filter);
  buttons.forEach(button => button.addEventListener('click', () => {
    kind = button.dataset.writingKind ?? 'All';
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    filter();
  }));
}
