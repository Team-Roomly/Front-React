// interface: 회원가입 Reuqest Body Dto //

export default interface HostSignUpRequestDto {
    hostName: string;
    hostId: string;
    hostPw: string;   
    hostTelNumber: string;
    hostAuthNumber: string;
    businessName: string;
    businessStartDay: Date | null;
    businessNumber: string;
    businessImage: string;
}