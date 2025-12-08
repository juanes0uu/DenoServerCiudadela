// deno-lint-ignore-file
// controllers/login.ts
// import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { SignJWT } from "https://esm.sh/jose@4.14.4";
import { Usuario } from "../Models/usuarioModel.ts";
import { JWT_SECRET } from "../config.ts";
import type { RouterContext } from "../Dependencies/deps.ts";

export const login = async (ctx: RouterContext<"/login">) => {
    const { request, response } = ctx;
    try {
        const body = await request.body.json();
        console.log("📥 Datos recibidos en /login:", body);

        const { Email, Password } = body;

        if (!Email || !Password) {
            response.status = 400;
            response.body = { message: "Email y password son obligatorios." };
            return;
        }

        const usuarioModel = new Usuario();
        const user = await usuarioModel.findUserByEmail(Email);

        if (!user) {
            response.status = 401;
            response.body = { message: "Credenciales inválidas." };
            return;
        }

        const validPassword = await compare(Password, user.Password);

        if (!validPassword) {
            response.status = 401;
            response.body = { message: "CONTRASEÑA DIFERENTE." };
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

        response.status = 200;
        response.body = {
            message: "Login exitoso",
            token,
            user: {
                id: user.IdUsuario,
                nombre: user.Nombre,
                email: user.Email,
                rol: user.IdRol
            }
        };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, message: "Error en login" };
    }
};
