// Oak (servidor HTTP)
export { Application, Router, Context } from "https://deno.land/x/oak@v17.1.5/mod.ts";
export type { RouterContext } from "https://deno.land/x/oak@v17.1.5/mod.ts";

// CORS (permitir peticiones desde React u otro frontend)
export { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

// MySQL (conector BD)
export { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";

// Validaciones con Zod
export { z } from "https://deno.land/x/zod@v3.24.4/mod.ts";