import { Request, Response } from 'express';
import { ProductService } from "../services/product.service"

export class ProtectedProductController {
    static async deleteProduct(req: Request, res: Response) {
        var id: number = req.body.id;
        var resObject = await ProductService.deleteProductById(id);

        return res.status(resObject.code).json({message: resObject.message})
    }
}
