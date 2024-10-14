import GetPageDto from "./getPage.dto";

export default interface GetProductsPageDto extends GetPageDto {
    maxPrice?: number;
    minPrice?: number;
    minStock?: number;
    maxStock?: number;
}

