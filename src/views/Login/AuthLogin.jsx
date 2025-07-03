import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from '@mui/material';

import * as Yup from 'yup';
import { Formik } from 'formik';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Google from 'assets/images/social-google.svg';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCVbKs1S-QLFSXBIvVTsf2D_YMLoCMNtg",
  authDomain: "lifeboat-admin.firebaseapp.com",
  projectId: "lifeboat-admin",
  storageBucket: "lifeboat-admin.appspot.com",
  messagingSenderId: "913390627402",
  appId: "1:913390627402:web:19e145cbe3342944d054b3",
  measurementId: "G-N6PF7XCGSZ"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const AuthLogin = ({ ...rest }) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [firebaseError, setFirebaseError] = useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <>
      <Grid container justifyContent="center">
        {/* <Grid item xs={12}>
          <Button
            fullWidth
            sx={{
              fontSize: { md: '1rem', xs: '0.875rem' },
              fontWeight: 500,
              backgroundColor: theme.palette.grey[50],
              color: theme.palette.grey[600],
              textTransform: 'capitalize',
              '&:hover': { backgroundColor: theme.palette.grey[100] }
            }}
            size="large"
            variant="contained"
          >
            <img src={Google} alt="google" width="20px" style={{ marginRight: '16px' }} />
            Sign in with Google
          </Button>
        </Grid> */}
      </Grid>

      <Box alignItems="center" display="flex" mt={2}>
        {/* <Divider sx={{ flexGrow: 1 }} orientation="horizontal" /> */}
        {/* <Typography color="textSecondary" variant="h5" sx={{ m: theme.spacing(2) }}>
          OR
        </Typography> */}
        {/* <Divider sx={{ flexGrow: 1 }} orientation="horizontal" /> */}
      </Box>

      <Formik
        initialValues={{ email: '', password: '', submit: null }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Invalid email').required('Email is required'),
          password: Yup.string().required('Password is required')
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setFirebaseError('');
          try {
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

           
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists() && userDocSnap.data().isAdmin === true) {
              navigate('/dashboard/default');
            } else {
             
              await auth.signOut();
              setFirebaseError('Access denied');
            }
          } catch (error) {
            console.error('Firebase login error:', error);
            setFirebaseError(error.message);
            setErrors({ submit: error.message });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...rest}>
            <TextField
              error={Boolean(touched.email && errors.email)}
              fullWidth
              helperText={touched.email && errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              type="email"
              value={values.email}
              variant="outlined"
            />

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ mt: theme.spacing(3), mb: theme.spacing(1) }}
            >
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {/* {showPassword ? <Visibility /> : <VisibilityOff />} */}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {touched.password && errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
            </FormControl>

            <Grid container justifyContent="flex-end">
              {/* <Grid item>
                <Typography variant="subtitle2" color="primary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                  Forgot Password?
                </Typography>
              </Grid> */}
            </Grid>

            {firebaseError && (
              <Box mt={2}>
                <FormHelperText error>{firebaseError}</FormHelperText>
              </Box>
            )}

            <Box mt={2}>
              <Button
                color="primary"
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Log In
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;