import ResponseObject from "../../interfaces/response.interface";

export default interface AuthenticationResponseObject extends ResponseObject {
    jwt: string;
}