// controllers/login.ts
import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { SignJWT } from "https://esm.sh/jose@4.14.4";
import { Usuario } from "../Models/usuarioModel.ts";
import { JWT_SECRET } from "../config.ts";

export const login = async (ctx: Context) => {
    const body = await ctx.request.body().value;
    console.log("📥 Datos recibidos en /login:", body);

    const { Email, Password } = body;

    if (!Email || !Password) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Email y password son obligatorios." };
        return;
    }

    const usuarioModel = new Usuario();
    const user = await usuarioModel.findUserByEmail(Email);

    if (!user) {
        ctx.response.status = 401;
        ctx.response.body = { message: "Credenciales inválidas." };
        return;
    }

    const validPassword = await compare(Password, user.Password);

    if (!validPassword) {
        ctx.response.status = 401;
        ctx.response.body = { message: "Credenciales inválidas." };
        return;
    }

    const payload = {
        userId: user.IdUsuario,
        email: user.Email,
        rol: user.IdRol,
    };

    const secretKey = typeof JWT_SECRET === 'string' ? new TextEncoder().encode(JWT_SECRET) : JWT_SECRET;

    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .sign(secretKey);

    ctx.response.status = 200;
    ctx.response.body = {
        message: "Login exitoso",
        token,
        user: {
            id: user.IdUsuario,
            nombre: user.Nombre,
            email: user.Email,
            rol: user.IdRol
        }
    };
};
