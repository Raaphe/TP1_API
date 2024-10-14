import { Request, Response } from 'express';
import { ProductService } from "../services/product.service"
import { logger } from '../utils/logger';
import { Product } from '../models/product.model';

export class ProtectedProductController {

    static async updateProduct(req: Request, res: Response) {
        var id = parseInt(req.url.split("/").at(-1) ?? "-1");
        try {
            const resp = await ProductService.updateProduct(new Product(id, req.body.name, req.body.price, req.body.description, req.body.quantity));
            return res.status(resp.code).json({ message: resp.message });
        } catch (e) {
            return res.status(400).json({ message: e });
        }
    }

    static async createProduct(req: Request, res: Response) {
        try {
            const resp = await ProductService.createProduct(new Product(-1, req.body.name, req.body.price, req.body.description, req.body.quantity));
            return res.status(resp.code).json({ message: resp.message });
        } catch (e) {
            return res.status(400).json({ message: e });
        }
    }

    static async deleteProduct(req: Request, res: Response) {
        try {
            var id = parseInt(req.url.split("/").at(-1) ?? "-1");
            logger.info("\nDeleting product: " + id);
            var resObject = ProductService.deleteProductById(id);
            return res.status(resObject.code).json({message: resObject.message})
        } catch (exception) {
            return res.status(400).json({message: "bad request"});
        }
    }
}
