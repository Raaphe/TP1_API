
export default interface ResponseObject<T> {
    message: string;
    code: number;
    data?: T
}