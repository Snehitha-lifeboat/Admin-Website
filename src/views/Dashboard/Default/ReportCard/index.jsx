import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

// ==============================|| REPORT CARD ||============================== //

const ReportCard = ({ primary, secondary, iconPrimary, color, footerData, iconFooter, onClick }) => {
  const theme = useTheme();
  const IconPrimary = iconPrimary;
  const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;
  const IconFooter = iconFooter;
  const footerIcon = iconFooter ? <IconFooter /> : null;

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: onClick ? 'scale(1.02)' : 'none'
        }
      }}
    >
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" sx={{ color: color }}>
              {primary}
            </Typography>
            <Typography variant="subtitle1" sx={{ marginTop: '.5rem' }}>
              {secondary}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h2" sx={{ color: color }}>
              {primaryIcon}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Box sx={{ background: color }}>
        <Grid
          container
          justifyContent="space-between"
          sx={{
            textAlign: 'center',
            padding: theme.spacing(1.2),
            pl: 2.5,
            pr: 2.5,
            color: theme.palette.common.white
          }}
        >
          <Grid item>
            <Typography variant="body2">{footerData}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">{footerIcon}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

ReportCard.propTypes = {
  primary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  secondary: PropTypes.string,
  iconPrimary: PropTypes.elementType,
  footerData: PropTypes.string,
  iconFooter: PropTypes.elementType,
  color: PropTypes.string,
  onClick: PropTypes.func
};

export default ReportCard;
