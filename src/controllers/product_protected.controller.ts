import { Request, Response } from 'express';
import { ProductService } from "../services/product.service"
import { IProduct } from '../interfaces/product.interface';

export class ProtectedProductController {

    // DELETE V1
    static async deleteProduct(req: Request, res: Response) {
        var id: number = req.body.id;
        var resObject = await ProductService.deleteProductById(id);

        return res.status(resObject.code).json({message: resObject.message})
    }

    // DELETE V2
    static async deleteProductV2(req: Request, res: Response) {
        var id: string = req.body.id;
        var resObject = await ProductService.deleteProductByIdV2(id);

        return res.status(resObject.code).json({message: resObject.message})
    }

    // PUT V1
    static async updateProduct(req: Request, res: Response) {
        var product : IProduct = {
            _id: req.body._id,
            description: req.body.description,
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity
        };

        let resObject = await ProductService.updateProduct(product);
        return res.status(resObject.code).json(resObject);
    }

    // PUT V2
    static async updateProductV2(req: Request, res: Response) {
        try {
            var product : IProduct = {
                _id: req.body._id,
                description: req.body.description,
                name: req.body.name,
                price: req.body.price,
                quantity: req.body.quantity
            };

            let resObject = await ProductService.updateProductV2(product);
            return res.status(resObject.code).json(resObject);
        } catch(e) {
            return res.status(500).json({"message": "error updating product try again later."});
        }
    }

    // POST V1
    static async createProduct(req: Request, res: Response) {
        var product : IProduct = {
            _id: req.body._id,
            description: req.body.description,
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity
        };

        let resObject = await ProductService.create(product);
        return res.status(resObject.code).json(resObject);
    }

    // POST V2
    static async createProductV2(req: Request, res: Response) {
        try {
            var product : IProduct = {
                _id: req.body._id,
                description: req.body.description,
                name: req.body.name,
                price: req.body.price,
                quantity: req.body.quantity
            };

            let resObject = await ProductService.updateProductV2(product);
            return res.status(resObject.code).json(resObject);
        } catch(e) {
            return res.status(500).json({"message": "error updating product try again later."});
        }
    }
}
