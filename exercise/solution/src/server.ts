import express, {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {StatusCodes} from "http-status-codes";

const app = express();
const port = 3000;
const key = '🌈🦄secret';

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.status(StatusCodes.OK).send("Please Login!");
});

app.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (username === 'luna' && password === 'glitter123') {
        const user = { name: username };

        const token = jwt.sign(user, key, { expiresIn: '1h' });
        res.status(StatusCodes.CREATED).json({ token: token });
    }

    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Wrong magic word!' });
});

function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    if (!token) {
        res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied for non-members!' });
        return;
    }

    jwt.verify(token, key, (err, user) => {
        if (err) {
            res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid or expired token!' });
            return;
        }

        req.user = user;
        next();
    });
}

app.get('/unicorn-world', verifyToken, (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
        message: `Welcome to the Unicorn Clubhouse, ${req.user.name}! 🦄`,
        secrets: [
            'Unicorns fly on rainbows',
            'Their favorite snack is Glitter Muesli',
            'They can talk to the stars'
        ]
    });
});

app.listen(port, () => {
    console.log(`Unicorn server running on http://localhost:${port}`);
});