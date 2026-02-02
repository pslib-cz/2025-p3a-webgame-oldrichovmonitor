import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

export default defineConfig(({ command, mode }) => {
    const isDev = command === 'serve';

    let httpsConfig: any = undefined;

    if (isDev) {
        const baseFolder =
            process.env.APPDATA && process.env.APPDATA !== ''
                ? `${process.env.APPDATA}/ASP.NET/https`
                : `${process.env.HOME}/.aspnet/https`;

        const certificateName = 'swing.client';
        const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
        const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

        if (!fs.existsSync(baseFolder)) {
            fs.mkdirSync(baseFolder, { recursive: true });
        }

        if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
            const result = child_process.spawnSync(
                'dotnet',
                [
                    'dev-certs',
                    'https',
                    '--export-path',
                    certFilePath,
                    '--format',
                    'Pem',
                    '--no-password',
                ],
                { stdio: 'inherit' }
            );

            if (result.status !== 0) {
                throw new Error('Could not create HTTPS certificate');
            }
        }

        httpsConfig = {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        };
    }

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        server: isDev
            ? {
                proxy: {
                    '^/api': {
                        target: 'http://localhost:5143',
                        changeOrigin: true,
                        secure: false,
                    },
                },
                port: Number(process.env.DEV_SERVER_PORT || 54657),
                https: httpsConfig,
            }
            : undefined,
    };
});
