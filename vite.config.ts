import { sveltekit } from "@sveltejs/kit/vite";
import browserslist from "browserslist";
import { FontaineTransform } from "fontaine";
import { browserslistToTargets } from "lightningcss";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		sveltekit(),
		FontaineTransform.vite({
			fallbacks: [
				"BlinkMacSystemFont",
				"Segoe UI",
				"Arial",
				"Noto Sans",
				"Roboto"
			]
		})
	],
	css: {
		transformer: "lightningcss",
		lightningcss: {
			targets: browserslistToTargets(browserslist([">= 0.25%", "not dead"]))
		}
	},
	build: {
		cssMinify: "lightningcss"
	}
});
