import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Card, CardHeader, CardContent, Typography, Divider, LinearProgress } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'firebaseoptions';
//project import
import SalesLineCard from 'views/Dashboard/card/SalesLineCard';
import SalesLineCardData from 'views/Dashboard/card/sale-chart-1';
import RevenuChartCard from 'views/Dashboard/card/RevenuChartCard';
import RevenuChartCardData from 'views/Dashboard/card/revenu-chart';
import ReportCard from './ReportCard';

import { gridSpacing } from 'config.js';

// assets
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EmojiPeopleTwoTone from '@mui/icons-material/EmojiPeopleTwoTone';
import ArticleTwoTone from '@mui/icons-material/ArticleTwoTone';

// import Thumb from '@mui/icons-material/ThumbAltTwoTone';
import GroupsTwoTone from '@mui/icons-material/GroupsTwoTone'
import CalendarTodayTwoTone from '@mui/icons-material/CalendarTodayTwoTone';
import { useNavigate } from 'react-router-dom';
// import { ThumbUpOffAltTwoTone } from '@mui/icons-material';

// custom style
const FlatCardBlock = styled((props) => <Grid item sm={6} xs={12} {...props} />)(({ theme }) => ({
  padding: '25px 25px',
  borderLeft: '1px solid' + theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    borderLeft: 'none',
    borderBottom: '1px solid' + theme.palette.background.default
  },
  [theme.breakpoints.down('md')]: {
    borderBottom: '1px solid' + theme.palette.background.default
  }
}));

// ==============================|| DASHBOARD DEFAULT ||============================== //

const Default = () => {
  const theme = useTheme();
   const [leadCount, setLeadCount] = useState(0);
const [courseCount, setCourseCount]=useState(0);
const[newsCount, setNewsCount]=useState(0);
 const [studentCount, setStudentCount] = useState(0);
 const[trainerCount,setTrainerCount]=useState(0)
  const [isAdmin, setIsAdmin] = useState(false); 
const navigate = useNavigate();


  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'leads'));
        setLeadCount(snapshot.size); // total count of documents
      } catch (err) {
        console.error('Error fetching leads:', err);
      }
    };

    fetchLeads();
  }, []);
    useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'courses'));
        setCourseCount(snapshot.size); 
      } catch (error) {
        console.error('Error fetching course count:', error);
      }
    };

    fetchCourses();
  }, []);
  useEffect(() => {
    const fetchNewsCount = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'news')); // Your Firestore collection
        setNewsCount(snapshot.size);
      } catch (error) {
        console.error('Error fetching news count:', error);
      }
    };

    fetchNewsCount();
  }, []);

  useEffect(() => {
  
    const fetchCurrentUser = async () => {
      const userSnapshot = await getDocs(collection(db, 'users')); 
      const userList = userSnapshot.docs.map(doc => doc.data());
      const currentUser = userList.find(u => u.uid === 'LOGGED_IN_UID'); 
      setIsAdmin(currentUser?.isAdmin ?? false);
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      const fetchStudentCount = async () => {
        try {
          const snapshot = await getDocs(collection(db, 'users'));
          const students = snapshot.docs
            .map((doc) => doc.data())
            .filter((doc) => doc.isAdmin === false);

          setStudentCount(students.length);
        } catch (error) {
          console.error('Error fetching student count:', error);
        }
      };

      fetchStudentCount();
    }
  }, [isAdmin]);

