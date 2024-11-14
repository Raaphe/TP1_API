import ResponseObject from "../interfaces/response.interface";

export default class CustomRequestParser {


    /**
     * The message has to be under this format : 
     * <CODE> : <RESPONSE MESSAGE>
     * @param res The response to be parsed.
     * @returns A response object to be used when routing.
     */
    public static ParseRequest(res: string) : ResponseObject<null> {
        return {code: parseInt(res.split(":")[0]),message: res.split(":")[1]};
    }

}