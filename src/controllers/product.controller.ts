import { Request, Response } from 'express';
import GetProductsPageDto from '../payloads/dto/getProductPage.dto';
import { ProductService } from '../services/product.service';

export class ProductController {
    
    // GET V1
    static getProducts(req: Request, res: Response) {
        console.log(req);
        var {minStock, maxStock, minPrice, maxPrice} = req.params;
        
        var dto: GetProductsPageDto = {
            maxPrice : parseFloat(maxPrice) ?? 0,
            maxStock : parseFloat(maxStock) ?? 0,
            minPrice: parseFloat(minPrice) ?? 0,
            minStock : parseFloat(minStock) ?? 0,
        };
        
        res.send(ProductService.getAllProducts(dto));
    }

    // GET V2
    static getProductsV2(req: Request, res: Response) {
        console.log(req);
        var {minStock, maxStock, minPrice, maxPrice} = req.params;
        
        var dto: GetProductsPageDto = {
            maxPrice : parseFloat(maxPrice) ?? 0,
            maxStock : parseFloat(maxStock) ?? 0,
            minPrice: parseFloat(minPrice) ?? 0,
            minStock : parseFloat(minStock) ?? 0,
        };
        
        res.send(ProductService.getAllProductsV2(dto));
    }
}
