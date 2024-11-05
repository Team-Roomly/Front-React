// interface: 회원가입 Reuqest Body Dto //

export default interface HostSignUpRequestDto {
    hostName: string;
    hostId: string;
    hostPassword: string;   
    telNumber: string;
    authNumber: string;
    businessName: string;
    businessStartDay: Date | null;
    businessNumber: string;
}