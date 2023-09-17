import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

import helmet from 'helmet';
import express from 'express';
import bcrypt from 'bcryptjs';
import { Server } from "socket.io";
import compression from 'compression';
import { instrument } from '@socket.io/admin-ui';

const __dirname = path.resolve();

export const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
app.use(helmet());

const expressServer = app.listen(process.env.PORT || 3000, () => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
    }
});

export const io = new Server(expressServer, {
    cors: {
        origin: [process.env.CORS_ORIGIN, `http://localhost:${process.env.PORT}`],
        allowedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials'],
        credentials: true,
    }
});

if (process.env.NODE_ENV === 'development') {
    const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
    instrument(io, {
        auth: {
            type: "basic",
            username: "admin",
            password: hashedPassword
        },
        mode: "development",
    });

    const adminApp = express();
    adminApp.use(express.static('./node_modules/@socket.io/admin-ui/ui/dist'));
    // cors
    adminApp.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", `*`);
        res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
        next();
    });
    adminApp.listen(process.env.ADMIN_PORT, () => {
        console.log(`Admin UI is running on http://localhost:${process.env.ADMIN_PORT}`);
    });
}
