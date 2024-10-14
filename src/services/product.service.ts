import ResponseObject from "../interfaces/response.interface";
import GetProductsPageDto from "../payloads/dto/getProductPage.dto";
import { ModelContext } from "../models/ModelContext"
import { logger } from "../utils/logger";
import { Product } from "../models/product.model";

export class ProductService {

    static async createProduct(product: Product) : Promise<ResponseObject> {
        try {
            const _res = await ModelContext.saveProduct(product);
            return { code: 201, message: "Successfully created product" };
        } catch (_e) {
            return { code: 400, message: "Bad Request" };
        }
    }
    
    static async updateProduct(product: Product) : Promise<ResponseObject> {
        var concreteProduct = ModelContext.getProductById(product.id);

        if (concreteProduct === undefined) {
            return {code: 404, "message": "product not found."}
        }

        await ModelContext.saveProduct(product);
        return {code: 200, "message": "Successfully update product."}
    }

    static async getAllProducts(dto: GetProductsPageDto) {
        let products = ModelContext.getAllProducts();
    
        logger.info(products);
    
        // Filter by maxPrice if provided
        if (dto.maxPrice !== undefined) {
            products = products.filter(p => p.price <= parseFloat(dto.maxPrice));
        }
    
        // Filter by minPrice if provided
        if (dto.minPrice !== undefined) {
            products = products.filter(p => p.price >= parseFloat(dto.minPrice));
        }
    
        // Filter by minStock if provided
        if (dto.minStock !== undefined) {
            products = products.filter(p => p.quantity >= parseFloat(dto.minStock));
        }
    
        // Filter by maxStock if provided
        if (dto.maxStock !== undefined) {
            products = products.filter(p => p.quantity <= parseFloat(dto.maxStock));
        }
    
        return products;
    }
    

    static deleteProductById(id: number) : ResponseObject {
        
        if (id === -1) {
            return {code: 400, message: "Incorrect URL parameter." }
        }

        var product = ModelContext.getProductById(id);

        if (product === undefined) {
            return {code: 404, "message": "No such product exists."}
        }

        ModelContext.deleteProductById(product.id)
            .then(res => {
                return {
                    code: 204,
                    message: `Item with id ${id} has been deleted.`
                }
            })

        return {
            code: 500,
            message: `Internal Error.`
        }

    }
}
