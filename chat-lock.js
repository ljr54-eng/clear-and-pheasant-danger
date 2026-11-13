/* Keep the chat composer tied to the currently selected hunter. */
(() => {
  const identityKey = 'pheasant-identity-v2';
  const syncComposer = () => {
    const select = document.getElementById('message-hunter');
    if (!select) return;
    const id = localStorage.getItem(identityKey);
    const option = [...select.options].find(item => item.value === id);
    if (!option) {
      select.closest('label')?.remove();
      return;
    }
    if (select.options.length === 1 && select.value === id && select.hidden) return;
    const name = option.textContent;
    select.replaceChildren(new Option(name, id, true, true));
    select.value = id;
    const label = select.closest('label');
    if (label) {
      label.textContent = 'Posting as ' + name;
      label.append(select);
      select.hidden = true;
      select.setAttribute('aria-hidden', 'true');
      select.tabIndex = -1;
    }
  };
  const observer = new MutationObserver(syncComposer);
  observer.observe(document.getElementById('app'), {childList:true,subtree:true});
  syncComposer();
})();