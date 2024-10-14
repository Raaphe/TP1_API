import ResponseObject from "../interfaces/response.interface";
import GetProductsPageDto from "../payloads/dto/getProductPage.dto";
import axios from 'axios';

export class ProductService {
    static async getAllProducts(dto: GetProductsPageDto) {
        let res = await axios.get("https://api.escuelajs.co/api/v1/products");
        return res.data;
    }

    static deleteProductById(id: number) : ResponseObject {
        // Your logic for deleting the item by id
        return {
            code: 200,
            message: `Item with id ${id} has been deleted.`
        }
    }
}
