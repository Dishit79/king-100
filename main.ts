import { opine, serveStatic, urlencoded, Router, raw } from "https://deno.land/x/opine/mod.ts";
import { dirname, join } from "https://deno.land/x/opine/deps.ts";
import { Database } from 'https://deno.land/x/aloedb/mod.ts';
import { renderFile } from "https://deno.land/x/eta/mod.ts";


const app = opine()
const port = 5000
const __dirname = dirname(import.meta.url);

app.engine(".html", renderFile);
app.set("view engine", "html");

// Structure of stored documents
interface StoreDB {
    year: string
    yearName: string
    points: number
    recentAddtion: string
    type: number
}
// Initialization
const db = new Database<StoreDB>('points.json');


export async function setPoints(year: string, points: number) {
    const storeData = await db.updateOne({ year: year }, { points: points, recentAddtion: `+${points}` });
    return storeData
}

export async function getManyYears() {
    const storeData = await db.findMany({ type: 1 });
    return storeData
}


app.set("view cache", false)
app.set('trust proxy', true)
app.use(urlencoded());


app.post("/set/:year", async (req, res) => {

    let update = await setPoints(req.params.year, req.body.points)
    res.send(update)
})

app.get("/get/years", async (req, res) => {

    let update = await getManyYears()
    res.send(update)
})

app.get("/", async (req, res) => {
    res.render("index")
})

app.get("/points", async (req, res) => {
    const points = await getManyYears()
    res.render("points", {points: points} )
})

app.get("/admin", async (req, res) => {
    const points = await getManyYears()
    res.render("test", { points: points })
})

app.listen(port);
console.log(`Opine started on localhost:${port}`)

