import { Request, Response } from 'express';
import GetProductsPageDto from '../payloads/dto/getProductPage.dto';
import { ProductService } from '../services/product.service';

export class ProductController {
    static getProducts(req: Request, res: Response) {
        console.log(req);
        var dto: GetProductsPageDto = {
            pageNumber: 1,
            pageSize: 10
        }
        res.send(ProductService.getAllProducts(dto));
    }
}
