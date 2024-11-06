import Topbar from 'src/component/topbar';
import './style.css';
import { ChangeEvent, useState } from 'react';
import ResponseDto from 'src/apis/signUp/dto/response/response.dto';
import FindComponent from 'src/component/find/find-password';
import InputBox from 'src/component/find/find-password';
import axios from 'axios';
import { telAuthCheckRequest, telAuthRequest } from 'src/apis/signUp';
import TelAuthRequestDto from 'src/apis/signUp/dto/request/common/tel-auth.request.dto';
import TelAuthCheckRequestDto from 'src/apis/signUp/dto/request/common/tel-auth-check.request.dto';

type CurrentView = 'host-find-id' | 'guest-find-id' | 'host-find-password' | 'guest-find-password';

interface FindComponentProps {

    onPathChange: (path: string) => void;
}

// component : Guest Id찾기 컴포넌트  //
export default function FindId({ onPathChange }: FindComponentProps) {

    // state: 현재 화면 상태 관리
    const [currentView, setCurrentView] = useState<CurrentView>('guest-find-id');

    // state: 정보 입력상태 //
    const [guestName, setGuestName] = useState('');
    const [hostName, setHostName] = useState('');
    const [telNumber, setTelNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [guestId, setGuestId] = useState<string | null>(null);
    const [hostId, setHostId] = useState<string | null>(null);
    const [guestPassword, setGuestPassword] = useState<string>('');
    const [guestPasswordCheck, setGuestPasswordCheck] = useState<string>('');
    const [hostPassword, setHostPassword] = useState<string>('');
    const [hostPasswordCheck, setHostPasswordCheck] = useState<string>('');


    // state: 입력값 검증 상태 //
    const [isPasswordMatch, setIsPasswordMatch] = useState(false);

    const [isSend, setSend] = useState<boolean>(false);
    const [isCheckedId, setCheckedId] = useState<boolean>(false);

    const [isCheckedAuthNumber, setCheckedAuthNumber] = useState<boolean>(false);
    const [isMatchedPassword, setMatchedPassword] = useState<boolean>(false);
    const [isCheckedPassword, setCheckedPassword] = useState<boolean>(false);


    // state: 입력 메세지 상태 //
    const [authNumberMessage, setAuthNumberMessage] = useState<string>('');
    const [telNumberMessage, setTelNumberMessage] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');


    // state: 정보 메세지 에러 상태 //
    const [authNumberMessageError, setAuthNumberMessageError] = useState<boolean>(false);
    const [telNumberMessageError, setTelNumberMessageError] = useState<boolean>(false);
    const [passwordMessageError, setPasswordMessageError] = useState<boolean>(false);
    const [passwordCheckMessageError, setPasswordCheckMessageError] = useState<boolean>(false);


    // state: guest 모달 오픈/오프 상태 //
    const [isGuestModalOpen, setGuestModalOpen] = useState(false);
    const GuestopenModal = () => setGuestModalOpen(true);
    const GuestcloseModal = () => setGuestModalOpen(false);

    // state: host 모달 오픈/오프 상태 //
    const [isHostModalOpen, setHostModalOpen] = useState(false);
    const HostopenModal = () => setHostModalOpen(true);
    const HostcloseModal = () => setHostModalOpen(false);

    // function: 전화번호 인증 Response 처리 함수 //
    const telAuthResponse = (responseBody: ResponseDto | null) => {

        const message =

            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '숫자 11자 입력해주세요.' :
                    responseBody.code === 'DT' ? '중복된 전화번호 입니다.' :
                        responseBody.code === 'TF' ? '서버에 문제가 있습니다.' :
                            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
                                responseBody.code === 'SU' ? '인증번호가 전송되었습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setTelNumberMessage(message);
        setTelNumberMessageError(!isSuccessed);
        setSend(isSuccessed);
    };

    // function: 전화번호 인증 확인 Response 처리 함수 //
    const telAuthCheckResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' :
                    responseBody.code === 'TAF' ? '인증번호가 일치하지 않습니다.' :
                        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
                            responseBody.code === 'SU' ? '인증번호가 확인되었습니다.' : ''

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setAuthNumberMessage(message);
        setAuthNumberMessageError(!isSuccessed);
        setCheckedAuthNumber(isSuccessed);
    };

    // event handler: 상단 게스트 버튼 클릭 이벤트 처리
    const onGuestButtonClickHandler = () => {
        setCurrentView('guest-find-id'); // 게스트 화면으로 변경
    };

    // event handler: 상단 호스트 버튼 클릭 이벤트 처리
    const onHostButtonClickHandler = () => {
        setCurrentView('host-find-id'); // 호스트 화면으로 변경
    };

    // event handler: 상단 게스트 버튼 클릭 이벤트 처리
    const onGuestFindPasswordButtonClickHandler = () => {
        setCurrentView('guest-find-password'); // 게스트 화면으로 변경
    };

    // event handler: 상단 호스트 버튼 클릭 이벤트 처리
    const onHostFindPasswordButtonClickHandler = () => {
        setCurrentView('host-find-password'); // 호스트 화면으로 변경
    };

    // event handler: 인증번호 전송 버튼 클릭 핸들러
    // const handleSendVerificationCode = async () => {
    //     try {
    //         const response = await fetch('/api/send-verification', {
    //             method: 'POST',
    //             body: JSON.stringify({ telNumber }),
    //             headers: { 'Content-Type': 'application/json' },
    //         });
    //         const data = await response.json();
    //         telAuthResponse(data); // 인증번호 전송 결과 처리
    //     } catch (error) {
    //         console.error('인증번호 전송 실패:', error);
    //         alert('인증번호 전송에 실패했습니다.');
    //     }
    // };

    // event handler: 이름 변경 이벤트 처리 //
    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setGuestName(value);
        setHostName(value);
    };

    // event handler: 전화번호 인증 버튼 클릭 이벤트 처리 //
    const onTelNumberSendClickHandler = () => {
        if (!telNumber) return;

        const pattern = /^[0-9]{11}$/;
        const isMatched = pattern.test(telNumber);

        if (!isMatched) {
            setTelNumberMessage('숫자 11자를 입력 해주세요');
            setTelNumberMessageError(true);
            return;
        }

        const requestBody: TelAuthRequestDto = {
            telNumber // 속성의 이름과 담을 변수의 이름이 동일한 경우 하나로 작성
        }
        telAuthRequest(requestBody).then(telAuthResponse);
    };

    // event handler: 인증 확인 버튼 클릭 이벤트 처리 //
    const onAuthNumberCheckClickHandler = () => {
        if (!authNumber) return;

        const requestBody: TelAuthCheckRequestDto = {
            telNumber, authNumber
        }
        telAuthCheckRequest(requestBody).then(telAuthCheckResponse);

    };

    // event handler: 전화번호 변경 이벤트 처리 //
    const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setTelNumber(value);
        setSend(false);
        setTelNumberMessage('');
    };

    // event handler: 인증번호 변경 이벤트 처리 //
    const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setAuthNumber(value);
        setCheckedAuthNumber(false);
        setAuthNumberMessage('');
    };

    //event handler: Guest 아이디 찾기 버튼 클릭 핸들러 //
    const onGuestFindIdButtonClickHandler = async () => {
        try {
            const response = await fetch('/api/guest-find-id', {
                method: 'POST',
                body: JSON.stringify({ guestName, telNumber, verificationCode }),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (data.success) {
                setGuestId(data.guestId);  // 찾은 아이디 설정
                setGuestModalOpen(true);  // 아이디를 찾았을 때만 모달 열기
            } else {
                alert('정보가 일치하지 않습니다.');
            }
        } catch (error) {
            console.error('아이디 찾기 실패:', error);
            alert('존재하지 않는 유저 정보입니다.');
            setGuestModalOpen(false);

        }
    };

    //event handler: host 아이디 찾기 버튼 클릭 핸들러 //
    const onHostFindIdButtonClickHandler = async () => {
        try {
            const response = await fetch('/api/host-find-id', {
                method: 'POST',
                body: JSON.stringify({ hostName, telNumber, verificationCode }),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (data.success) {
                setHostId(data.hostId);
                setHostModalOpen(true); // 찾은 아이디 표시
            } else {
                alert('정보가 일치하지 않습니다.');
            }
        } catch (error) {
            console.error('아이디 찾기 실패:', error);
            alert('존재하지 않는 유저 정보입니다.');
            setHostModalOpen(false);
        }
    };

    // event handler: 비밀번호 변경 이벤트 처리 //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setGuestPassword(value);
        setHostPassword(value);

        // 비밀번호 패턴 검사
        const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
        const isMatched = pattern.test(value);

        // 비밀번호가 8자 이상일 때만 메시지를 설정
        if (value.length >= 8) {
            const message = isMatched ? '' : '영문, 숫자를 혼용하여 8 ~ 13자를 입력해주세요';
            setPasswordMessage(message);
            setPasswordMessageError(!isMatched);
        } else {
            setPasswordMessage(''); // 비밀번호가 8자 미만일 때 메시지 초기화
            setPasswordMessageError(false);
        }

    }

    //event handler: 비밀번호 변경 확인 이벤트 처리 //
    const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        // Guest와 Host의 비밀번호 확인 값을 모두 업데이트
        setGuestPasswordCheck(value);
        setHostPasswordCheck(value);

        // 입력된 값이 있는지 확인하고 비밀번호와 일치 여부를 체크
        const isGuestPasswordMatch = guestPassword && guestPassword === value;
        const isHostPasswordMatch = hostPassword && hostPassword === value;

        if (isGuestPasswordMatch || isHostPasswordMatch) {
            // 비밀번호가 일치할 때
            setPasswordCheckMessage(''); // 메시지 초기화
            setPasswordCheckMessageError(false); // 에러 상태 초기화
            setIsPasswordMatch(true); // 버튼 활성화
        } else if (value.length > 0) {
            // 비밀번호가 일치하지 않을 때
            setPasswordCheckMessage('비밀번호가 일치하지 않습니다.');
            setPasswordCheckMessageError(true);
            setIsPasswordMatch(false);
        } else {
            // 비밀번호 확인 값이 없을 때 메시지 초기화
            setPasswordCheckMessage('');
            setPasswordCheckMessageError(false);
            setIsPasswordMatch(false);
        }
    };
    // event handler: 비밀번호 변경 요청 전송 핸들러 //
    const onSubmitPasswordChangeHandler = async () => {
        try {
            const data = {
                guestPassword,
                hostPassword
            };

            // POST 요청 보내기
            const response = await axios.post('/api/password-change', data);

            if (response.status === 200) {
                alert('비밀번호가 성공적으로 변경되었습니다.');
            }
        } catch (error) {
            console.error('비밀번호 변경 오류:', error);
            alert('비밀번호 변경 중 문제가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const [nameMessage, setNameMessage] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');

    const [nameMessageError, setNameMessageError] = useState<boolean>(false);

    // event handler: 메인페이지 이동 버튼(회원가입 버튼 하단) 클릭 이벤트 처리
    const onMainPageGoClickHandler = () => {
        window.location.href = '/main'; // 이동할 페이지 경로 설정
    };

    // render: guest 아이디 찾기 화면 렌더링 //
    if (currentView === 'guest-find-id') {
        return (
            <div id='find-wrapper'>
                <Topbar />
                <div className="find2">
                    <div className="find-wrapper">
                        <div className='find-body'>
                            <div className='find-title'>아이디 찾기</div>
                            <div className='guest-login-button1'>
                                <a className='GuestLogin-button-guest1'>Guest</a>
                                <a className='GuestLogin-button-host1' onClick={onHostButtonClickHandler}>Host</a>
                            </div>

                        </div>
                        <div className="nameBox">
                            <InputBox
                                messageError={nameMessageError}
                                message={nameMessage}
                                value={guestName}
                                label="이름"
                                type="text"
                                placeholder="이름을 입력해주세요."
                                onChange={onNameChangeHandler}
                            />
                        </div>
                        <div className="telNumberBox">
                            <InputBox
                                messageError={telNumberMessageError}
                                message={telNumberMessage}
                                value={telNumber}
                                label="전화번호"
                                type="text"
                                placeholder="-빼고 입력해주세요."
                                buttonName="전화번호 인증"
                                onChange={onTelNumberChangeHandler}
                                onButtonClick={onTelNumberSendClickHandler}
                            />
                            <InputBox
                                messageError={authNumberMessageError}
                                message={authNumberMessage}
                                value={authNumber}
                                label="인증번호"
                                type="text"
                                placeholder="인증번호 4자리를 입력해주세요."
                                buttonName="인증확인"
                                onChange={onAuthNumberChangeHandler}
                                onButtonClick={onAuthNumberCheckClickHandler}
                            />

                        </div>
                        <button className="find-button" onClick={onGuestFindIdButtonClickHandler} >
                            아이디 찾기
                        </button>
                        {isGuestModalOpen && (
                            <div className="find-overlay" onClick={() => setGuestModalOpen(false)}>
                                <div className="modal-content2">
                                    <button className="closeButton" onClick={() => setGuestModalOpen(false)}>X</button>
                                    <div className="find-modal-body">
                                        <h2>결과</h2>
                                        <p className='find-result'>{guestName}님의 아이디는 {guestId}입니다.</p>
                                        <p className='find-password-button' onClick={onGuestFindPasswordButtonClickHandler}>비밀번호 찾기</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="modal-guest">
                        </div>
                        <div className='mainPage-movig' onClick={onMainPageGoClickHandler}>
                            <div className='mainPage-movig-input'>메인페이지에서 로그인하기</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // render: guest 아이디 찾기 화면 렌더링 //
    if (currentView === 'host-find-id') {
        return (
            <div id='find-wrapper'>
                <Topbar />
                <div className="find2">
                    <div className="find-wrapper">
                        <div className='find-body'>
                            <div className='find-title'>아이디 찾기</div>
                            <div className='host-login-button2'>
                                <a className='HostLogin-button-guest2' onClick={onGuestButtonClickHandler}>Guest</a>
                                <a className="HostLogin-button-host2">Host</a>
                            </div>

                        </div>
                        <div className="nameBox">
                            <InputBox
                                messageError={nameMessageError}
                                message={nameMessage}
                                value={hostName}
                                label="이름"
                                type="text"
                                placeholder="이름을 입력해주세요."
                                onChange={onNameChangeHandler}
                            />

                        </div>
                        <div className="telNumberBox">
                            <InputBox
                                messageError={telNumberMessageError}
                                message={telNumberMessage}
                                value={telNumber}
                                label="전화번호"
                                type="text"
                                placeholder="-빼고 입력해주세요."
                                buttonName="전화번호 인증"
                                onChange={onTelNumberChangeHandler}
                                onButtonClick={onTelNumberSendClickHandler}
                            />
                            <InputBox
                                messageError={authNumberMessageError}
                                message={authNumberMessage}
                                value={authNumber}
                                label="인증번호"
                                type="text"
                                placeholder="인증번호 4자리를 입력해주세요."
                                buttonName="인증확인"
                                onChange={onAuthNumberChangeHandler}
                                onButtonClick={onAuthNumberCheckClickHandler}
                            />

                        </div>
                        <button className="find-button" onClick={onHostFindIdButtonClickHandler}>
                            아이디 찾기
                        </button>
                        {isHostModalOpen && (
                            <div className="find-overlay" onClick={() => setHostModalOpen(false)}>
                                <div className="modal-content2">
                                    <button className="closeButton" onClick={() => setHostModalOpen(false)}>X</button>
                                    <div className="find-modal-body">
                                        <h2>결과</h2>
                                        <p className='find-result'>{hostName}님의 아이디는 {hostId}입니다.</p>
                                        <p className='find-password-button' onClick={onHostFindPasswordButtonClickHandler}>비밀번호 찾기</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className='mainPage-movig' onClick={onMainPageGoClickHandler}>
                            <div className='mainPage-movig-input'>메인페이지에서 로그인하기</div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }

    // render: guest 비밀번호 찾기 화면 렌더링 //
    if (currentView === 'guest-find-password') {
        return (
            <div id='find-wrapper'>
                <Topbar />
                <div className="find">
                    <div className="find-wrapper">
                        <div className='find-body'>
                            <div className='find-title'>(게스트)비밀번호 재설정</div>
                        </div>
                        <div className="nameBox">
                            <InputBox
                                messageError={passwordMessageError}
                                message={passwordMessage}
                                value={guestPassword}
                                label="비밀번호"
                                type="password"
                                placeholder="영문, 숫자를 혼용하여 8 ~ 13자를 입력해주세요."
                                onChange={onPasswordChangeHandler} />
                            <InputBox
                                messageError={passwordCheckMessageError}
                                message={passwordCheckMessage}
                                value={guestPasswordCheck}
                                label="비밀번호 확인"
                                type="password"
                                placeholder="비밀번호를 재입력해주세요."
                                onChange={onPasswordCheckChangeHandler}
                            />
                        </div>
                        <button className="find-button" disabled={!isPasswordMatch} onClick={onSubmitPasswordChangeHandler}>
                            확인
                        </button>
                        <div className='mainPage-movig' onClick={onMainPageGoClickHandler}>
                            <div className='mainPage-movig-input'>메인페이지로 돌아가기</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // render: guest 비밀번호 찾기 화면 렌더링 //
    if (currentView === 'host-find-password') {
        return (
            <div id='find-wrapper'>
                <Topbar />
                <div className="find">
                    <div className="find-wrapper">
                        <div className='find-body'>
                            <div className='find-title'>(호스트)비밀번호 재설정</div>
                        </div>
                        <div className="nameBox">
                            <InputBox
                                messageError={passwordMessageError}
                                message={passwordMessage}
                                value={guestPassword}
                                label="비밀번호"
                                type="password"
                                placeholder="영문, 숫자를 혼용하여 8 ~ 13자를 입력해주세요."
                                onChange={onPasswordChangeHandler} />
                            <InputBox
                                messageError={passwordCheckMessageError}
                                message={passwordCheckMessage}
                                value={guestPasswordCheck}
                                label="비밀번호 확인"
                                type="password"
                                placeholder="비밀번호를 재입력해주세요."
                                onChange={onPasswordCheckChangeHandler}
                            />
                        </div>
                        <button className="find-button" disabled={!isPasswordMatch} onClick={onSubmitPasswordChangeHandler}>
                            확인
                        </button>
                        <div className='mainPage-movig' onClick={onMainPageGoClickHandler}>
                            <div className='mainPage-movig-input'>메인페이지로 돌아가기</div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}