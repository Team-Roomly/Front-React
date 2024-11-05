import React, { ChangeEvent, useEffect, useState } from 'react'
import './style.css'
import MypageInputBox from 'src/component/input/mypageinput';
import BookingList from '../../bookinglist';

interface Props {
    titletext: string;
    username: string;
    activite: boolean;
}

export default function Booking({ titletext, username, activite }: Props) {


    const [idmessage, setIdMessage] = useState<string>('qwer1234');
    const [password, setPassword] = useState<string>('');
    const [checkPassword, setCheckPassword] = useState<string>('');
    const [changePasswordbutton, setChangePasswordbutton] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<boolean>(false);


    // event handler: 비밀번호 변경 이벤트 처리 //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setPassword(value);
    }

    // event handler: 비밀번호 확인 변경 이벤트 처리 //
    const onCheckPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setCheckPassword(value);
    }

    const onPasswordChangeButtonClickHandlder = () => {

    }

    useEffect(() => {
        if (!password || !checkPassword) return;

        const equal = password === checkPassword;
        
        ;
    }, [password, checkPassword]);

    return (

        <>
            {activite && <div id='booking-warpper'>
                <div className='booking-title'>
                    <div className='booking-title-text'>{titletext}</div>
                    <div className='booking-title-box'>
                        <div className='info rmation-title-ditail-username'>'{username}'</div>
                        <div className='booking-title-ditail'>님 반갑습니다.</div>
                    </div>
                </div>
                <div className='booking-main'>
                    <div className='booking-title'>예약 내역</div>
                    <BookingList />
                    <BookingList />
                    <BookingList />
                    <BookingList />
                    <BookingList />
                </div>
            </div>}
        </>
    )
}