// routes/loginRouter.ts
import { Router } from "../Dependencies/deps.ts";
import { login } from "../Controllers/login.ts";

const loginRouter = new Router();

loginRouter
    .post("/login", login);

export { loginRouter };
