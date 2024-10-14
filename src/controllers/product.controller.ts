import { Request, Response } from 'express';
import GetProductsPageDto from '../payloads/dto/getProductPage.dto';
import { ProductService } from '../services/product.service';
import { logger } from '../utils/logger';
import { log } from 'console';

export class ProductController {
    static getProducts(req: Request, res: Response) {
        
        var dto: GetProductsPageDto = {
            maxPrice: req.query.maxPrice as string,
            minPrice: req.query.minPrice as string,
            minStock: req.query.minStock as string,
            maxStock: req.query.maxStock as string,
        }

        logger.info(`getting page from : minPrice ${dto.minPrice} | maxPrice ${dto.maxPrice} | minStock ${dto.minStock} | maxStock ${dto.maxStock}`);

        ProductService.getAllProducts(dto)
            .then(resObj => {
                logger.info(resObj);
                res.send(resObj).status(200);
            })
            .catch(e => {
                logger.error("Error GETTING products.");
                res.send("Error GETTING products.").status(400);
            });        
    }
}
