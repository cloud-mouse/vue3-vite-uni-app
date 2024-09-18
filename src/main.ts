import App from './App.vue';
import 'uno.css';
import { createSSRApp } from 'vue';
//Pinia
import { setupStore } from '@/state';
export function createApp() {
	const app = createSSRApp(App);
	// Configure store
	setupStore(app);
	return {
		app
	};
}
