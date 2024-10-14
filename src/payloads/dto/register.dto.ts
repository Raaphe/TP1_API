
import AuthenticationDTO from "./auth.dto";

export default interface RegistrationDTO extends AuthenticationDTO {
    name: string;
}