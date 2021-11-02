import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { createBrowserHistory } from 'history'
import CircularProgress from '@mui/material/CircularProgress';
import Slide from '@mui/material/Slide';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const history = createBrowserHistory()
const theme = createTheme();

export default function EditPolicy(props) {
  const { id: policyId } = props.match.params;
  const [data, setData] = useState({});
  const [form, setForm] = useState({
    Customer_id: "",
    Customer_Region: "",
    Premium: "",
    Customer_Gender: "",
  })
  const [open, setOpen] = React.useState(false);

  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transition, setTransition] = React.useState(undefined);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const {
    Customer_id,
    Customer_Region,
    Premium,
    Customer_Gender,
  } = form;

  const fetchData = async () => {
    try {
      setIsLoading(true)

      const api = axios.create({
        baseURL: 'http://localhost:4001/api/policy',
      });

      const { data } = await api.get(`/${policyId}`);
if(data && data.data){
  setData(data && data.data);
  setIsLoading(false)

}
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchData();
  }, [policyId]);


  useEffect(() => {
    setForm({
      Customer_id: !(data && data.Customer_id)
        ? ''
        : data && data.Customer_id,
      Customer_Region: !(data && data.Customer_Region)
        ? ''
        : data && data.Customer_Region,
      Premium: !(data && data.Premium)
        ? ''
        : data && data.Premium,
      Customer_Gender: !(data && data.Customer_Gender)
        ? ''
        : data && data.Customer_Gender,
    });
  }, [data]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const dataToSend = {
        Customer_id,
        Customer_Region,
        Premium,
        Customer_Gender,
      }
      await axios.put(`http://localhost:4001/api/policy/${policyId}`, dataToSend)
        .then((response) => {
          if (response && response.data && response.data.data) {
            setIsLoading(false)
            setTransition(()=>TransitionRight)
            setOpen(true);
            setTimeout(() => {
              history.push('/');
              history.go()
            }, 2000)
          } else {
            setIsLoading(false)
            setTransition(()=>TransitionRight)
            setError(response && response.data && response.data.message)
            setOpen(true)
          }

        })
        .catch((err) => {
          setIsLoading(false)
          setError(err.message)
        })
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleChange = (value, field) => {
    if(field==="Premium"){
      if(Number(value)> 1000000){
        setError('Premium cannot more than 1 million.')
        setTransition(()=>TransitionRight)
        setOpen(true)

      }
    }
    setForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  }

  function TransitionRight(props) {
    return <Slide {...props} direction="left" />;
  }

  if (!(data) || isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent:"center",  alignItems:"center"}}>
        <CircularProgress 
        size={80}
        />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Update Policy
          </Typography>
          <Box sx={{ mt: 6 }}>
            <Grid container spacing={4}>
            <Snackbar open={open} autoHideDuration={3000}  onClose={handleClose} TransitionComponent={transition} >
          <Alert onClose={handleClose} severity={error? "error":"success"} sx={{ width: '100%' }}>
            {error? error:  "Policy updated successfully!"}
          </Alert>
        </Snackbar>

              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="Customer_id"
                  required
                  fullWidth
                  id="Customer_id"
                  label="Customer id"
                  type="number"
                  autoFocus
                  value={Customer_id}
                  onChange={(e) => handleChange(e.target.value, "Customer_id")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="Customer_Region"
                  label="Customer Region"
                  name="Customer_Region"
                  autoComplete="family-name"
                  value={Customer_Region}
                  onChange={e => handleChange(e.target.value, "Customer_Region")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="Premium"
                  label="Premium"
                  name="Premium"
                  value={Premium}
                  type="number"
                  onChange={(e) => handleChange(e.target.value, "Premium")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="Customer_Gender"
                  label="Gender"
                  id="Customer_Gender"
                  autoComplete="new-password"
                  value={Customer_Gender}
                  onChange={e => handleChange(e.target.value, "Customer_Gender")}
                />
              </Grid>
            </Grid>
            <Button
              type='submit'
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}

              onClick={() => { handleSubmit() }}
            >
              Edit Policy
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
