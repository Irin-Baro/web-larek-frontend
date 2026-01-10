/**
 * Точка входа в приложение
 */
import { App } from './app/App';
import './scss/styles.scss';

const app = new App();

document.addEventListener('DOMContentLoaded', () => {
    app.start();
});

declare global {
    interface Window {
        app: App;
    }
}

window.app = app;