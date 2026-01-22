export const $ = (selector: string): HTMLElement | null => {
	return document.querySelector(selector);
}

export const $$ = (selector: string): NodeListOf<HTMLElement> => {
	return document.querySelectorAll(selector);
}

export const createElement = <K extends keyof HTMLElementTagNameMap>(
	tag: K,
	props?: Partial<HTMLElementTagNameMap[K] & { class?: string; text?: string }>,
	children?: (HTMLElement | string)[]
): HTMLElementTagNameMap[K] => {
	const element = document.createElement(tag);

	if (props) {
		Object.entries(props).forEach(([key, value]) => {
			if (key === 'class') {
				element.className = value as string;
			} else if (key === 'text') {
				element.textContent = value as string;
			} else {
				(element as any)[key] = value;
			}
		});
	}

	if (children) {
		children.forEach((child) => {
			if (typeof child === 'string') {
				element.appendChild(document.createTextNode(child));
			} else {
				element.appendChild(child);
			}
		});
	}

	return element;
}

export const clearElement = (element: HTMLElement): void => {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

export const setAttributes = (
	element: HTMLElement,
	attributes: Record<string, string>
): void => {
	Object.entries(attributes).forEach(([key, value]) => {
		element.setAttribute(key, value);
	})
}