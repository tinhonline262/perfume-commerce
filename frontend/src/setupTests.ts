import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import {configure} from "enzyme";
configure({ adapter: new Adapter() });

window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
});

// Mock import.meta.env for Jest
jest.mock('babel-plugin-transform-import-meta', () => {}, { virtual: true });
Object.defineProperty(global, 'import', {
    value: {
        meta: {
            env: {
                VITE_API_BASE_URL: 'http://localhost:8080',
                VITE_RECAPTCHA_SITE_KEY: 'test-key'
            }
        }
    }
});
