import express, {Request, Response} from 'express';
import fs from 'fs'
import morgan from 'morgan'
import path from 'path';
import { UserRouter } from './routes/userRoute';
import { AuthRouter } from './routes/authRoute';
import { OrganisationRouter } from './routes/organisationRoute';

const app = express();
const port = process.env.PORT || 3000;

//Parser middleware
app.use(express.json())

//logs
const writeStream = fs.createWriteStream(path.join('./', "access.log"), {flags:"a"})
app.use(morgan(":date - :method - :url - :status - :response-time ms", {stream: writeStream}))

app.get('/', (req:Request, res:Response) => {
  res.send('Hello, TypeScript!');
});

// Routes
app.use('/auth', AuthRouter)
app.use('/api', UserRouter)
app.use('/api', OrganisationRouter)


app.listen(port,() => {
  console.log(`App Listening on http://localhost:${port}`);
});
