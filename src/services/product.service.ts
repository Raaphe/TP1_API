import ResponseObject from "../interfaces/response.interface";
import Product from "../models/product.model";
import GetProductsPageDto from "../payloads/dto/getProductPage.dto";
import db from "..";
import { IProduct } from "../interfaces/product.interface";
import { ModelContext } from "../models/jsonModel/ModelContext";

export class ProductService {

    static getProductById(productId: number) : IProduct {
        return ModelContext.getProductById(productId) ?? new Product();
    }

    // POST v1
    static async updateProduct(product: IProduct) : Promise<ResponseObject<IProduct | null>> {
        try {
            return {
                code: 200,
                message: "Successfully updated product",
                data: await ModelContext.updateProduct(product) ?? new Product()
            };
        } catch (e) {
            return {
                code: 400,
                message: "Successfully updated product",
                data: null
            };
        }
    }

    // PUT v1
    static async updateProduct(product: IProduct) : Promise<ResponseObject<IProduct | null>> {
        try {
            return {
                code: 200,
                message: "Successfully updated product",
                data: await ModelContext.updateProduct(product) ?? new Product()
            };
        } catch (e) {
            return {
                code: 400,
                message: "Successfully updated product",
                data: null
            };
        }
    }

    // GET v1
    static getAllProducts(dto: GetProductsPageDto) : ResponseObject<IProduct[] | null> {
        try {
            return {
                code: 200,
                message: "Successfully fetched the products",
                data: ModelContext.getAllProducts(dto)
            }
        } catch (e) {
            return {
                code: 500,
                message: "Error fetching data.",
                data: null
            }
        }
    }

    // DELETE v1
    static async deleteProductById(id: number) : Promise<ResponseObject<void>> {
        return await ModelContext.deleteProductById(id).then(res => {
            if (res) {
                return {
                    code: 200,
                    message: `Item with id ${id} has been deleted.`
                }
            }

            return {
                code: 400,
                message: `Incorrect Request.`
            }

        })
        .catch(e => {
            return {
                code: 500,
                message: `Error deleting product \n${e}`
            }
        });
    }



    static async getAllProductsV2(dto: GetProductsPageDto) : Promise<ResponseObject<IProduct[]>> {
        try {
            return {
                code: 200,
                message: "Successfully fetched products",
                data: await Product.find({"price" : {"$gt": dto.minPrice, "$lte": dto.maxPrice}, "quantity" : {"$gt" : dto.minStock, "$lte": dto.maxStock}})
            };
        } catch (e) {
            return {
                code: 500,
                message: `Successfully fetched products \n${e}`,
                data: []
            };
        }
    }

    static async deleteProductByIdV2(productId: string) : Promise<ResponseObject<Boolean>> {
        try {
            let res = await Product.deleteOne({id : productId});
            return {
                code: 200,
                message: "Successfully deleted.",
                data: 0 <= res.deletedCount
            };
        } catch (e) {
            return {
                code: 500,
                message: "Error deleting.",
                data: false
            };
        }
    }
}
