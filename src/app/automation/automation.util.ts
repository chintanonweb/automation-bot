export function predictElements(selectedElements: Set<HTMLElement>): HTMLElement[] {
    const selectedElementsArray = [...selectedElements.values()];
  
    const similar = selectedElementsArray.map(el => getSimilarElements(el));
    const predictedSet = new Set(similar.flat());
    selectedElements.forEach(el => predictedSet.delete(el));
  
    const predicted = Array.from(predictedSet);
  
    return predicted;
  }
  
  function getSimilarElements(el: HTMLElement): HTMLElement[] {
    let parent = el.parentElement;
    let selectors = [];
    while (parent) {
      const parentSelector = getElementSelector(parent);
  
      selectors.unshift(parentSelector);
      parent = parent.parentElement;
    }
  
    selectors.push(getElementSelector(el));
    const path = selectors.join(' ');
  
    const similarNodes = el.ownerDocument.querySelectorAll(path);
  
    const similarElements: HTMLElement[] = [];
    similarNodes.forEach((node) => similarElements.push(node as HTMLElement));
  
    return similarElements;
  }
  
  function getElementSelector(el: HTMLElement): string {
    const classSelector = el.classList.value
      .replace('selected', '')
      .replace('predicted', '')
      .replace('highlighted', '')
      .trim()
      .replaceAll(/\s+/g, '.')
  
    const selector = el.nodeName + (classSelector.length ? '.' : '') + classSelector;
  
    return selector;
  }