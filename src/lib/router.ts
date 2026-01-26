type RouteHandler = () => void | Promise<void>;

interface Route {
	path: string;
	handler: RouteHandler;
}

class Router {
	private routes: Route[] = [];
	private currentPath: string = '';

	constructor() {
		window.addEventListener('popstate', () => this.handleRoute());
		document.addEventListener('click', (e) => this.handleLinkClick(e));
	}

	public route(path: string, handler: RouteHandler): void {
		this.routes.push({ path, handler })
	}

	public navigate(path: string): void {
		window.history.pushState({}, '', path);
		this.handleRoute();
	}

	private handleRoute(): void {
		const path = window.location.pathname;
		this.currentPath = path;

		// Ищет текущий роут в массиве routes, если есть возвращает его
		const route = this.routes.find((r) => this.matchRoute(r.path, path));

		if (route) {
			route.handler();
		} else {
			this.navigate('/');
		}
	}

	private matchRoute(routePath: string, actualPath: string): boolean {
		const routeParts = routePath.split('/').filter(Boolean);
		const actualParts = actualPath.split('/').filter(Boolean);

		if (routeParts.length !== actualParts.length) {
			return false;
		}

		return routeParts.every((part, i) => {
			return part.startsWith(':') || part === actualParts[i];
		})
	}

	private handleLinkClick(e: MouseEvent): void {
		const target = e.target as HTMLElement;
		const link = target.closest('a[data-link]');

		if (link && link instanceof HTMLAnchorElement) {
			e.preventDefault();
			const href = link.getAttribute('href');
			if (href) {
				this.navigate(href);
			}
		}
	}

	public start(): void {
		this.handleRoute();
	}

	public getCurrentPath(): string {
		return this.currentPath;
	}
}

export const router = new Router();