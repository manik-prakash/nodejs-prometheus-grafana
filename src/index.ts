import express from 'express';
import client from "prom-client";
import os from 'os';
import {metricsMiddleware} from './metrics/index.js'
const app = express();
app.use(express.json());

app.use(metricsMiddleware);

app.get("/metrics", async (req, res) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
})

app.get('/cpu', async (req, res) => {
    console.log("cpu route.");
    const cpus = os.cpus();
    const load = os.loadavg(); 
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const uptime = os.uptime();
    const processCpu = process.cpuUsage();
    const memoryUsage = process.memoryUsage();

    res.json({
        cpus: cpus.map(({ model, speed, times }) => ({ model, speed, times })),
        loadavg: load,
        totalMem,
        freeMem,
        uptime,
        processCpu,
        memoryUsage
    })
})

app.get("/user", async (req, res) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    res.send({
        name: "John Doe",
        age: 25,
    });
});


app.listen(3000, () => {
    console.log("server is live.");
})
