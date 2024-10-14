import * as writer from "fs";
import { Product } from "./product.model";
import { User } from "../interfaces/user.interface";
import { debug, log } from "console";
import axios from "axios";
import { logger } from "../utils/logger";
import { hashPassword } from '../utils/security.utils';

interface FakeStoreApiProduct {
    "title": string,
    "price": number,
    "description": string,
    "categoryId": number,
    "images": string
}


export class ModelContext {

    private static jsonPath: string = "";
    private static users: User[] = [];
    private static products: Product[] = [];
    private static hasStarted: boolean = false;// This attribute will be checked in the `app.ts` to prevent fetching products everytime I refresh.

    constructor(jsonPath: string) {
        ModelContext.setJsonPath(jsonPath);
    }


    // MISC
    public static async setJsonPath(jsonPath: string) {
        this.jsonPath = jsonPath;
        await this.update();

        // Fetch products if the server hasn't already started
        if (!this.hasStarted) {
            await this.fetchProducts();
        }
    }

    /**
     * This method will only empty products and not users.
     */
    public static async emptyJson() {
        this.products = [];
        this.hasStarted = false;
        await this.persistDataToJson("===+ CLEANING JSON +===");
    }

    /**
     * Re-reads the json file and reapplies the fields into products and users.
     * @returns An empty promise.
     */
    public static async update(): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log("+++ UPDATING +++");

            writer.readFile(this.jsonPath, (err, buffer) => {
                if (err) {
                    console.error("Error reading file:", err);
                    reject(err);
                    return;
                }

                // Convert Buffer to string
                const data = buffer.toString();

                // Parse JSON string
                let parsedData;
                try {
                    parsedData = JSON.parse(data);
                } catch (jsonError) {
                    console.error("Error parsing JSON:", jsonError);
                    reject(jsonError);
                    return;
                }

                this.users = parsedData.users || [];
                this.products = parsedData.products || [];
                this.hasStarted = parsedData.hasStarted || false;

                console.log("Update completed successfully");
                resolve();
            });
        });
    }
    
    /**
     * this will reflect the data found on this fields above into the json.
     */
    public static persistDataToJson(message: string = "") {
        return new Promise((resolve, reject) => {
            const dataToWrite = {
                "hasStarted": this.hasStarted,
                "users": this.users,
                "products": this.products
            };

            writer.writeFile(this.jsonPath, JSON.stringify(dataToWrite, null, 2), (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log(message);
                resolve("complete");
            });
        });
    }

    public static hasServerStarted() : boolean {
        return this.hasStarted;
    }

    // === PRODUCTS ===

    /**
     * Creates or updates the product to add.
     * @param productToSave The product to add.
     */
    public static async saveProduct(productToSave: Product, triggerUpdate: boolean = true): Promise<void> {
        const product = this.products.find(p => p.id === productToSave.id);

        if (product) {
            product.description = productToSave.description;
            product.name = productToSave.name;
            product.price = productToSave.price;
            product.quantity = productToSave.quantity;
        } else {
            productToSave.id = this.products.length + 1;
            this.products.push(productToSave);
        }

        if (triggerUpdate) {
            await this.persistDataToJson();
        }
    }

    public static async fetchProducts(): Promise<void> {
        if (this.hasStarted) {
            console.log("Products have already been fetched, skipping...");
            return;
        }

        try {
            let res: FakeStoreApiProduct[] = (await axios.get("https://api.escuelajs.co/api/v1/products")).data;
            res.forEach(product => {
                this.saveProduct(
                    new Product(
                        this.products.length + 1,
                        product.title,
                        product.price,
                        product.description,
                        generateRandomNumber(0, 1000)
                    ),
                    false // Disable automatic persistence for better performance
                );
            });
        } catch (e) {
            logger.error("Could not fetch products \n" + e);
            return;
        }

        this.hasStarted = true;
        await this.persistDataToJson("=== Fetched Products ===");
    }

    public static getAllProducts(): Product[] {
        return this.products;
    }

    public static getProductById(id: number): Product | undefined {
        return this.products.find(product => product.id === id);
    }

    // === USERS ===

    /**
     * Saves or updates a user to the context. 
     * Takes care of hashing and cleansing the password.
     * @param userToAdd the user to add to the json/context.
     */
    public static async saveUser(userToAdd: User, triggerRefresh: boolean = true) {
            
        var user = this.users.find(p => p.id === userToAdd.id);

        if (!(user === null || user === undefined)) {
            user.name = userToAdd.name;
            user.password = await hashPassword(userToAdd.password.trim());
            user.username = userToAdd.username;

            logger.info(`saving ${user.name}`);
        } else if (userToAdd.id === null || userToAdd.id === undefined || userToAdd.id < 0) {
            user = userToAdd;
            user.password = await hashPassword(userToAdd.password.trim());
            user.id = this.users.length + 1;        
            logger.info(`saving ${user.name}`);
        }

        this.users.push(userToAdd);    

        if (triggerRefresh) {
            await this.persistDataToJson();
        }

        return;
    }

    public static getUserById() {

    }

    public static getAllUsers() : User[] {
        return this.users;
    }

}

function generateRandomNumber(min: number, max:number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  