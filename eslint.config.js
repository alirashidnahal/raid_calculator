import js from '@eslint/js';

export default [
    {
        ignores: ['dist/**', 'node_modules/**', 'public/**', '.agents/**', '.codex/**'],
    },
    {
        files: ['assets/main.js', 'vite.config.js'],
        ...js.configs.recommended,
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: Object.fromEntries(
                [
                    'window',
                    'document',
                    'navigator',
                    'MediaRecorder',
                    'RTCPeerConnection',
                    'Audio',
                    'Blob',
                    'File',
                    'URL',
                    'localStorage',
                    'AbortController',
                    'fetch',
                    'setTimeout',
                    'clearTimeout',
                    'setImmediate',
                    'queueMicrotask',
                ].map((name) => [name, 'readonly'])
            ),
        },
    },
];
