import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Box, Container, Grid, TextField, Card, CardContent, Button, Typography, makeStyles } from '@material-ui/core';
import { signup, sendMail } from '../../helpers/AuthHelper';


const useStyle = makeStyles((theme) => ({
    card:{
        marginTop: '25px',
        // minWidth: '450px',
        padding: '5px'
    },
    avatar: {
        height: '100px',
        width: '100px'
    },
    title: {
        textAlign: "center"
    },
    field: {
        marginTop: '8px'
    },
    links: {
        marginTop: '10px',
        textAlign: 'center',
    },
    link:{
        color: 'blue',
        textDecoration: 'none',
    },
    resp: {
        display: 'block',
        textAlign: 'center',
        color: 'red',
        overflowWrap: "break-word",
    }
}))

const SignUp = () => {
    const classes = useStyle();
    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [nameError, setNameError] = useState(false)
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [response, setResponse] = useState('');

    let emailRe = /\S+@\S+\.\S+/;
    let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')

    const handleSignUp = (e) => {
        e.preventDefault();
        
        let error = false;

        setNameError(false);
        setEmailError(false);
        setPasswordError(false);
        setConfirmPasswordError(false);

        // console.log(name, email, password, confirmPassword);
        
        if(name===''){
            setNameError(true);
            error=true;
        }
        if(email===''){
            setEmailError(true);
            error = true;
        } else if(!emailRe.test(email)){
            setResponse("Please provide a valid email");
            setEmailError(true);
            error = true;
            return
        }
        if(password===''){
            setPasswordError(true);
            error = true;
        } else if(!strongPassword.test(password)){
            setResponse("Password must be atleast 8 character long, has atleast one uppercase letter, one lowercase letter, one number and one special character");
            setPasswordError(true);
            error = true;
            return
        }
        if(confirmPassword===''){
            setConfirmPasswordError(true);
            error = true;
        }
        if(password !== confirmPassword){
            setResponse("Password and Confirm password must be same");
            setPasswordError(true);
            setConfirmPasswordError(true);
            error = true;
        }
        
        if(!error){
            signup(name, email, password)
            .then(res => {
                if(res.status !== 'error'){
                    // setResponse("Account created successfully. Please verify to continue");
                    sendMail(email)
                    .then(res=>{
                        if(res.status === 'success'){
                            navigate("/success",{state: {email:email, isForgotPassword: false}})
                        } else {
                            setResponse(res.message)
                        }
                    })
                    .catch(err => console.log(err))
                } else {
                    setResponse(res.message);
                }
            })
            .catch(err => console.log(err));

            // setName('');
            // setEmail('');
            // setPassword('');
            // setConfirmPassword('');
        }
    }


    return (
        <Container>
        <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={6} md={4} >
                <Card className={classes.card} variant="outlined">
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <Avatar className={classes.avatar} />
                    </Box>
                    <Typography variant="h4" className={classes.title}>
                        Sign Up
                    </Typography>
                    <Typography className={classes.resp}>{response}</Typography>
                    <CardContent>
                        <form noValidate onSubmit={handleSignUp}>
                        <TextField
                                className={classes.field}
                                label="Name"
                                variant="outlined"
                                type="text"
                                fullWidth
                                required
                                error={nameError}
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                            />
                        <TextField
                                className={classes.field}
                                label="Email"
                                variant="outlined"
                                type="email"
                                fullWidth
                                required
                                error={emailError}
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                            <TextField
                                className={classes.field}
                                type="password"
                                label="Password"
                                variant="outlined"
                                fullWidth
                                required
                                error={passwordError}
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                            />
                            <TextField
                                className={classes.field}
                                type="password"
                                label="Confirm Password"
                                variant="outlined"
                                fullWidth
                                required
                                error={confirmPasswordError}
                                value={confirmPassword}
                                onChange={(e)=>setConfirmPassword(e.target.value)}
                            />
                            <Button
                                className={classes.field}
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >Sign Up</Button>
                        </form>
                        <div className={classes.links}>
                            <Link to="/signin" className={classes.link}>Already have an Account? Sign In</Link>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
        </Container>
    )
}

export default SignUp
