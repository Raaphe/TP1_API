import { Request, Response } from 'express';
import GetProductsPageDto from '../payloads/dto/getProductPage.dto';
import { ProductService } from '../services/product.service';

export class ProductController {

    // GET V1
    static getProducts(req: Request, res: Response) {
        const { minStock, maxStock, minPrice, maxPrice } = req.query;

        const dto: GetProductsPageDto = {
            maxPrice: maxPrice !== undefined ? parseFloat(maxPrice as string) : Infinity,
            maxStock: maxStock !== undefined ? parseFloat(maxStock as string) : Infinity,
            minPrice: minPrice !== undefined ? parseFloat(minPrice as string) : 0,
            minStock: minStock !== undefined ? parseFloat(minStock as string) : 0,
        };

        let resObject = ProductService.getAllProducts(dto);
        res.status(resObject.code).json(resObject);
    }

    // GET V2
    static async getProductsV2(req: Request, res: Response) {
        const { minStock, maxStock, minPrice, maxPrice } = req.query;

        const dto: GetProductsPageDto = {
            maxPrice: maxPrice !== undefined ? parseFloat(maxPrice as string) : Infinity,
            maxStock: maxStock !== undefined ? parseFloat(maxStock as string) : Infinity,
            minPrice: minPrice !== undefined ? parseFloat(minPrice as string) : 0,
            minStock: minStock !== undefined ? parseFloat(minStock as string) : 0,
        };

        try {
            const resObject = await ProductService.getAllProductsV2(dto);

            res.status(resObject.code).json(resObject);
        } catch (error: any) {
            res.status(500).json({
                code: 500,
                message: `Internal Server Error: ${error.message}`,
                data: [],
            });
        }
    }
}
