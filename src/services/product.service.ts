import ResponseObject from "../interfaces/response.interface";
import Product from "../models/product.model";
import GetProductsPageDto from "../payloads/dto/getProductPage.dto";
import { IProduct } from "../interfaces/product.interface";
import { ModelContext } from "../models/jsonModel/ModelContext";

export class ProductService {

    static getProductById(productId: number): IProduct {
        return ModelContext.getProductById(productId) ?? new Product();
    }

    /**
     * POST PRODUCTS V1.
     * @param product The product to create.
     * @returns The created product.
     */
    static async create(product: IProduct): Promise<ResponseObject<IProduct | null>> {
        try {
            var createdProduct = await ModelContext.createProduct(product);

            if (createdProduct === null) { // if product already existsed
                return {
                    code: 409,
                    message: "Product already exists",
                    data: null,
                }
            }

            return {
                code: 200,
                message: "Successfully updated product",
                data: createdProduct,
            };
        } catch (e) {
            return {
                code: 400,
                message: "Successfully updated product",
                data: null
            };
        }
    }

    /**
     * PUT PRODUCTS v1.
     * @param product The product to update.
     * @returns The updated product.
     */
    static async updateProduct(product: IProduct): Promise<ResponseObject<IProduct | null>> {
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

    /**
     * GET PRODUCTS v1.
     * @param dto The filters to apply to get all request.
     * @returns A promise of a list of products or null.
     */
    static getAllProducts(dto: GetProductsPageDto): ResponseObject<IProduct[] | null> {
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

    /**
     * DELETE PRODUCTS v1 
     * @param id the id to delete.
     * @returns nothing.
     */
    static async deleteProductById(id: number): Promise<ResponseObject<void>> {
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

    // API V2 SERVICE METHODS

    /**
     * GET PRODUCTS v2
     * @param dto The dto that contains the query filters.
     * @returns A promise of a list of products.
     */
    static async getAllProductsV2(dto: GetProductsPageDto): Promise<ResponseObject<IProduct[]>> {
        try {
            return {
                code: 200,
                message: "Successfully fetched products",
                data: await Product.find({ "price": { "$gt": dto.minPrice, "$lte": dto.maxPrice }, "quantity": { "$gt": dto.minStock, "$lte": dto.maxStock } })
            };
        } catch (e) {
            return {
                code: 500,
                message: `Successfully fetched products \n${e}`,
                data: []
            };
        }
    }

    /**
     * PUT PRODUCTS v2.
     * @param product The product to save.
     */
    static async updateProductV2(product: IProduct) : Promise<ResponseObject<IProduct | null>> {        
        try {

            let res: ResponseObject<IProduct | null> = {code: 0,message: "", data: null};

            let updatedProduct = await Product.updateOne(
                {"_id": product._id}, 
                product,
                (err: any, docs: any) => {
                    if (err) {
                        throw new Error(err +  "\nError saving document.")
                    } else {
                        console.log(`+=== Saved Doc :\n${docs}\n===+`);
                    }
                }
            ).then(_ => {
                return product;
            })
            .catch(e => {
                throw new Error(e +  "\nError calling cluster.")
            });

            res.code = 200;
            res.data = updatedProduct;
            res.message = "Updated product sucessfully";
            return res;
        } catch (e) {
            console.error(e);
            return {   
                code: 500,
                message: e as string,
                data: null
            };
        }
    }

    /**
     * POST PRODUCTS v2.
     * @param product The product to save.
     */
    static async createProductV2(product: IProduct): Promise<IProduct> {
        try {
            const result = await Product.create(product);
            console.log(`+=== Saved Doc :\n${result}\n===+`);
            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error creating product');
        }
    }
    
    
    /**
     * DELETE PRODUCTS v2
     * @param productId The product id to delete.
     * @returns Whether the product was deleted or not.
     */
    static async deleteProductByIdV2(productId: string): Promise<ResponseObject<Boolean>> {
        try {
            let res = await Product.deleteOne({ "_id": productId });
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