useEffect(() => {
    const fetchTrainerCount = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'trainers')); // Your Firestore collection
        setTrainerCount(snapshot.size);
      } catch (error) {
        console.error('Error fetching trainers count:', error);
      }
    };

    fetchTrainerCount();
  }, []);
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid container spacing={gridSpacing} justifyContent="center">
  <Grid item lg={2.4} md={4} sm={6} xs={12}>
    <ReportCard
      primary={leadCount}
      secondary="Total Leads"
      color={theme.palette.warning.main}
      footerData="Leads Count"
      iconPrimary={EmojiPeopleTwoTone}
      iconFooter={TrendingUpIcon}
      onClick={() => navigate('/sample-page')}
    />
  </Grid>

  <Grid item lg={2.4} md={4} sm={6} xs={12}>
    <ReportCard
      primary={courseCount}
      secondary="Courses"
      color={theme.palette.info.main}
      footerData="Courses Count"
      iconPrimary={CalendarTodayTwoTone}
      iconFooter={TrendingUpIcon}
      onClick={() => navigate('/Courses/coursesPage')}
    />
  </Grid>

  <Grid item lg={2.4} md={4} sm={6} xs={12}>
    <ReportCard
      primary={newsCount}
      secondary="News"
      color={theme.palette.success.main}
      footerData="News Count"
      iconPrimary={ArticleTwoTone}
      iconFooter={TrendingUpIcon}
      onClick={() => navigate('/News/newsPage')}
    />
  </Grid>

  {!isAdmin && (
    <Grid item lg={2.4} md={4} sm={6} xs={12}>
      <ReportCard
        primary={studentCount}
        secondary="Students"
        color={theme.palette.primary.main}
        footerData="Students Count"
        iconPrimary={GroupsTwoTone}
        iconFooter={TrendingUpIcon}
        onClick={() => navigate('/Users/usersPage')}
      />
    </Grid>
  )}

  <Grid item lg={2.4} md={4} sm={6} xs={12}>
    <ReportCard
      primary={trainerCount}
      secondary="Trainers"
      color="#9c27b0"
      footerData="Trainers Count"
      iconPrimary={ArticleTwoTone}
      iconFooter={TrendingUpIcon}
      onClick={() => navigate('/Trainers/trainersPage')}
    />
  </Grid>
</Grid>

          </Grid>
      </Grid>
     <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={8} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={gridSpacing}>
                  {/* <Grid item xs={12}>
                    <SalesLineCard
                      chartData={SalesLineCardData}
                      title="Sales Per Day"
                      percentage="3%"
                      icon={<TrendingDownIcon />}
                      footerData={[
                        {
                          value: '$4230',
                          label: 'Total Revenue'
                        },
                        {
                          value: '321',
                          label: 'Today Sales'
                        }
                      ]}
                    />
                  </Grid> */}
                  {/* <Grid item xs={12} sx={{ display: { md: 'block', sm: 'none' } }}>
                    <Card>
                      <CardContent sx={{ p: '0 !important' }}>
                        <Grid container alignItems="center" spacing={0}>
                          <FlatCardBlock>
                            <Grid container alignItems="center" spacing={1}>
                              <Grid item>
                                <Typography variant="subtitle2" align="left">
                                  REALTY
                                </Typography>
                              </Grid>
                              <Grid item sm zeroMinWidth>
                                <Typography variant="h5" sx={{ color: theme.palette.error.main }} align="right">
                                  -0.99
                                </Typography>
                              </Grid>
                            </Grid>
                          </FlatCardBlock>
                          <FlatCardBlock>
                            <Grid container alignItems="center" spacing={1}>
                              <Grid item>
                                <Typography variant="subtitle2" align="left">
                                  INFRA
                                </Typography>
                              </Grid>
                              <Grid item sm zeroMinWidth>
                                <Typography variant="h5" sx={{ color: theme.palette.success.main }} align="right">
                                  -7.66
                                </Typography>
                              </Grid>
                            </Grid>
                          </FlatCardBlock>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid> */}
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                {/* <RevenuChartCard chartData={RevenuChartCardData} /> */}
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={4} xs={12}>
            {/* <Card>
              <CardHeader
                title={
                  <Typography component="div" className="card-header">
                    Traffic Sources
                  </Typography>
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Direct</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          80%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="direct" value={80} color="primary" />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Social</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          50%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="Social" value={50} color="secondary" />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Referral</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          20%
                        </Typography> 
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="Referral" value={20} color="primary" />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Bounce</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          60%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="Bounce" value={60} color="secondary" />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Internet</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          40%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="Internet" value={40} color="primary" />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card> */}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Default;
