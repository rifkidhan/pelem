// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			preference: {
				lang: string;
				region: {
					code: string;
					name: string;
					timezone: string;
				};
			};
		}
		interface PageData {
			meta?: {
				title?: string;
				description?: string;
			};
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
