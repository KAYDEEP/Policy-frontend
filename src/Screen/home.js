
import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SearchBar from "material-ui-search-bar";
import axios from 'axios';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import BarChart from 'react-bar-chart';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

export default function Home(props) {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [reg, setReg] = useState('');
  const [loading, setLoading] = useState(false)
  const [loadingChart, setLoadingChart] = useState(false)
  const [error, setError] = useState('');



  const fetchData = async () => {
    try{
      setLoading(true)

      const api = axios.create({
        baseURL: 'http://localhost:4001/api/policy',
      });
  
      const { data } = await api.get('/', {
        params: {
          id: searchId || undefined,
        },
      });
      if(data && data.data) {

        setData(data && data.data);
        setLoading(false)
      }
  
    } catch(err){
      setError(err.message)
      setLoading(false)
    }
  };

  const fetchChartData = async () => {
    try {
      setLoadingChart(true)

      const api = axios.create({
        baseURL: 'http://localhost:4001/api/chart',
      });
  
  
      const { data } = await api.get('/', {
        params: {
          region: reg || '',
        },
      });

      if(data && data.data) {

        setChartData(data && data.data);
        setLoadingChart(false)
      }
  
    } catch(err){
      setError(err.message)
      setLoadingChart(false)
    }

  };

  useEffect(() => {
    fetchData();
  }, [searchId]);

  useEffect(() => {

    fetchChartData();
  }, [reg]);

  const sendData = (id) => {
    props.history.push(`/edit/${id}`);
  }

  if (!(data && data.length) || !(chartData && chartData.length)) {
    return (
      <Box sx={{ display: 'flex', justifyContent:"center",  alignItems:"center"}}>
        <CircularProgress 
        size={80}
        />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ background: '#2E3B55' }}>
          <Toolbar variant="regular">
            {/* <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton> */}
            <Typography variant="h5" color="inherit" component="div">
              Insurance Company
            </Typography>
          </Toolbar>

        </AppBar>

      </Box>
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />

          <Grid
            item
            xs={false}
            sm={4}
            md={6}
          >
            <div className="App">
              <h1>Visualization Graph for Policy</h1>

              <FormControl >
                <InputLabel>Select Region</InputLabel>
                <Select onChange={(e) => { setReg(e.target.value) }} style={{ width: 180 }} >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="North">North</MenuItem>
                  <MenuItem value="South">South</MenuItem>
                  <MenuItem value="East">East</MenuItem>
                  <MenuItem value="West">West</MenuItem>

                </Select>
              </FormControl>

            </div>

            {!loadingChart? 
            
            <BarChart ylabel='Policy Buy'
              xlabel='Months'
              width={900}
              height={600}
              margin={{ top: 150, right: 10, bottom: 40, left: 40 }}
              data={chartData}
            />:        
            <Box sx={{ display: 'flex', justifyContent:"center",  alignItems:"center"}}>
            <CircularProgress 
            size={80}
            />
            </Box>
          }
          </Grid>


          <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
            <List
              item
              xs={false}
              sm={4}
              md={5}
            // subheader={<li />}
            >
              <SearchBar
                onRequestSearch={fetchData}
                onCancelSearch={() => { setSearchId(" ") }}
                // style={{background:"black"}}
                value={searchId}
                onChange={(value) => { setSearchId(value) }}
                placeholder="Search by policy/customer id.."
                autoFocus
              />
              <Divider variant="inset" component="li" />
              {!loading ? data.map((item) => (

                <>
                  <Paper sx={{ p: 2, margin: 'auto', flexGrow: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm container>
                        <Grid item xs container direction="column" spacing={2}>
                          <Grid item xs>
                            <Typography gutterBottom variant="subtitle1" component="div">
                              {`Policy Number:- ${item.Policy_id}`}
                            </Typography>
                            <Typography variant="body2" color="div">
                              {`Customer Id:- ${item.Customer_id}`}
                            </Typography>
                            <Typography gutterBottom variant="body2" component="div">
                              {`Gender:- ${item.Customer_Gender}`}
                            </Typography>
                            <Typography gutterBottom variant="body2" component="div">
                              {`Region :- ${item.Customer_Region}`}
                            </Typography>

                          </Grid>

                        </Grid>
                        <Grid item>
                          <Typography variant="subtitle1" component="div">
                            {`Premium :- ${item.Premium}`}
                          </Typography>
                          <Grid item>
                            <Button variant="contained" style={{ color: '#2E3B55' }} onClick={() => {
                              sendData(item.Policy_id)
                            }}>Edit Policy</Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                  <Divider variant="inset" component="li" />
                </>
              )) :        
              <Box sx={{ display: 'flex', justifyContent:"center",  alignItems:"center"}}>
              
              <CircularProgress 
              // variant="determinate"
              sx={{
                color: 'blue',
                scrollMarginTop: 200
              }}
              size={80}
              // thickness={4}
              />
              </Box> 
              }
            </List>
            {/* </Box> */}
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}