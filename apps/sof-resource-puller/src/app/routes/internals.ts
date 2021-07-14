import {Express} from "express";


function internalRoutes(app: Express): void {
    app.get("/resource-puller/internal/health", (req, res) => {
        res.send({message: 'Ready'});
    });

    app.get("/resource-puller/internal/health", (req, res) => {
        res.send({message: 'Ready'});
    });

    app.get("/resource-puller/internal/prometheus", (req, res) => {
        res.send("not implemented");
    });
}


export default internalRoutes;
