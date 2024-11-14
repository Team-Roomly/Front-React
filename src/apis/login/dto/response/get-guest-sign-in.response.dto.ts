// import ResponseDto from "../response.dto";

import { ResponseDto } from "src/apis/signUp/dto/response";

export default interface GetGuestSignInResponseDto extends ResponseDto {
    guestId:string;
    guestPw:string;
    guestName:string;
    guestTelNumber:string;
    joinPath:string;
    snsId:string;
}