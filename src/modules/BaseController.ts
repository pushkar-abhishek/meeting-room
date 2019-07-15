import {Application, Router } from 'express';

/**
 * BaseCotroller
 */
export abstract class BaseCotroller {

    protected router: Router;
    protected constructor() {
        this.router =  Router();
    }

    public abstract register(express: Application): void;
}
