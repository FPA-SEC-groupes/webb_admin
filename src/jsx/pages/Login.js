import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { loadingToggleAction, loginAction } from '../../store/actions/AuthActions';
import logo1 from '../../images/logo1.png';

function Login(props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('admin');
    let errorsObj = { email: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);
    const [password, setPassword] = useState('12345678');
    const dispatch = useDispatch();

    async function onLogin(e) {
        e.preventDefault();
        let error = false;
        const errorObj = { ...errorsObj };
        if (email === '') {
            errorObj.email = 'Email is Required';
            error = true;
        }
        if (password === '') {
            errorObj.password = 'Password is Required';
            error = true;
        }
        setErrors(errorObj);
        if (error) return;

        dispatch(loadingToggleAction(true));
        dispatch(loginAction(email, password, navigate));
    }

    return (
        <div className="authincation h-100">
            <div className="container h-100">
                <div className="row justify-content-center h-100 align-items-center">
                    <div className="col-md-6">
                        <div className="authincation-content">
                            <div className="row no-gutters">
                                <div className="col-xl-12">
                                    <div className="auth-form">
                                        <div className="text-center mb-3">
                                            <NavLink to="/dashboard">
                                                <img src={logo1} alt="Brand Logo" />
                                            </NavLink>
                                        </div>
                                        <h4 className="text-center mb-4">Sign In</h4>
                                        <form onSubmit={onLogin}>
                                            <div className="mb-3">
                                                <label><strong>Email Address</strong></label>
                                                <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                                                {errors.email && <div className="text-danger">{errors.email}</div>}
                                            </div>
                                            <div className="mb-3">
                                                <label><strong>Password</strong></label>
                                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                {errors.password && <div className="text-danger">{errors.password}</div>}
                                            </div>
                                            <div className="text-center">
                                                <button type="submit" className="btn btn-primary btn-block">Sign Me In</button>
                                            </div>
                                        </form>
                                        <div className="text-center mt-3">
                                            <span>Forget your password? <NavLink to="/page-forgot-password" className="text-primary"> Click here</NavLink></span>
                                        </div>
                                        {props.errorMessage && (
                                            <div className='bg-red-300 text-red-900 border border-red-900 p-1 my-2'>
                                                {props.errorMessage}
                                            </div>
                                        )}
                                        {props.successMessage && (
                                            <div className='bg-green-300 text-green-900 border border-green-900 p-1 my-2'>
                                                {props.successMessage}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        errorMessage: state.auth.errorMessage,
        successMessage: state.auth.successMessage,
        showLoading: state.auth.showLoading,
    };
};

export default connect(mapStateToProps)(Login);
